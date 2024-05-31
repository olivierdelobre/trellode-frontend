export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Background {
  id: string;
  data: string;
}

export interface Board {
  id: string;
  userId: string;
  title: string;
  backgroundId: string;
  background: Background;
  menuColorDark: string;
  menuColorLight: string;
  listColor: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
  openedAt: Date;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  position: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  description: string;
  position: number;
  comments: Comment[];
  checklists: Checklist[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Log {
  id: string;
  userId: string;
  user: User;
  boardId: string;
  action: string;
  actionTargetId: string;
  actionTargetTitle: string;
  changes: LogChange[];
  createdAt: Date;
}

export interface LogChange {
  field: string;
  fromValue: string;
  toValue: string;
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}