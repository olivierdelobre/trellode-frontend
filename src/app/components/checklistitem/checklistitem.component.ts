import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ChecklistItem } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-checklistitem',
  templateUrl: './checklistitem.component.html',
  styleUrls: ['./checklistitem.component.scss']
})
export class ChecklistItemComponent implements OnInit {
  @Input() item: ChecklistItem = {
    id: "",
    checklistId: "",
    title: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    checked: false
  };
  showTitleInput: boolean = false;
  titleContent: string = '';
  
  @ViewChild('titleInput') titleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {}

  ngOnInit(): void {
    this.titleContent = this.item.title;
  }

  switchTitleInput() {
    this.showTitleInput = !this.showTitleInput;
    if (this.showTitleInput) {
      setTimeout(() => {
        this.titleInput.nativeElement.focus();
      }, 0);
    }
  }

  loadChecklistItem(): void {
    this.boardService.getChecklistItem(this.item.id).subscribe({
      next: (data: any) => {
        this.item = data;
      },
      error: (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.error);
        }
      }
    });
  }

  updateChecklistItem(): void {
    this.item.title = this.titleContent;
    this.boardService.updateChecklistItem(this.item).subscribe({
      next: (data: any) => {
        this.showTitleInput = false;
      },
      error: (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.error);
        }
      }
    });
  }

  deleteChecklistItem(): void {
    this.boardService.deleteChecklistItem(this.item.id).subscribe({
      next: (data: any) => {
        this.broadcastService.updateRefreshCard(true);
      },
      error: (error) => {
        if (error.error.error) {
          this.miscService.openSnackBar('failure', error.error.error);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.error);
        }
      }
    });
  }
}

