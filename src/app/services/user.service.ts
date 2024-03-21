import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
