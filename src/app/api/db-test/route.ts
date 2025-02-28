import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Iniciando teste de conexão com o banco de dados");
    
    // Mostrar as URLs do banco no console (sem mostrar senhas completas por segurança)
    const dbUrl = process.env.DATABASE_URL || '';
    const directUrl = process.env.DIRECT_URL || '';
    
    console.log("DATABASE_URL:", dbUrl.replace(/:[^:@]*@/, ':****@'));
    console.log("DIRECT_URL:", directUrl.replace(/:[^:@]*@/, ':****@'));
    
    // Testar a conexão com o banco de dados
    console.log("Executando query de teste...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Query executada com sucesso:", result);

    return NextResponse.json(
      {
        success: true,
        message: "Conexão com o banco de dados estabelecida com sucesso",
        result,
        databaseInfo: {
          provider: "PostgreSQL (Neon)",
          url: dbUrl.replace(/:[^:@]*@/, ':****@'),
          directUrl: directUrl.replace(/:[^:@]*@/, ':****@'),
        }
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
        code: error.code,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}