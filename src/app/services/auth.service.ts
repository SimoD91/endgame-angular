import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor() {}

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public updateLoginStatus(): void {
    this.loggedInSubject.next(this.isLoggedIn());
  }
}
