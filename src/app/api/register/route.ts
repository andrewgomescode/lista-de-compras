import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("Iniciando processo de registro");
    const { name, email, password } = await req.json();
    console.log("Dados recebidos:", { name, email, passwordLength: password?.length });

    // Validações básicas
    if (!email || !password) {
      console.log("Validação falhou: email ou senha ausentes");
      return NextResponse.json(
        { 
          message: "Email e senha são obrigatórios",
          success: false 
        },
        { status: 400 }
      );
    }

    console.log("Verificando se o email já está em uso");
    // Verificar se o email já está em uso
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log("Email já está em uso:", email);
        return NextResponse.json(
          { 
            message: "Email já está em uso",
            success: false
          },
          { status: 400 }
        );
      }
      console.log("Email disponível, continuando com o registro");
    } catch (error) {
      console.error("Erro ao verificar email existente:", error);
      return NextResponse.json(
        { 
          message: "Erro ao verificar disponibilidade do email",
          error: error instanceof Error ? error.message : "Erro desconhecido",
          success: false
        },
        { status: 500 }
      );
    }

    console.log("Criando hash da senha");
    // Criar o usuário
    const hashedPassword = await hash(password, 10);
    console.log("Hash criado com sucesso");
    
    console.log("Criando usuário no banco de dados");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log("Usuário criado com sucesso, ID:", user.id);

    console.log("Criando item de exemplo");
    // Criar um item de exemplo para o usuário
    await prisma.item.create({
      data: {
        name: "Item de exemplo",
        quantity: 1,
        category: "geral",
        checked: false,
        userId: user.id,
      },
    });
    console.log("Item de exemplo criado com sucesso");

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso",
        success: true
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);

    // Detalhamento do erro para ajudar no diagnóstico
    const errorMessage = error.message || "Erro desconhecido";
    const errorCode = error.code || "UNKNOWN_ERROR";

    return NextResponse.json(
      {
        message: "Erro ao criar usuário",
        error: errorMessage,
        code: errorCode,
        details:
          process.env.NODE_ENV !== "production" ? error.stack : undefined,
        success: false
      },
      { status: 500 }
    );
  }
}