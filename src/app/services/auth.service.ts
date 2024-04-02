import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private currentUserSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public currentUser$: Observable<IUser | null> = this.currentUserSubject.asObservable();

  constructor() {}

  //-- Verifica se l'utente è autenticato --\\
  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  //-- Aggiorna lo stato di accesso dell'utente --\\
  public updateLoginStatus(): void {
    this.loggedInSubject.next(this.isLoggedIn());
  }

    //-- Imposta l'utente corrente --\\
  public setCurrentUser(user: IUser | null): void {
    this.currentUserSubject.next(user);
  }

  //-- Restituisce l'utente corrente --\\
  public getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}
