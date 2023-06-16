import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public submitted: boolean = false;
  public loginLoading: boolean = false;
  public loginForm: UntypedFormGroup;

  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user) this.router.navigate(['/recipes-list']);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get formData() {
    return this.loginForm.controls;
  }

  async login() {
    this.submitted = true;

    if (this.loginForm.invalid) return false;

    const data: Record<string, string> = { ...this.loginForm.value };
    this.loginLoading = true;

    try {
      const user: UserCredential = await this.authService.signin(data);
      const token: string = await user.user.getIdToken();

      this.loginLoading = false;

      if (token) this.router.navigate(['/recipes-list']);

      this.snackBar.open(
        `Welcome ${this.loginForm.get('email')?.value}`,
        'Ok',
        { duration: 2000 }
      );
    } catch (error) {
      this.loginLoading = false;
      this.snackBar.open(
        `${this.loginForm.get('email')?.value} is not registered`,
        'Ok',
        { duration: 2000 }
      );
      console.log(error);
    }
  }
}
