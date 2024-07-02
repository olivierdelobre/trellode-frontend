import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { MiscService } from 'src/app/services/misc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegistrerComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
    private boardService: BoardService,
    private miscService: MiscService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.boardService.register(this.registrationForm.get('firstname')?.value, this.registrationForm.get('lastname')?.value, this.registrationForm.get('email')?.value, this.registrationForm.get('password')?.value).subscribe({
        next: (data: any) => {
          this.router.navigate(['/login']);
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

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }
}
