import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BoardFormComponent } from '../board-form/board-form.component';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: Board[] = [];
  recentBoards: Board[] = [];
  board: Board = {
    id: "",
    userId: "",
    title: '',
    background: {
      id: "",
      data: ''
    },
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    menuColorDark: '',
    menuColorLight: '',
    listColor: '',
    backgroundId: "",
    archivedAt: new Date(0),
    openedAt: new Date(),
  };
  newBoardTitleContent: string = '';
  archived: string = "";
  count: number = -1;

  private queryParamSubscription: Subscription = new Subscription;
  
  constructor(private boardService: BoardService,
    private broadcastService: BroadcastService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BoardFormComponent>,
    private route: ActivatedRoute,
    private miscService: MiscService) {}

  ngOnInit(): void {
    this.broadcastService.refreshBoard.subscribe({
      next: (data: any) => {
        if (data) {
          this.loadBoards(this.archived == "1");
        }
      },
      error: (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });

    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.archived = params['archived'];
      this.loadBoards(this.archived == "1");
    });
  }

  loadBoards(archived: boolean): void {
    this.boardService.getBoards(archived).subscribe({
      next: (data: any) => {
        this.boards = data;
        this.count = this.boards.length;

        this.recentBoards = [];
        for (let board of this.boards) {
          this.recentBoards.push(board);
        }

        // sort this.boards by openedAt
        this.recentBoards.sort((a, b) => {
          if (a.openedAt > b.openedAt) {
            return -1;
          }
          if (a.openedAt < b.openedAt) {
            return 1;
          }
          return 0;
        });
        // only keep 4 first elements of this.recentBoards
        if (this.boards.length > 4) {
          this.recentBoards = this.recentBoards.slice(0, 4);
        }
      },
      error: (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  addBoard(): void {
    let newBoard: Board = {
      id: "",
      userId: "",
      title: this.newBoardTitleContent,
      background: {
        id: "",
        data: ''
      },
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      menuColorDark: '',
      menuColorLight: '',
      listColor: '',
      backgroundId: "",
      archivedAt: new Date(0),
      openedAt: new Date(),
    };
    this.archived = "";
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

