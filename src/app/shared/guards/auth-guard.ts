import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => {
      if (user) return true;
      router.navigateByUrl('/auth/login');
      return false;
    })
  );
};
