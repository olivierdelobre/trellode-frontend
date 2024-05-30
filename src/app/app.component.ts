import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trellode-frontend';

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    // register all icons once
    ['activity', 'archive', 'background', 'checklist', 'close', 'comment', 'date', 'delete', 'description', 'dots', 'home', 'logo', 'plus', 'unarchive'].forEach(name => {
    this.matIconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`)
    );
  });
  }
}
