import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { BoardsComponent } from 'src/app/components/boards/boards.component';
import { BoardService } from 'src/app/services/board.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})
export class BoardFormComponent implements OnInit {

  board: any;
  namePattern: string = '^[A-Za-z\\._\\-\\d]{3,20}$';
  camiprodRfidPattern: string = '^[A-Z\\d]{14,16}$';
  loggedUserInfo: any = {};
  showTitleInput: boolean = false;
  titleContent: string = "";
  commentContent: string = "";
  descriptionContent: string = "";
  backgroundImage: string = "";
  saveSubscription: Subscription = new Subscription;
  archiveBoardSubscription: Subscription = new Subscription;

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFailure: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('titleInput') titleInput: any;

  form: UntypedFormGroup | undefined;

  get f() { return this.form?.controls; }

  constructor(private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<BoardFormComponent>,
    public boardService: BoardService,
    public cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: BoardsComponent,
    public router: Router,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {
      this.board = data.board;
      if (this.board.id == 0) {
        this.showTitleInput = true;
      }
  }

  ngOnInit(): void {
    this.titleContent = this.board.title;
  }

  loadBoard(): void {
    this.boardService.getBoard(this.board.id).subscribe(
      (data: any) => {
        this.board = data;
      });
  }

  saveBoard() {
    this.board.title = this.titleContent;
    
    if (this.board.id == 0) {
      this.saveSubscription = this.boardService.createBoard(this.board).subscribe({
        next: (data: any) => {
          this.showTitleInput = false;
          this.loadBoard();
          let msg = {
            what: 'MESSAGES.BOARD_CREATED',
          };
          this.miscService.openSnackBar('success', msg);
          this.broadcastService.updateRefreshBoard(true);
          this.onSuccess.emit();
          this.dialogRef.close();
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
    else {
      this.saveSubscription = this.boardService.updateBoard(this.board).subscribe({
        next: (data: any) => {
          this.showTitleInput = false;
          this.loadBoard();
          let msg = {
            what: 'MESSAGES.BOARD_UPDATED',
          };
          this.miscService.openSnackBar('success', msg);
          this.broadcastService.updateRefreshBoard(true);
          this.onSuccess.emit();
          this.dialogRef.close();
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
  }

  switchTitleInput() {
    this.showTitleInput = !this.showTitleInput;
    if (this.showTitleInput) {
      setTimeout(() => {
        this.titleInput.nativeElement.focus();
      }, 0);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  archiveBoard() {
    this.board.archivedAt = new Date();
    this.archiveBoardSubscription = this.boardService.updateBoard(this.board).subscribe({
      next: (data: any) => {
        let msg = {
          what: 'MESSAGES.BOARD_ARCHIVED',
        };
        this.miscService.openSnackBar('success', msg);
        this.onSuccess.emit();
        this.broadcastService.updateRefreshBoard(true);
        this.dialogRef.close();
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

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    if (this.archiveBoardSubscription) {
      this.archiveBoardSubscription.unsubscribe();
    }
  }
}
