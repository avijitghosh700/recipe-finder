import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) user: User | null = null;

  constructor(private readonly authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
