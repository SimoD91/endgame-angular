import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
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
    let idUtente: number;
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const tokenPayload = JSON.parse(jsonPayload);
        console.log(tokenPayload)
        if (tokenPayload && tokenPayload.hasOwnProperty('sub')) {
            idUtente = tokenPayload.sub;
            console.log('idUtente estratto dal token:', idUtente);
        } else {
            console.error('Campo idUtente non presente nel token.');
            throw new Error('Campo idUtente non presente nel token.');
        }
    } catch (error) {
        console.error('Errore durante il decoding del token:', error);
        throw new Error('Errore durante il decoding del token');
    }
    return idUtente;
}


getUserById(userId: number): Observable<IUser> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  };
  return this.http.get<IUser>(`${this.baseUrl}/utenti/${userId}`, httpOptions).pipe(
    catchError(error => {
      console.error('Errore nella chiamata API per ottenere i dati dell\'utente:', error);
      return throwError('Errore nella chiamata API');
    })
  );
}

updateUser(userId: number, userData: any): Observable<IUser> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  };

  return this.http.patch<IUser>(`${this.baseUrl}/utenti/${userId}`, userData, httpOptions).pipe(
    catchError(error => {
      console.error('Errore nella chiamata PATCH per aggiornare i dati dell\'utente:', error);
      return throwError('Errore nella chiamata PATCH');
    })
  );
}

uploadAvatar(userId: number, formData: FormData): Observable<IUser> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };

  return this.http.patch<IUser>(`${this.baseUrl}/utenti/${userId}/upload`, formData, httpOptions);
}

getAvatarUrl(idUtente: number): Observable<string> {
  return this.http.get<IUser>(`${this.baseUrl}/utenti/${idUtente}`).pipe(
    map((idUtente: IUser) => idUtente.avatar)
  );
}

addToFavorites(userId: number, videogameId: number): Observable<void> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  };

  return this.http.patch<void>(`${this.baseUrl}/utenti/${userId}/preferiti/${videogameId}`, {}, httpOptions).pipe(
    catchError(error => {
      console.error('Errore durante l\'aggiunta ai preferiti:', error);
      return throwError('Errore durante l\'aggiunta ai preferiti');
    })
  );
}

removeFromFavorites(userId: number, videogameId: number): Observable<void> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  };

  return this.http.delete<void>(`${this.baseUrl}/utenti/${userId}/preferiti/${videogameId}`, httpOptions).pipe(
    catchError(error => {
      console.error('Errore durante la rimozione dai preferiti:', error);
      return throwError('Errore durante la rimozione dai preferiti');
    })
  );
}

getFavoriteVideogameIds(userId: number): Observable<number[]> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token non presente nel local storage');
    return throwError('Token non presente nel local storage');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  };

  return this.http.get<number[]>(`${this.baseUrl}/utenti/${userId}/preferiti`, httpOptions).pipe(
    catchError(error => {
      console.error('Errore durante il recupero degli ID dei videogiochi preferiti:', error);
      return throwError('Errore durante il recupero degli ID dei videogiochi preferiti');
    })
  );
}
}
