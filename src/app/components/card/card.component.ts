import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Card, Comment } from '../../models/models';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CardFormComponent } from '../card-form/card-form.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() card: Card = {
    id: 0,
    listId: 0,
    title: '',
    description: '',
    position: 0,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(private boardService: BoardService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CardFormComponent>) {}

  ngOnInit(): void {
    
  }

  loadCard(): void {
    this.boardService.getCard(this.card.id).subscribe(
      (data: any) => {
        this.card = data;
      });
  }

  updateCard(card: Card): void {
    this.boardService.updateCard(card).subscribe(() => {
      this.loadCard();
    });
  }

  archiveCard(cardId: number): void {
    this.boardService.archiveCard(cardId).subscribe(() => {
      this.loadCard();
    });
  }

  addComment(): void {
    const newComment: Comment = {
      id: 0,
      cardId: this.card.id,
      userId: 0,
      content: 'New Comment',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.boardService.createComment(this.card.id, newComment).subscribe(() => {
      this.loadCard();
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  openCardForm() {
    // Pass clone to avoid data being modified in service detail component
    const config: MatDialogConfig = {
      panelClass: 'lg-popup',
      backdropClass: 'preview-popup-backdrop',
      data: { card: this.card }
    };

    this.dialogRef = this.dialog.open(CardFormComponent, config);
    
    //this.dialogRef.componentInstance.onSuccess.subscribe(() => {
    //  this.broadcastService.updateRefreshList(0);
    //});
  }
}

