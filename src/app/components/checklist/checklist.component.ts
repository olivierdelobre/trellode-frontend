import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Checklist, ChecklistItem } from '../../models/models';
import { MiscService } from 'src/app/services/misc.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  items: ChecklistItem[] = [];
  showAddItemForm: boolean = false;
  checklistItemTitleContent: string = '';
  @ViewChild('checklistItemTitleInput') checklistItemTitleInput: any;

  constructor(private boardService: BoardService,
    private miscService: MiscService,
    private broadcastService: BroadcastService) {}

  ngOnInit(): void {
    this.items = this.checklist.items;
  }

  loadChecklist(): void {
    this.boardService.getChecklist(this.checklist.id).subscribe({
      next: (data: any) => {
        this.checklist = data;
      },
      error: (error) => {
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.detail);
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
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.detail);
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
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.detail);
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
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.detail);
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
        if (error.error) {
          this.miscService.openSnackBar('failure', error.error.detail);
        }
        else {
          this.miscService.openSnackBar('failure', error.error.detail);
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

  drop(event: CdkDragDrop<ChecklistItem[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    console.log("after="+JSON.stringify(this.items));
    this.boardService.changeChecklistItemsOrder(this.checklist.id, this.items.map(item => item.id).join(',')).subscribe({
      next: () => {
        this.loadChecklist();
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

