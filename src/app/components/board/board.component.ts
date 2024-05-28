import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board, List } from '../../models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  boardId: number = 0;
  board: Board = {
    id: 0,
    userId: 0,
    title: '',
    backgroundImage: '',
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(private route: ActivatedRoute,
    private boardService: BoardService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.boardId = params.id;
          this.loadBoard();
        }
      }
    );
  }

  loadBoard(): void {
    this.boardService.getBoard(this.boardId).subscribe(
      (data: any) => {
        this.board = data;
      });
  }

  addList(): void {
    let newList: List = {
      id: 0,
      boardId: this.boardId,
      title: 'New List',
      position: 0,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.boardService.createList(this.boardId, newList).subscribe(() => {
      this.loadBoard();
    });
  }

  updateList(list: List): void {
    this.boardService.updateList(list).subscribe(() => {
      this.loadBoard();
    });
  }

  archiveList(listId: number): void {
    this.boardService.archiveList(listId).subscribe(() => {
      this.loadBoard();
    });
  }
}

