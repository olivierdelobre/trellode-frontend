export interface User {
  id: number;
  email: string;
}

export interface Board {
  id: number;
  userId: number;
  title: string;
  backgroundImage: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: number;
  boardId: number;
  title: string;
  position: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: number;
  listId: number;
  title: string;
  description: string;
  position: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  cardId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
