import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Checklist, ChecklistItem } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {
  @Input() checklist: Checklist = {
    id: "",
    cardId: "",
    title: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    archivedAt: new Date(0)
  };
  showAddItemForm: boolean = false;
  checklistItemTitleContent: string = '';
  @ViewChild('checklistItemTitleInput') checklistItemTitleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {}

  ngOnInit(): void {
    
  }

  loadChecklist(): void {
    this.boardService.getChecklist(this.checklist.id).subscribe({
      next: (data: any) => {
        this.checklist = data;
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

  updateChecklist(checklist: Checklist): void {
    this.boardService.updateChecklist(checklist).subscribe({
      next: (data: any) => {
        this.checklist = data;
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

  deleteChecklist(): void {
    this.boardService.deleteChecklist(this.checklist.id).subscribe({
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

  updateChecklistItem(checklistItem: ChecklistItem): void {
    this.boardService.updateChecklistItem(checklistItem).subscribe({
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

  addChecklistItem(): void {
    const checklistItem: ChecklistItem = {
      id: "",
      checklistId: this.checklist.id,
      title: this.checklistItemTitleContent,
      checked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.boardService.createChecklistItem(checklistItem).subscribe({
      next: (data: any) => {
        this.checklistItemTitleContent = '';
        this.switchChecklistItemForm();
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

  switchChecklistItemForm(): void {
    this.showAddItemForm = !this.showAddItemForm;
    if (this.showAddItemForm) {
      setTimeout(() => {
        this.checklistItemTitleInput.nativeElement.focus();
      }, 0);
    }
  }
}

