import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pega o token que salvamos no cookie pelo client-side
  const token = request.cookies.get('token')?.value;

  // Verifica em qual página o usuário está tentando entrar
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

  // Regra 1: Não tem token e NÃO está na página de login/cadastro? Manda pro login.
  if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Regra 2: Tem token e está tentando acessar a tela de login/cadastro ou a raiz? Manda pra dashboard.
  if (token && (isAuthPage || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Regra 3: Tudo certo, deixa passar.
  return NextResponse.next();
}

// IMPORTANTE: Isso impede o middleware de rodar em imagens, css, favicon e travar a página
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
