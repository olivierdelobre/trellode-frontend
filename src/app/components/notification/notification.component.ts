import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  text: string = "";

  constructor(public translateService: TranslateService,
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.what.startsWith('MESSAGES.')) {
      this.translateService.get(this.data.what).subscribe((res: string) => {
        this.text = res;
      });
    }
    else if (this.data.what == 'failure') {
      this.text = this.data.errormsg;
    }
    else {
      let splited = String(this.data).split("|");
      this.text = splited.join("<br />");
    }
  }
}