import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Background, Board, List } from '../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { MiscService } from 'src/app/services/misc.service';

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
  backgrounds: Background[] = [];
  showCreateListInput: boolean = false;
  showRightMenu: boolean = false;
  showManageBackground: boolean = false;
  newListTitleContent: string = '';
  selectedFile: File | null = null;
  base64String: string | null = null;
  @ViewChild('listTitleInput') listTitleInput: any;
  @ViewChild('fullPageContainer') fullPageContainer: any;

  constructor(private route: ActivatedRoute,
    private boardService: BoardService,
    private broadcastService: BroadcastService,
    private miscService: MiscService,
    private router: Router) {}

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
    this.boardService.getBoard(this.boardId).subscribe(
      (data: any) => {
        this.board = data;
      });
  }

  addList(): void {
    let newList: List = {
      id: 0,
      boardId: +this.boardId,
      title: this.newListTitleContent,
      position: 0,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date()
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
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
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
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  archiveList(listId: number): void {
    this.boardService.archiveList(listId).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.LIST_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.loadBoard();
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

  archiveBoard(boardId: number): void {
    this.boardService.archiveBoard(boardId).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.BOARD_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.router.navigate(['/boards']);
        this.broadcastService.updateRefreshBoard(true);
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
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
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

  loadBackgrounds() { 
    this.boardService.getBackgrounds().subscribe({
      next: (data: any) => {
        this.backgrounds = data;
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

  setBoardBackground(id: number): void {
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
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    });
  }

  deleteBackground(id: number): void {
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
          if (error.error.error) {
            this.miscService.openSnackBar('failure', error.error.error);
          }
          else {
            this.miscService.openSnackBar('failure', { what: 'unexpected' });
          }
        }
      });
    };
    reader.readAsDataURL(file);
  }
}

