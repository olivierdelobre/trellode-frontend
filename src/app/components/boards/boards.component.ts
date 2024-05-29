import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BoardFormComponent } from '../board-form/board-form.component';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { Subscription } from 'rxjs/internal/Subscription';

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
    background: {
      id: 0,
      data: ''
    },
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    menuColorDark: '',
    menuColorLight: '',
    listColor: '',
    backgroundId: 0,
    archivedAt: new Date(0)
  };
  newBoardTitleContent: string = '';
  archived: string = "";
  count: number = -1;

  private queryParamSubscription: Subscription = new Subscription;
  
  constructor(private boardService: BoardService,
    private broadcastService: BroadcastService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BoardFormComponent>,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.broadcastService.refreshBoard.subscribe({
      next: (data: any) => {
        if (data) {
          this.loadBoards(this.archived == "1");
        }
      }
    });

    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.archived = params['archived'];
      this.loadBoards(this.archived == "1");
    });
  }

  loadBoards(archived: boolean): void {
    this.boardService.getBoards(archived).subscribe(
      (data: any) => {
        this.boards = data;
        this.count = this.boards.length;
      });
  }

  addBoard(): void {
    let newBoard: Board = {
      id: 0,
      userId: 0,
      title: this.newBoardTitleContent,
      background: {
        id: 0,
        data: ''
      },
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      menuColorDark: '',
      menuColorLight: '',
      listColor: '',
      backgroundId: 0,
      archivedAt: new Date(0)
    };
    this.boardService.createBoard(newBoard).subscribe(() => {
      this.loadBoards(this.archived == "1");
    });
  }

  updateBoard(board: Board): void {
    this.boardService.updateBoard(board).subscribe(() => {
      this.loadBoards(this.archived == "1");
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

