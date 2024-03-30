import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/i-user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isMenuOpen = false;
  isLoggedIn: boolean = false;
  currentUser: IUser | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.getUserData();
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  redirectToLoading(): void {
    this.router.navigateByUrl('/dashboard/loading');
  }

  private checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      this.isLoggedIn = token !== null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigateByUrl('/dashboard');
    this.checkLoginStatus();
  }

  getUserData(): void {
    if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = this.userService.getUserIdFromToken(token);
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (user: IUser) => {
            this.currentUser = user;
            console.log('Dati utente:', this.currentUser);
          },
          (error) => {
            console.error('Errore nel recupero dei dati utente:', error);
          }
        );
      } else {
        console.error('ID utente non valido');
      }
    } else {
      console.error('Nessun token trovato nel localStorage');
    }
  }
  }
}
