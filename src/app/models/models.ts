export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Background {
  id: number;
  data: string;
}

export interface Board {
  id: number;
  userId: number;
  title: string;
  backgroundId: number;
  background: Background;
  menuColorDark: string;
  menuColorLight: string;
  listColor: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
}

export interface List {
  id: number;
  boardId: number;
  title: string;
  position: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
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
  archivedAt: Date;
}

export interface Comment {
  id: number;
  cardId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Log {
  id: number;
  userId: number;
  user: User;
  boardId: number;
  action: string;
  actionTargetId: number;
  actionTargetTitle: string;
  changes: LogChange[];
  createdAt: Date;
}

export interface LogChange {
  field: string;
  fromValue: string;
  toValue: string;
}
