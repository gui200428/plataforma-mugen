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

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  position: number;
  moduleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
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
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse<UserProfile>(response);
}

// ----------------------------------------------------
// Admin & Content Endpoints
// ----------------------------------------------------

export async function adminLoginRequest(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getModules(token?: string): Promise<Module[]> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}/modules`, { headers });
  return handleResponse<Module[]>(response);
}

export async function createModule(
  token: string,
  data: { title: string; description?: string; position?: number }
): Promise<Module> {
  const response = await fetch(`${API_URL}/modules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Module>(response);
}

export async function updateModule(
  token: string,
  id: number,
  data: { title?: string; description?: string; position?: number }
): Promise<Module> {
  const response = await fetch(`${API_URL}/modules/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Module>(response);
}

export async function createLesson(
  token: string,
  data: { title: string; videoUrl: string; moduleId: number; position?: number }
): Promise<Lesson> {
  const response = await fetch(`${API_URL}/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Lesson>(response);
}

export async function updateLesson(
  token: string,
  id: number,
  data: { title?: string; videoUrl?: string; position?: number; moduleId?: number }
): Promise<Lesson> {
  const response = await fetch(`${API_URL}/lessons/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Lesson>(response);
}

export async function getLesson(token: string, id: number): Promise<Lesson> {
  const response = await fetch(`${API_URL}/lessons/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse<Lesson>(response);
}

// ----------------------------------------------------
// Admin — Users Management
// ----------------------------------------------------

export interface StudentUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUsers(token: string): Promise<StudentUser[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse<StudentUser[]>(response);
}

// ----------------------------------------------------
// Admin — Sales Management
// ----------------------------------------------------

export interface Sale {
  id: number;
  transaction: string;
  buyerEmail: string;
  buyerName: string;
  productId: string;
  productName: string;
  status: string;
  hotmartPayload: any;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getSales(token: string): Promise<Sale[]> {
  const response = await fetch(`${API_URL}/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse<Sale[]>(response);
}
