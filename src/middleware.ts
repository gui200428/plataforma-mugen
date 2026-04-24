import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cookies
  const token = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;

  const pathname = request.nextUrl.pathname;

  // ----------------------------------------------------
  // ADMIN ROUTES (/painel)
  // ----------------------------------------------------
  if (pathname.startsWith('/painel')) {
    const isAdminLogin = pathname === '/painel/login';

    // Se NÃO tem admin_token e tenta acessar qualquer rota que não seja o login admin, vai pro login admin
    if (!adminToken && !isAdminLogin) {
      return NextResponse.redirect(new URL('/painel/login', request.url));
    }

    // Se TEM admin_token e tenta acessar a tela de login admin, vai pro dashboard do admin
    if (adminToken && isAdminLogin) {
      return NextResponse.redirect(new URL('/painel', request.url));
    }

    // Deixa passar as rotas do admin
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // USER ROUTES (/*)
  // ----------------------------------------------------
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Regra 1: Não tem token e NÃO está na página de login/cadastro? Manda pro login.
  if (!token && !isAuthPage && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Regra 2: Tem token e está tentando acessar a tela de login/cadastro ou a raiz? Manda pra dashboard.
  if (token && (isAuthPage || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Regra 3: Tudo certo, deixa passar.
  return NextResponse.next();
}

// IMPORTANTE: Isso impede o middleware de rodar em imagens, css, favicon e travar a página
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
