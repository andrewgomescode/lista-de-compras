import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (isAuthPage) {
    if (token) {
      // Se estiver autenticado e tentar acessar login/register, redireciona para a lista
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Se não estiver autenticado e tentar acessar login/register, permite
    return NextResponse.next();
  }

  // Para todas as outras rotas
  if (!token) {
    // Se não estiver autenticado, redireciona para o login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se estiver autenticado, permite o acesso
  return NextResponse.next();
}

// Configurar quais rotas o middleware deve proteger
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
