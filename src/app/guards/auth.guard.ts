import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
  // const authService = inject(AuthService);
  //   const router = inject(Router);

  //   if (authService.isAuth.value == false) {
  //       router.navigate(['/login']);
  //       // window.location.href = 'https://www.facebook.com/'
  //       return false;
  //   }

  //   return authService.isAuth.value;
};
