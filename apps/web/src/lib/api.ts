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

/* -------------------------------------------------------------------------- */
/* Auth                                                                      */
/* -------------------------------------------------------------------------- */

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
): Promise<{ user: User }> {
  return request<{ user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

/* -------------------------------------------------------------------------- */
/* Tags                                                                      */
/* -------------------------------------------------------------------------- */

export type Tag = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    noteTags: number;
  };
};

export type TagsResponse = {
  tags: Tag[];
};

export type TagResponse = {
  tag: Tag;
};

export type NoteTag = {
  id: string;
  noteId: string;
  tagId: string;
  tag: Tag;
};

export type NoteTagResponse = {
  noteTag: NoteTag;
};

export async function getTags(): Promise<TagsResponse> {
  return request<TagsResponse>("/tags");
}

export async function createTag(
  name: string,
): Promise<TagResponse> {
  return request<TagResponse>("/tags", {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });
}

export async function updateTag(
  tagId: string,
  name: string,
): Promise<TagResponse> {
  return request<TagResponse>(`/tags/${tagId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
    }),
  });
}

export async function deleteTag(
  tagId: string,
): Promise<void> {
  await request(`/tags/${tagId}`, {
    method: "DELETE",
  });
}

export async function attachTagToNote(
  noteId: string,
  tagId: string,
): Promise<NoteTagResponse> {
  return request<NoteTagResponse>(
    `/tags/notes/${noteId}/${tagId}`,
    {
      method: "POST",
    },
  );
}

export async function removeTagFromNote(
  noteId: string,
  tagId: string,
): Promise<void> {
  await request(
    `/tags/notes/${noteId}/${tagId}`,
    {
      method: "DELETE",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Collections                                                               */
/* -------------------------------------------------------------------------- */

export type Collection = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    notes: number;
  };
};

export type CollectionWithNotes = Collection & {
  notes: Note[];
};

export type CollectionsResponse = {
  collections: Collection[];
};

export type CollectionResponse = {
  collection: Collection;
};

export type CollectionDetailsResponse = {
  collection: CollectionWithNotes;
};

export type CreateCollectionPayload = {
  name: string;
};

export type UpdateCollectionPayload = {
  name: string;
};

export async function getCollections(): Promise<CollectionsResponse> {
  return request<CollectionsResponse>("/collections");
}

export async function getCollection(
  collectionId: string,
): Promise<CollectionDetailsResponse> {
  return request<CollectionDetailsResponse>(
    `/collections/${collectionId}`,
  );
}

export async function createCollection(
  payload: CreateCollectionPayload,
): Promise<CollectionResponse> {
  return request<CollectionResponse>("/collections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCollection(
  collectionId: string,
  payload: UpdateCollectionPayload,
): Promise<CollectionResponse> {
  return request<CollectionResponse>(
    `/collections/${collectionId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteCollection(
  collectionId: string,
): Promise<void> {
  await request(`/collections/${collectionId}`, {
    method: "DELETE",
  });
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                      */
/* -------------------------------------------------------------------------- */

export type Note = {
  id: string;
  userId: string;
  collectionId: string | null;

  title: string;
  content: string;

  sourceUrl: string | null;
  sourceTitle: string | null;
  sourceTextBefore: string | null;
  sourceTextAfter: string | null;

  summary: string | null;

  isFavorite: boolean;
  isArchived: boolean;

  createdAt: string;
  updatedAt: string;

  collection?: Collection | null;
  noteTags?: NoteTag[];
};

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

export async function getNote(
  noteId: string,
): Promise<NoteResponse> {
  return request<NoteResponse>(`/notes/${noteId}`);
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

export async function deleteNote(
  noteId: string,
): Promise<void> {
  await request(`/notes/${noteId}`, {
    method: "DELETE",
  });
}

export async function summarizeNote(
  noteId: string,
): Promise<NoteResponse> {
  return request<NoteResponse>(
    `/notes/${noteId}/summarize`,
    {
      method: "POST",
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

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