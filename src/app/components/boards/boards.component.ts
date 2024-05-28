import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/models';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BoardFormComponent } from '../board-form/board-form.component';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: Board[] = [];
  board: Board = {
    id: 0,
    userId: 0,
    title: '',
    backgroundImage: '',
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  newBoardTitleContent: string = '';

  constructor(private boardService: BoardService,
    private broadcastService: BroadcastService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BoardFormComponent>
  ) {}

  ngOnInit(): void {
    this.loadBoards();

    this.broadcastService.refreshBoard.subscribe({
      next: (data: any) => {
        if (data) {
          this.loadBoards();
        }
      }
    });
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

  openBoardForm() {
    // Pass clone to avoid data being modified in service detail component
    const config: MatDialogConfig = {
      panelClass: 'lg-popup',
      backdropClass: 'preview-popup-backdrop',
      data: { board: this.board }
    };

    this.dialogRef = this.dialog.open(BoardFormComponent, config);
    
    //this.dialogRef.componentInstance.onSuccess.subscribe(() => {
    //  this.broadcastService.updateRefreshList(0);
    //});
  }
}

