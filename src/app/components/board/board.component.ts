import { Component, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board, List } from '../../models/models';
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
    backgroundImage: '',
    lists: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  showCreateListInput: boolean = false;
  newListTitleContent: string = '';
  @ViewChild('listTitleInput') listTitleInput: any;

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
}

