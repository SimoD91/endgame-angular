import { Component, OnInit } from '@angular/core';
import { Ivideogame } from '../models/ivideogame';
import { VideogameService } from '../../../services/videogame.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnInit {
  currentPage = 1;
  pageSize = 6;
  totalVideogames = 0;
  pageNumbers: number[] = [];
  videogames: Ivideogame[] = [];
  searchedVideogames: Ivideogame[] = [];
  isVideogamesArray: boolean = false;
  searchQuery: string = '';

  constructor(private videogameService: VideogameService) {
    this.pageNumbers = [];
  }

  ngOnInit(): void {
    this.loadVideogames();
  }

  loadVideogames(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageSize = this.pageSize;
    this.videogameService.getAllVideogames(startIndex, pageSize).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.content)) {
          this.videogames = data.content;
          this.totalVideogames = data.totalElements;
          this.calculatePageNumbers();
        } else {
          console.error('Dati non validi per i videogiochi:', data);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei videogiochi:', error);
      }
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadVideogames();
    }
  }

  nextPage() {
    if (this.currentPage < this.pageNumbers.length) {
      this.currentPage++;
      this.loadVideogames();
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadVideogames();
  }

  calculatePageNumbers(): void {
    const totalPages = Math.ceil(this.totalVideogames / this.pageSize);
    this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  searchGames(): void {
    const searchTerm = this.searchQuery.trim();
    if (!searchTerm) {
      this.searchedVideogames = [];
      return;
    }
    this.videogameService.searchVideogames(searchTerm).subscribe(
      (data: any) => {
        this.searchedVideogames = Array.isArray(data) ? data : [];
        console.log(data);
      },
      (error) => {
        console.error('Errore durante la ricerca dei videogiochi:', error);
      }
    );
  }

}
