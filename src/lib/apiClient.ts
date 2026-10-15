const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export async function fetchFromBackend<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string; error?: unknown }> {
  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${cleanEndpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Backend connection failed';
    console.warn(`[Backend Fetch Warning] Endpoint ${endpoint} unreachable:`, errMessage);
    return {
      success: false,
      error: { code: 'BACKEND_UNREACHABLE', message: errMessage },
    };
  }
}
