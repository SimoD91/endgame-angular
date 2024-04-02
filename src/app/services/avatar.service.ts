import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  //--- Aggiorna l'URL dell'avatar dell'utente --\\
  public updateAvatarUrl(newAvatarUrl: string): void {
    this.avatarUrlSubject.next(newAvatarUrl);
  }

 //--- Ottiene l'URL dell'avatar dell'utente --\\
  public getAvatarUrl(): Observable<string> {
    return this.avatarUrlSubject.asObservable();
  }
}
