import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { List, Card } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() list: List = {
    id: 0,
    boardId: 0,
    title: '',
    position: 0,
    cards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: new Date(0)
  };
  @Input() color: string = '';

  showCreateCardInput: boolean = false;
  newCardTitleContent: string = '';
  @ViewChild('cardTitleInput') cardTitleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService
  ) {}

  ngOnInit(): void {
    
  }

  loadList(): void {
    this.boardService.getList(this.list.id).subscribe(
      (data: any) => {
        this.list = data;
      });
  }

  switchCreateCardInput() {
    this.showCreateCardInput = !this.showCreateCardInput;
    if (this.showCreateCardInput) {
      setTimeout(() => {
        this.cardTitleInput.nativeElement.focus();
      }, 0);
    }
  }

  addCard(): void {
    let newCard: Card = {
      id: 0,
      listId: this.list.id,
      title: this.newCardTitleContent,
      description: '',
      position: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: new Date(0)
    };
    this.boardService.createCard(this.list.id, newCard).subscribe({
      next: () => {
        this.loadList();
        this.showCreateCardInput = false;
        this.newCardTitleContent = '';
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

  archiveList(list: List): void {
    list.archivedAt = new Date();
    this.boardService.updateList(list).subscribe({
      next: () => {
        let msg = {
          what: 'MESSAGES.LIST_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.loadList();
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
    })
  }

  updateList(list: List): void {
    this.boardService.updateList(list).subscribe(() => {
      this.loadList();
    });
  }
}

