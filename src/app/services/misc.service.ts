import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable()
export class MiscService {

  constructor(private snackBar: MatSnackBar) {
    
  }

  openSnackBar(type: string, message: any, duration: number = 6000) {
    let panelClass = 'success-snackbar';

    if (type == 'failure') {
      panelClass = 'failure-snackbar';
    }

    this.snackBar.openFromComponent(NotificationComponent, {
      duration: duration,
      data: message,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }
}
