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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public submitted: boolean = false;
  public registerLoading: boolean = false;
  public registerForm: UntypedFormGroup;

  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
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
    return this.registerForm.controls;
  }

  async signup() {
    this.submitted = true;

    if (this.registerForm.invalid) return false;

    const data: Record<string, string> = { ...this.registerForm.value };
    this.registerLoading = true;

    try {
      const newUser: UserCredential = await this.authService.signup(data);
      const token: string = await newUser.user.getIdToken();

      this.registerLoading = false;

      if (token) this.router.navigate(['/recipes-list']);

      this.snackBar.open(`Registration successful`, 'Ok', {
        duration: 2000,
      });
    } catch (error) {
      this.registerLoading = false;

      this.snackBar.open(`Something went wrong`, 'Failed', { duration: 2000 });

      console.log(error);
    }
  }
}
