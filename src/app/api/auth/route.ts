import { NextResponse } from "next/server";

const TOKEN_COOKIE = "apv_token";

// POST — set token cookie
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token é obrigatório" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day (matches JWT expiry)
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

// DELETE — clear token cookie (logout)
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
