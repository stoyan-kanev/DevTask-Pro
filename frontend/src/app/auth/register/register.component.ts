import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {strongPasswordValidator} from './passwordValidator';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), strongPasswordValidator()]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordsMatchValidator});
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordsMismatch: true};
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get username() {
    return this.registerForm.get('username')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  register() {
    this.errorMessage = '';

    if (this.registerForm.valid) {
      this.authService.register(
        this.email.value,
        this.username.value,
        this.password.value
      ).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.authService.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem('user', JSON.stringify(user));
              this.router.navigate(['/']);
              window.location.reload();
            },
            error: (error) => {
              console.error('Failed to fetch user data:', error);
            }
          });
        },
        error: (err) => {
          const errorObj = err.error;
          if (errorObj?.email?.length > 0) {
            this.email.setErrors({backend: errorObj.email[0]});
          } else if (errorObj?.username?.length > 0) {
            this.username.setErrors({backend: errorObj.username[0]});
          } else {
            this.errorMessage = errorObj?.message || 'Registration failed.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
      this.registerForm.markAllAsTouched();
    }
  }
}
