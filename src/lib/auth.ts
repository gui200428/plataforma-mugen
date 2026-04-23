import { cookies } from "next/headers";

const TOKEN_COOKIE = "apv_token";

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}
