const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5000/api";

type ApiErrorResponse = {
  message?: string;
};

export class ExtensionApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "ExtensionApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(
    options.headers,
  );

  headers.set(
    "Content-Type",
    "application/json",
  );

  headers.set(
    "Authorization",
    `Bearer ${token}`,
  );

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    },
  );

  const data = (await response
    .json()
    .catch(() => ({}))) as
    | T
    | ApiErrorResponse;

  if (!response.ok) {
    const errorData =
      data as ApiErrorResponse;

    throw new ExtensionApiError(
      errorData.message ??
        "Something went wrong.",
      response.status,
    );
  }

  return data as T;
}

export type ExtensionUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  sourceUrl?: string;
};

export type Note = {
  id: string;
  userId: string;
  collectionId: string | null;
  title: string;
  content: string;
  sourceUrl: string | null;
  summary: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteResponse = {
  note: Note;
};

export async function getCurrentUser(
  token: string,
) {
  return request<{
    user: ExtensionUser;
  }>("/auth/me", token);
}

export async function createNote(
  token: string,
  payload: CreateNotePayload,
) {
  return request<CreateNoteResponse>(
    "/notes",
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}