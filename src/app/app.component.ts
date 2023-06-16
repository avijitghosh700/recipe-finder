import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string = 'recipe-app';
  user: User | null = null;
  isLoggedIn: boolean = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;
        this.isLoggedIn = user ? true : false;
      },
    });
  }
}
