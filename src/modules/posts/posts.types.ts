export type PostAuthorResponse = {
  id: string;
  email: string;
  name: string;
};

export type PostResponse = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: PostAuthorResponse;
};

export type PostRecord = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    email: string;
    name: string;
  } | null;
};
