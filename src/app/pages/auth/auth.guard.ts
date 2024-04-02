import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//--- Rotta user-page protetta se non si è fatto il login ---\\
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.loggedIn$.pipe(
      map((loggedIn: boolean) => {
        if (loggedIn) {
          return true;
        } else {
          return this.router.createUrlTree(['/dashboard']);
        }
      })
    );
  }
}
