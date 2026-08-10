const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("memdev_token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as
    | T
    | ApiErrorResponse;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new ApiError(
      errorData.message ?? "Something went wrong",
      response.status,
      errorData.errors,
    );
  }

  return data as T;
}

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type MeResponse = {
  user: User;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(
  payload: LoginPayload,
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

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

export type DashboardStats = {
  totalNotes: number;
  favoriteNotes: number;
  archivedNotes: number;
  totalCollections: number;
  totalTags: number;
  recentNotes: Note[];
};

export type DashboardStatsResponse = {
  stats: DashboardStats;
};

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  return request<DashboardStatsResponse>("/dashboard/stats");
}

export async function getCurrentUser(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

export type NotesResponse = {
  notes: Note[];
};

export type NoteResponse = {
  note: Note;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  sourceUrl?: string;
  collectionId?: string;
};

export type UpdateNotePayload = {
  title?: string;
  content?: string;
  sourceUrl?: string | null;
  collectionId?: string | null;
  isFavorite?: boolean;
  isArchived?: boolean;
};

export async function getNotes(): Promise<NotesResponse> {
  return request<NotesResponse>("/notes");
}

export async function createNote(
  payload: CreateNotePayload,
): Promise<NoteResponse> {
  return request<NoteResponse>("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNote(
  noteId: string,
  payload: UpdateNotePayload,
): Promise<NoteResponse> {
  return request<NoteResponse>(`/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  await request(`/notes/${noteId}`, {
    method: "DELETE",
  });
}