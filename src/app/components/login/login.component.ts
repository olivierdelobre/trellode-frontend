import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MiscService } from 'src/app/services/misc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private miscService: MiscService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.authenticate(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe({
        next: (data: any) => {
          if (data.accesstoken) {
            localStorage.setItem(environment.settings.token_name, data.accesstoken);
            localStorage.setItem(environment.settings.token_name+".refresh", data.refresh_token);
            this.router.navigate(['/boards']);
          }
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
}
