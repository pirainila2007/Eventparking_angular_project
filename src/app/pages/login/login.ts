import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  LoginRequest,
  LoginResponse
} from '../../models/auth.model';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  isLoading = false;
  showPassword = false;

  errorMessage = '';
  successMessage = '';

  loginForm = new FormGroup({

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ],
    }),

  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  togglePasswordVisibility(): void {

    this.showPassword = !this.showPassword;

  }


  login(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }


    const request: LoginRequest = {

      email:
        this.loginForm.controls.email
          .value
          .trim(),

      password:
        this.loginForm.controls.password
          .value

    };


    this.isLoading = true;


    this.authService
      .login(request)
      .subscribe({

        next: (response: LoginResponse) => {

          this.isLoading = false;


          // Save login information
          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'customerId',
            response.customerId.toString()
          );

          localStorage.setItem(
            'fullName',
            response.fullName
          );

          localStorage.setItem(
            'email',
            response.email
          );

          localStorage.setItem(
            'role',
            response.role
          );

          localStorage.setItem(
            'tokenExpiration',
            response.expiration
          );


          this.successMessage =
            `Welcome back, ${response.fullName}. Login successful.`;


          // Redirect to Customer Dashboard
          this.router.navigate([
            '/customer/dashboard'
          ]);

        },


        error: (error: HttpErrorResponse) => {

          this.isLoading = false;

          this.errorMessage =
            this.getErrorMessage(error);

        }

      });

  }


  private getErrorMessage(
    error: HttpErrorResponse
  ): string {

    if (error.status === 0) {

      return 'Cannot connect to the API. Make sure the backend is running.';

    }

    if (error.status === 401) {

      return 'Invalid email or password.';

    }

    if (error.error?.message) {

      return error.error.message;

    }

    return 'Login failed. Please try again.';

  }

}