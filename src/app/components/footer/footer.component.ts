import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
hideFooter: boolean = false;

constructor(private router: Router){
}
/*
//--- Metodo per rimuovere footer durante lo scroll della Portal page ---\\
ngOnInit(): void {
  if (typeof window !== 'undefined') {
    this.controlSizePage();
    window.addEventListener('resize', () => {
      this.controlSizePage();
    });
  }
}

controlSizePage(){
  const belowidth = 991.50;
  const ispage = this.router.url === '/dashboard/portal' || this.router.url === '/dashboard/videogame';
  if(window.innerWidth < belowidth && ispage){
    this.hideFooter = true;
  }else{
    this.hideFooter = false;
  }
}
*/
}
