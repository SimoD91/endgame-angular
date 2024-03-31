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

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public updateLoginStatus(): void {
    this.loggedInSubject.next(this.isLoggedIn());
  }

  public setCurrentUser(user: IUser | null): void {
    this.currentUserSubject.next(user);
  }

  public getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
}
