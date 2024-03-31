import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from '../../models/i-user';
import { UserService } from '../../services/user.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {
  currentUser: IUser | null = null;
  avatarFile: File | null = null;

  constructor(
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.getUserData();
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

  onUploadAvatar(): void {
    if (this.avatarFile) {
      const userId = this.currentUser?.idUtente;

      if (userId) {
        const formData = new FormData();
        formData.append('upload', this.avatarFile);

        this.userService.uploadAvatar(userId, formData).subscribe(
          (user: IUser) => {
            this.currentUser = user;
            console.log('Avatar caricato con successo:', this.currentUser);
          },
          (error) => {
            console.error('Errore durante il caricamento dell\'avatar:', error);
          }
        );
      } else {
        console.error('ID utente non valido');
      }
    } else {
      console.error('Nessun file selezionato per l\'avatar');
    }
  }

  onAvatarChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.avatarFile = inputElement.files[0];
    }
  }
}
