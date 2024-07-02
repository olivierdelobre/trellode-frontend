import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Background, Board, List, Log } from '../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { MiscService } from 'src/app/services/misc.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CardFormComponent } from '../card-form/card-form.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  boardId: string = "";
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
  lists: List[] = [];
  backgrounds: Background[] = [];
  logs: Log[] = [];
  showCreateListInput: boolean = false;
  showRightMenu: boolean = false;
  showManageBackground: boolean = false;
  showLogs: boolean = false;
  newListTitleContent: string = '';
  selectedFile: File | null = null;
  base64String: string | null = null;
  @ViewChild('listTitleInput') listTitleInput: any;
  @ViewChild('fullPageContainer') fullPageContainer: any;

  constructor(private route: ActivatedRoute,
    private boardService: BoardService,
    private broadcastService: BroadcastService,
    private miscService: MiscService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CardFormComponent>) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.boardId = params.id;
          this.loadBoard();
        }
      }
    );

    this.broadcastService.refreshBoard.subscribe({
      next: (data: any) => {
        if (data) {
          this.loadBoard();
        }
      }
    });
  }

  loadBoard(): void {
    this.boardService.getBoard(this.boardId).subscribe({
      next: (data: any) => {
        this.board = data;
        this.lists = this.board.lists;
        this.loadLogs(this.boardId);
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      } 
    });
  }

  loadLogs(boardId: string): void {
    this.boardService.getLogs(boardId).subscribe({
      next: (data: any) => {
        this.logs = data;
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      } 
    });
  }

  addList(): void {
    let newList: List = {
      id: "",
      boardId: this.boardId,
      title: this.newListTitleContent,
      position: 0,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: new Date(0)
    };

    this.boardService.createList(this.boardId, newList).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.LIST_CREATED',
        };
        this.miscService.openSnackBar('success', msg);
        this.loadBoard();
        this.showCreateListInput = false;
        this.newListTitleContent = '';
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  updateList(list: List): void {
    this.boardService.updateList(list).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.LIST_UPDATED',
        };
        this.miscService.openSnackBar('success', msg);
        this.loadBoard();
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  archiveList(list: List): void {
    list.archivedAt = new Date();
    this.updateList(list);
  }

  switchCreateListInput() {
    this.showCreateListInput = !this.showCreateListInput;
    if (this.showCreateListInput) {
      setTimeout(() => {
        this.listTitleInput.nativeElement.focus();
      }, 0);
    }
  }

  switchRightMenu() {
    this.showRightMenu = !this.showRightMenu;
  }

  closeManageBackgroundMenu() {
    this.showManageBackground = false;
  }

  showLogsMenu() {
    this.showLogs = true;
  }

  closeLogsMenu() {
    this.showLogs = false;
  }

  archiveBoard(board: Board): void {
    board.archivedAt = new Date();
    this.boardService.updateBoard(board).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BOARD_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.broadcastService.updateRefreshBoard(true);
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  reactivateBoard(board: Board): void {
    board.archivedAt = new Date(0);
    this.boardService.updateBoard(board).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BOARD_REACTIVATED',
        };
        this.miscService.openSnackBar('success', msg);
        this.broadcastService.updateRefreshBoard(true);
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  deleteBoard(boardId: string): void {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BOARD_DELETED',
        };
        this.miscService.openSnackBar('success', msg);
        this.router.navigate(['/boards']);
        this.broadcastService.updateRefreshBoard(true);
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  manageBackground() {
    this.showManageBackground = true;
    this.loadBackgrounds();
  }

  displayLogs() {
    this.showLogs = true;
    this.loadLogs(this.board.id);
  }

  loadBackgrounds() { 
    this.boardService.getBackgrounds().subscribe({
      next: (data: any) => {
        this.backgrounds = data;
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  setBoardBackground(id: string): void {
    this.board.backgroundId = id;
    this.updateBoard(this.board);
  }

  updateBoard(board: Board): void {
    this.boardService.updateBoard(board).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BOARD_UPDATED',
        };
        this.miscService.openSnackBar('success', msg);
        this.broadcastService.updateRefreshBoard(true);
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  deleteBackground(id: string): void {
    this.boardService.deleteBackground(id).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BACKGROUND_DELETED',
        };
        this.miscService.openSnackBar('success', msg);
        this.broadcastService.updateRefreshBoard(true);
        this.loadBackgrounds();
      },
      error: (error) => {
        //console.log(error.error.detail);
        if (error.error.detail) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  addBackground(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.createBackground(this.selectedFile);
    }
  }

  uploadFile($event: any) {
    console.log($event.target.files[0]); // outputs the first file
  }

  createBackground(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.base64String = reader.result as string;
      this.boardService.createBackground(this.base64String).subscribe({
        next: () => {
          let msg = {
            what: 'MESSAGES.BACKGROUND_CREATED',
          };
          this.miscService.openSnackBar('success', msg);
          this.loadBackgrounds();
        },
        error: (error) => {
          if (error.error) {
            this.miscService.openSnackBar('failure', error.error.detail);
          }
          else {
            this.miscService.openSnackBar('failure', { what: 'unexpected' });
          }
        }
      });
    };
    reader.readAsDataURL(file);
  }

  showActionTarget(log: Log) {
    if (log.action.match(/card$/i)) {
      const config: MatDialogConfig = {
        panelClass: 'lg-popup',
        backdropClass: 'preview-popup-backdrop',
        data: { card: null, cardId: log.actionTargetId }
      };
  
      this.dialogRef = this.dialog.open(CardFormComponent, config);
    }
  }

  drop(event: CdkDragDrop<List[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.boardService.changeListsOrder(this.board.id, this.lists.map(list => list.id).join(',')).subscribe({
      next: () => {
        this.loadBoard();
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }
}

