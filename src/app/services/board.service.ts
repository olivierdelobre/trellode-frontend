import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, List, Card, Comment, Background, Log } from '../models/models';
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

  getBoards(archived: boolean): Observable<Board[]> {
    let suffix = ""
    if (archived) {
      suffix = "?archived=1"
    }
    return this.http.get<Board[]>(`${this.apiUrl}/v1/boards${suffix}`);
  }

  getBackgrounds(): Observable<Background[]> {
    return this.http.get<Background[]>(`${this.apiUrl}/v1/backgrounds`);
  }

  createBackground(uploadData: any): Observable<Background> {
    let headers = new HttpHeaders()
            .set('Content-Type', 'text/plain')
            .set('Accept', 'application/json');
    return this.http.post<Background>(`${this.apiUrl}/v1/backgrounds`, {data: uploadData}, {headers: headers});
  }

  deleteBackground(backgroundId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/backgrounds/${backgroundId}`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/v1/boards`, board);
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/v1/boards/${board.id}`, board);
  }

  deleteBoard(boardId: number): Observable<void> {
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

  deleteList(listId: number): Observable<void> {
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

  deleteCard(cardId: number): Observable<void> {
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

  getLogs(boardId: number): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/v1/logs?boardid=${boardId}`);
  }

  changeCardOrder(listId: number, idsOrdered: string) {
    return this.http.put(`${this.apiUrl}/v1/lists/${listId}/order/${idsOrdered}`, {});
  }
}

