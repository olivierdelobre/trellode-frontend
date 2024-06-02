import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, List, Card, Comment, Background, Log, Checklist, ChecklistItem } from '../models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = environment.settings.api;

  constructor(private http: HttpClient) {}

  // Board operations
  getBoard(id: string): Observable<Board> {
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

  deleteBackground(backgroundId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/backgrounds/${backgroundId}`);
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/v1/boards`, board);
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/v1/boards/${board.id}`, board);
  }

  deleteBoard(boardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/boards/${boardId}`);
  }

  // List operations
  getList(id: string): Observable<List> {
    return this.http.get<List>(`${this.apiUrl}/v1/lists/${id}`);
  }

  createList(boardId: string, list: List): Observable<List> {
    return this.http.post<List>(`${this.apiUrl}/v1/lists`, list);
  }

  updateList(list: List): Observable<List> {
    return this.http.put<List>(`${this.apiUrl}/v1/lists/${list.id}`, list);
  }

  deleteList(listId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/lists/${listId}`);
  }

  // Card operations
  getCard(id: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/v1/cards/${id}`);
  }

  createCard(listId: string, card: Card): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/v1/cards`, card);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/v1/cards/${card.id}`, card);
  }

  deleteCard(cardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/cards/${cardId}`);
  }

  // Comment operations
  getComment(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/v1/comments/${id}`);
  }

  getComments(cardId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/v1/cards/${cardId}/comments`);
  }

  createComment(cardId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/v1/comments`, comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/v1/comments/${comment.id}`, comment);
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/comments/${commentId}`);
  }

  getLogs(boardId: string): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiUrl}/v1/logs?boardid=${boardId}`);
  }

  changeCardOrder(listId: string, idsOrdered: string) {
    return this.http.put(`${this.apiUrl}/v1/lists/${listId}/order`, { idsOrdered: idsOrdered });
  }

  changListOrder(boardId: string, idsOrdered: string) {
    return this.http.put(`${this.apiUrl}/v1/boards/${boardId}/order/${idsOrdered}`, {});
  }

  // Checklist operations
  getChecklist(id: string): Observable<Checklist> {
    return this.http.get<Checklist>(`${this.apiUrl}/v1/checklists/${id}`);
  }

  createChecklist(checklist: Checklist): Observable<Checklist> {
    return this.http.post<Checklist>(`${this.apiUrl}/v1/checklists`, checklist);
  }

  updateChecklist(checklist: Checklist): Observable<Checklist> {
    return this.http.put<Checklist>(`${this.apiUrl}/v1/checklists/${checklist.id}`, checklist);
  }

  deleteChecklist(checklistId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/checklists/${checklistId}`);
  }

  getChecklistItem(id: string): Observable<ChecklistItem> {
    return this.http.get<ChecklistItem>(`${this.apiUrl}/v1/checklistitems/${id}`);
  }

  createChecklistItem(checklistItem: ChecklistItem): Observable<ChecklistItem> {
    return this.http.post<ChecklistItem>(`${this.apiUrl}/v1/checklistitems`, checklistItem);
  }

  updateChecklistItem(checklistItem: ChecklistItem): Observable<ChecklistItem> {
    return this.http.put<ChecklistItem>(`${this.apiUrl}/v1/checklistitems/${checklistItem.id}`, checklistItem);
  }

  deleteChecklistItem(checklistItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/checklistitems/${checklistItemId}`);
  }

  changeChecklistItemsOrder(checklistId: string, idsOrdered: string) {
    return this.http.put(`${this.apiUrl}/v1/checklists/${checklistId}/order`, { idsOrdered: idsOrdered });
  }

  changeListsOrder(boardId: string, idsOrdered: string) {
    return this.http.put(`${this.apiUrl}/v1/boards/${boardId}/order`, { idsOrdered: idsOrdered });
  }
}

