import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Este middleware executa antes de cada requisição
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
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

// Configurar quais rotas o middleware deve proteger
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas exceto:
     * 1. /api (rotas de API)
     * 2. /_next (arquivos internos do Next.js)
     * 3. /_static (se você usar o export 'output: export')
     * 4. /favicon.ico, /sitemap.xml (arquivos estáticos)
     */
    "/((?!api|_next|_static|favicon.ico|sitemap.xml).*)",
  ],
};
