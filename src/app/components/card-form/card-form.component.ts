import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CardComponent } from 'src/app/components/card/card.component';
import { BoardService } from 'src/app/services/board.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/app/services/misc.service';
import { Comment } from '../../models/models';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  card: any;
  namePattern: string = '^[A-Za-z\\._\\-\\d]{3,20}$';
  camiprodRfidPattern: string = '^[A-Z\\d]{14,16}$';
  loggedUserInfo: any = {};
  showTitleInput: boolean = false;
  showCommentInput: boolean = false;
  showDescriptionInput: boolean = false;
  titleContent: string = "";
  commentContent: string = "";
  descriptionContent: string = "";
  saveSubscription: Subscription = new Subscription;
  saveCommentSubscription: Subscription = new Subscription;
  archiveCardSubscription: Subscription = new Subscription;

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFailure: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('titleInput') titleInput: any;

  form: UntypedFormGroup | undefined;

  get f() { return this.form?.controls; }

  constructor(private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CardFormComponent>,
    public boardService: BoardService,
    public cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: CardComponent,
    public router: Router,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {
      this.card = data.card;
      console.log("card="+JSON.stringify(this.card));
  }

  ngOnInit(): void {
    this.titleContent = this.card.title;
    this.descriptionContent = this.card.description;
  }
  
  createForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadCard(): void {
    this.boardService.getCard(this.card.id).subscribe(
      (data: any) => {
        this.card = data;
      });
  }

  updateCard() {
    this.card.title = this.titleContent;
    this.card.description = this.descriptionContent;
    this.saveSubscription = this.boardService.updateCard(this.card).subscribe(
      (data: any) => {
        this.showTitleInput = false;
        this.showDescriptionInput = false;
        this.loadCard();

        let msg = {
          what: 'MESSAGES.CARD_UPDATED',
        };
        this.miscService.openSnackBar('success', msg);
        this.onSuccess.emit();
      },
      (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', { what: 'unexpected' });
        }
      }
    )
  }

  addComment() {
    let newComment: Comment = {
      id: 0,
      cardId: this.card.id,
      userId: 0,
      content: this.commentContent,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.saveCommentSubscription = this.boardService.createComment(this.card.id, newComment).subscribe({
      next: (data: any) => {
        this.commentContent = "";
        this.switchCommentInput();
        this.loadCard();
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

  cancel() {
    this.dialogRef.close();
  }

  switchCommentInput() {
    this.showCommentInput = !this.showCommentInput;
  }

  switchDescriptionInput() {
    this.showDescriptionInput = !this.showDescriptionInput;
  }

  switchTitleInput() {
    this.showTitleInput = !this.showTitleInput;
    if (this.showTitleInput) {
      setTimeout(() => {
        this.titleInput.nativeElement.focus();
      }, 0);
    }
  }

  archiveCard() {
    this.archiveCardSubscription = this.boardService.archiveCard(this.card.id).subscribe({
      next: (data: any) => {
        let msg = {
          what: 'MESSAGES.CARD_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.onSuccess.emit();
        this.broadcastService.updateRefreshBoard(true);
        this.dialogRef.close();
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

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    if (this.saveCommentSubscription) {
      this.saveCommentSubscription.unsubscribe();
    }
    if (this.archiveCardSubscription) {
      this.archiveCardSubscription.unsubscribe();
    }
  }
}
