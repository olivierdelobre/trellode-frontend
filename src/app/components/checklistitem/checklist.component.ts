import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ChecklistItem } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-checklistitem',
  templateUrl: './checklistItem.component.html',
  styleUrls: ['./checklistItem.component.scss']
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
  showAddItemForm: boolean = false;
  checklistItemItemTitleContent: string = '';
  @ViewChild('checklistItemItemTitleInput') checklistItemItemTitleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {}

  ngOnInit(): void {
    
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

  updateChecklistItem(checklistItem: ChecklistItem): void {
    this.boardService.updateChecklistItem(checklistItem).subscribe({
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

