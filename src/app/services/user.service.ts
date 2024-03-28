import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUser } from '../models/i-user';
import { UserLogin, UserRegister } from '../models/i-user-dto';
import { IConfirmRes } from '../models/i-confirm-res';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:8080';

  register(user: UserRegister): Observable<IUser> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: UserLogin): Observable<IConfirmRes> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }

  public getUserIdFromToken(token: string): number {
    let userId: number;
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload && tokenPayload.hasOwnProperty('userId')) {
            userId = tokenPayload.userId;
        } else {
            console.error('Campo userId non presente nel token.');
            throw new Error('Campo userId non presente nel token.');
        }
    } catch (error) {
        console.error('Errore durante il decoding del token:', error);
        throw new Error('Errore durante il decoding del token');
    }
    return userId;
}

  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/utenti/${userId}`).pipe(
      catchError(error => {
        console.error('Errore nella chiamata API per ottenere i dati dell\'utente:', error);
        return throwError('Errore nella chiamata API');
      })
    );
  }

}
