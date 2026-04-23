const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: body.message || "Ocorreu um erro inesperado",
      statusCode: response.status,
    };
    throw error;
  }
  return response.json();
}

export async function loginRequest(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getProfile(token: string): Promise<UserProfile> {
  const baseUrl = typeof window === "undefined"
    ? (process.env.API_URL || API_URL)
    : API_URL;

  const response = await fetch(`${baseUrl}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse<UserProfile>(response);
}
