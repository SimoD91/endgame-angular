import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from '../../models/i-user';
import { UserService } from '../../services/user.service';
import { DOCUMENT } from '@angular/common';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {
  currentUser: IUser | null = null;
  avatarFile: File | null = null;
  avatarUploaded: boolean = false;

  constructor(
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    private avatarService: AvatarService
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }

  //--- Recupera i dati dell'utente ---\\
  getUserData(): void {
    if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = this.userService.getUserIdFromToken(token);
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (user: IUser) => {
            this.currentUser = user;
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

  //--- Carica l'avatar tramite chiamata patch ---\\
  onUploadAvatar(): void {
    if (this.avatarFile) {
      const userId = this.currentUser?.idUtente;

      if (userId) {
        const formData = new FormData();
        formData.append('upload', this.avatarFile);

        this.userService.uploadAvatar(userId, formData).subscribe(
          (user: IUser) => {
            this.currentUser = user;
            this.avatarService.updateAvatarUrl(user.avatar);
            this.avatarUploaded = false;
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

  //--- Aggiornamento avatar caricato a schermo ---\\
  onAvatarChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.avatarFile = inputElement.files[0];
      this.avatarUploaded = true;
    }
  }
}
