import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const user$ = inject(AuthService).user$;
  const router = inject(Router);

  return user$.pipe(
    map((user) => {
      if (user) return true;

      router.navigate(['/']);
      return false;
    })
  );
};
