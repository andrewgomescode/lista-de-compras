import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/options";

// GET - Buscar itens do usuário
export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const items = await prisma.item.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(items);
}

// POST - Criar novo item
export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await request.json();
  const { name, quantity, category } = data;

  if (!name || !quantity || !category) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: {
      name,
      quantity,
      category,
      checked: false,
      userId: session.user.id,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

// PUT - Atualizar item
export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await request.json();
  const { id, checked } = data;

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  // Verificar se o item pertence ao usuário
  const item = await prisma.item.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  const updatedItem = await prisma.item.update({
    where: { id },
    data: { checked },
  });

  return NextResponse.json(updatedItem);
}

// DELETE - Remover item
export async function DELETE(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  // Verificar se o item pertence ao usuário
  const item = await prisma.item.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }

  await prisma.item.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
