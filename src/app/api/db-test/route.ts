import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Testar a conexão com o banco de dados
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    return NextResponse.json(
      {
        success: true,
        message: "Conexão com o banco de dados estabelecida com sucesso",
        result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao conectar ao banco de dados:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar ao banco de dados",
        error: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
