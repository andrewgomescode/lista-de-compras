import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email já está em uso" },
        { status: 400 }
      );
    }

    // Criar o usuário
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

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

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
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
      },
      { status: 500 }
    );
  }
}
