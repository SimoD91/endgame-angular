import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  redirectToLoading(): void {
    // Effettua il reindirizzamento alla pagina di caricamento (loading)
    this.router.navigateByUrl('/dashboard/loading');
  }
}
