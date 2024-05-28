import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { List, Card } from '../../models/models';

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
    updatedAt: new Date()
  };

  showCreateCardInput: boolean = false;
  newCardTitleContent: string = '';
  @ViewChild('cardTitleInput') cardTitleInput: any;

  constructor(private boardService: BoardService) {}

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
      updatedAt: new Date()
    };
    this.boardService.createCard(this.list.id, newCard).subscribe(() => {
      this.loadList();
      this.showCreateCardInput = false;
      this.newCardTitleContent = '';
    });
  }

  archiveList(listId: number): void {
    this.boardService.archiveList(listId).subscribe(() => {
      this.loadList();
    });
  }

  updateList(list: List): void {
    this.boardService.updateList(list).subscribe(() => {
      this.loadList();
    });
  }
}

