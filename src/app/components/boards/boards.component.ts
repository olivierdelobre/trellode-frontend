import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: Board[] = [];

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.boardService.getBoards().subscribe(
      (data: any) => {
        this.boards = data;
        console.log(this.boards);
      });
  }

  addBoard(): void {
    let newBoard: Board = {
      id: 0,
      userId: 0,
      title: 'New Board',
      backgroundImage: '',
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.boardService.createBoard(newBoard).subscribe(() => {
      this.loadBoards();
    });
  }

  updateBoard(board: Board): void {
    this.boardService.updateBoard(board).subscribe(() => {
      this.loadBoards();
    });
  }

  archiveBoard(boardId: number): void {
    this.boardService.archiveBoard(boardId).subscribe(() => {
      this.loadBoards();
    });
  }
}

