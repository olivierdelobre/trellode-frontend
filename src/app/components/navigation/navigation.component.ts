import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  userInfo: any;

  constructor(private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // get user info
    if (localStorage.getItem(environment.settings.token_name)) {
      this.authService.getUserInfo().subscribe({
        next: (data: any) => {
          this.userInfo = data;
        },
        error: (err: any) => {
          localStorage.removeItem(environment.settings.token_name);
          localStorage.removeItem(environment.settings.token_name+".refresh");
          this.router.navigate(['/login']);
        },
        complete: () => { }
      }
        
      )
    }
  }

  logout() {
    localStorage.removeItem(environment.settings.token_name);
    localStorage.removeItem(environment.settings.token_name+".refresh");
    this.router.navigate(['/login']);
  }
}
