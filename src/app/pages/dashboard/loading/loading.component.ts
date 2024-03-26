import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnDestroy {
  private timer: any;
  showContainer: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.showContainer = true;

    this.timer = setTimeout(() => {
      this.cambioPag();
    }, 2000);
  }

  cambioPag() {
    this.router.navigate(['dashboard/portal']);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
