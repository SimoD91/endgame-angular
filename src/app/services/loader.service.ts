import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.show();
      } else if (event instanceof NavigationEnd) {
        timer(1000).pipe(take(1)).subscribe(() => {
          this.hide();
        });
      }
    });
  }

  show(): void {
    this.isLoading = true;
  }

  hide(): void {
    this.isLoading = false;
  }

}
