import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  public updateAvatarUrl(newAvatarUrl: string): void {
    this.avatarUrlSubject.next(newAvatarUrl);
  }

  public getAvatarUrl(): Observable<string> {
    return this.avatarUrlSubject.asObservable();
  }
}
