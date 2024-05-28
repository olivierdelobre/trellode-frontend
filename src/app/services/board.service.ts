import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, List, Card, Comment } from '../models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = environment.settings.api;

  constructor(private http: HttpClient) {}

  // Board operations
  getBoard(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/v1/boards/${id}`);
  }

  getBoards(): Observable<Board[]> {
    console.log("getting boards "+this.apiUrl);
    return this.http.get<Board[]>(`${this.apiUrl}/v1/boards`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/v1/boards`, board);
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/v1/boards/${board.id}`, board);
  }

  archiveBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/boards/${boardId}`);
  }

  // List operations
  getList(id: number): Observable<List> {
    return this.http.get<List>(`${this.apiUrl}/v1/lists/${id}`);
  }

  createList(boardId: number, list: List): Observable<List> {
    return this.http.post<List>(`${this.apiUrl}/v1/lists`, list);
  }

  updateList(list: List): Observable<List> {
    return this.http.put<List>(`${this.apiUrl}/v1/lists/${list.id}`, list);
  }

  archiveList(listId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/lists/${listId}`);
  }

  // Card operations
  getCard(id: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/v1/cards/${id}`);
  }

  createCard(listId: number, card: Card): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/v1/cards`, card);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/v1/cards/${card.id}`, card);
  }

  archiveCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/cards/${cardId}`);
  }

  // Comment operations
  getComment(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/v1/comments/${id}`);
  }

  getComments(cardId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/v1/cards/${cardId}/comments`);
  }

  createComment(cardId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/v1/comments`, comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/v1/comments/${comment.id}`, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/comments/${commentId}`);
  }
}

