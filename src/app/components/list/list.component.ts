import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { List, Card } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() list: List = {
    id: "",
    boardId: "",
    title: '',
    position: 0,
    cards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: new Date(0)
  };
  @Input() color: string = '';
  cards: Card[] = [];

  showCreateCardInput: boolean = false;
  newCardTitleContent: string = '';
  @ViewChild('cardTitleInput') cardTitleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService
  ) {}

  ngOnInit(): void {
    this.cards = this.list.cards;

    this.broadcastService.refreshList.subscribe({
      next: (data: any) => {
        if (data) {
          this.loadList();
        }
      }
    });
  }

  loadList(): void {
    this.boardService.getList(this.list.id).subscribe({
      next: (data: any) => {
        this.list = data;
        this.cards = this.list.cards;
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
      id: "",
      listId: this.list.id,
      title: this.newCardTitleContent,
      description: '',
      position: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: new Date(0),
      checklists: []
    };
    this.boardService.createCard(this.list.id, newCard).subscribe({
      next: () => {
        this.loadList();
        this.showCreateCardInput = false;
        this.newCardTitleContent = '';
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
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
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

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      console.log("move card in same list");
      moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
      this.boardService.changeCardOrder(this.list.id, this.cards.map(card => card.id).join(',')).subscribe({
        next: () => {
          this.loadList();
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
    else {
      //console.log("move card to another list");
      //console.log("event.previousIndex="+event.previousIndex); // previousIndex is the index in source list
      //console.log("event.currentIndex="+event.currentIndex); // currentIndex is the index in target list
      //console.log("event.previousContainer.id="+event.previousContainer.id);
      //console.log("event.container.id="+event.container.id);
      // get index of target list from event.container.id which has format "cdk-drop-list-<index>"
      let sourceListIndex = parseInt(event.previousContainer.id.replace('cdk-drop-list-', ''));
      // index starts with 0
      sourceListIndex--;
      //console.log("sourceListIndex="+sourceListIndex);
      this.boardService.moveCardToList(sourceListIndex, event.previousIndex, this.list.id, event.currentIndex).subscribe({
        next: () => {
          this.broadcastService.updateRefreshList(true);
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
}

