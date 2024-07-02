import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Card, Comment } from '../../models/models';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CardFormComponent } from '../card-form/card-form.component';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() card: Card = {
    id: "",
    listId: "",
    title: '',
    description: '',
    position: 0,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: new Date(0),
    checklists: []
  };

  constructor(private boardService: BoardService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CardFormComponent>,
    private miscService: MiscService) {}

  ngOnInit(): void {
    
  }

  loadCard(): void {
    this.boardService.getCard(this.card.id).subscribe(
      (data: any) => {
        this.card = data;
      });
  }

  updateCard(card: Card): void {
    this.boardService.updateCard(card).subscribe({
      next: () => {
        this.loadCard();
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

  archiveCard(card: Card): void {
    this.boardService.updateCard(card).subscribe({
      next: () => {
        this.loadCard();
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

  addComment(): void {
    const newComment: Comment = {
      id: "",
      cardId: this.card.id,
      userId: "",
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

