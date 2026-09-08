const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = new Error(`Request failed: ${res.status} ${res.statusText}`);
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }

  return res.json() as Promise<T>;
}

export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function mockRequest<T>(data: T, ms = 450): Promise<T> {
  await delay(ms);
  return data;
}