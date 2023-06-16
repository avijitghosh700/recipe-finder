import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<User | null>;

  constructor(
    private readonly firebaseAuth: Auth,
    private readonly router: Router
  ) {
    this.user$ = authState(this.firebaseAuth);
  }

  signin(data: Record<string, string>): Promise<UserCredential> {
    const { email, password } = data;

    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signup(data: Record<string, string>): Promise<UserCredential> {
    const { email, password } = data;

    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
