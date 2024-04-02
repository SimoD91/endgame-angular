import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/i-user';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isMenuOpen = false;
  isLoggedIn: boolean = false;
  currentUser: IUser | null = null;
  avatarUrl: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private avatarService: AvatarService) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.getUserData();
    });
    this.avatarService.getAvatarUrl().subscribe((avatarUrl: string) => {
      this.avatarUrl = avatarUrl;
    });
  }

  //--- Menù hamburger in responsive ---\\
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  //--- Verifica stato login utente tramite token ---\\
  private checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      this.isLoggedIn = token !== null;
    }
  }

  //--- Logout e reindirizzamento a dashboard ---\\
  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigateByUrl('/dashboard');
    this.checkLoginStatus();
  }

  //--- Recupero dati utente dopo login ---\\
  getUserData(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = this.userService.getUserIdFromToken(token);
        if (userId) {
          this.userService.getUserById(userId).subscribe(
            (user: IUser) => {
              this.currentUser = user;
              if (this.currentUser && this.currentUser.avatar) {
                this.avatarUrl = this.currentUser.avatar;
              }
              this.updateAvatar();
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

  //--- Aggiornamento avatar utente in header ---\\
  updateAvatar(): void {
    if (this.currentUser && this.currentUser.avatar) {
      this.avatarUrl = this.currentUser.avatar;
    } else {
      this.avatarUrl = '../../../../assets/icons/avatar-empty.webp';
    }
  }
}
