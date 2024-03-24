import { Ivideogame } from './../models/ivideogame';
import { Component, OnInit } from '@angular/core';
import { VideogameService } from '../../../services/videogame.service';
import { forkJoin } from 'rxjs';

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
  searched: boolean = false;
  selectedGenre: string = '';

  constructor(private videogameService: VideogameService) {
    this.pageNumbers = [];
  }

  ngOnInit(): void {
    this.loadVideogamesMetacritic();
  }

  loadVideogamesMetacritic(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageSize = this.pageSize;
    this.videogameService.getAllVideogamesByMetacritic(startIndex, pageSize).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.content)) {
          this.videogames = data.content;
          this.totalVideogames = data.totalElements;
        } else {
          console.error('Dati non validi per i videogiochi:', data);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei videogiochi:', error);
      }
    );
  }

  searchGames(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const pageSize = this.pageSize;
    const searchTerm = this.searchQuery.trim();

    if (!searchTerm && !this.selectedGenre) {
      this.searchedVideogames = [];
      this.searched = false;
      return;
    }

    if (searchTerm) {
      this.searchGamesByTitle(startIndex, pageSize, searchTerm);
    } else if (this.selectedGenre === 'any') {
      this.loadVideogamesMetacritic();
    } else if (this.selectedGenre) {
      this.searchGamesByGenre(startIndex, pageSize, this.selectedGenre);
    }
  }

  searchGamesByTitleAndGenre(startIndex: number, pageSize: number, searchTerm: string, selectedGenre: string): void {
    const titleSearch$ = this.videogameService.searchVideogames(searchTerm);
    const genreSearch$ = this.videogameService.searchVideogamesByGenre(selectedGenre);

    forkJoin([titleSearch$, genreSearch$]).subscribe(
      (results: any[]) => {
        const allGames = [...results[0].content, ...results[1].content];

        const uniqueGames = this.removeDuplicates(allGames);

        this.searchedVideogames = uniqueGames;
        this.totalVideogames = uniqueGames.length;
        this.searched = true;
      },
      (error) => {
        console.error('Errore durante la ricerca dei videogiochi:', error);
      }
    );
  }

  removeDuplicates(games: any[]): any[] {
    const uniqueGames: any[] = [];
    const uniqueGameTitles = new Set<string>();

    games.forEach((game) => {
      const gameTitle = game.titolo.toLowerCase();

      if (!uniqueGameTitles.has(gameTitle) &&
          gameTitle.includes(this.searchQuery.toLowerCase()) &&
          (!this.selectedGenre || game.genere === this.selectedGenre)) {
        uniqueGames.push(game);
        uniqueGameTitles.add(gameTitle);
      }
    });

    return uniqueGames;
  }

  searchGamesByTitle(startIndex: number, pageSize: number, searchTerm: string): void {
    this.videogameService.searchVideogames(searchTerm).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.content)) {
          this.searchedVideogames = data.content;
          this.totalVideogames = data.totalElements;
          this.searched = true;
        } else {
          console.error('Dati non validi per i videogiochi:', data);
          this.searchedVideogames = [];
          this.searched = false;
        }
      },
      (error) => {
        console.error('Errore durante la ricerca dei videogiochi:', error);
      }
    );
  }
  searchGamesByGenre(startIndex: number, pageSize: number, selectedGenre: string): void {
    console.log('Genere selezionato:', selectedGenre);

    if (this.searchQuery.trim()) {
      this.videogameService.searchVideogames(this.searchQuery.trim()).subscribe(
        (data: any) => {
          if (data && Array.isArray(data.content)) {
            this.searchedVideogames = data.content.filter((game: any) => game.genere === selectedGenre);
            this.totalVideogames = this.searchedVideogames.length;
            this.searched = true;
          } else {
            console.error('Dati non validi per i videogiochi:', data);
            this.searchedVideogames = [];
            this.searched = false;
          }
        },
        (error) => {
          console.error('Errore durante la ricerca dei videogiochi per genere:', error);
        }
      );
    } else {
      this.videogameService.searchVideogamesByGenre(selectedGenre).subscribe(
        (data: any) => {
          if (data && Array.isArray(data.content)) {
            this.searchedVideogames = data.content;
            this.totalVideogames = data.totalElements;
            this.searched = true;
          } else {
            console.error('Dati non validi per i videogiochi:', data);
            this.searchedVideogames = [];
            this.searched = false;
          }
        },
        (error) => {
          console.error('Errore durante la ricerca dei videogiochi per genere:', error);
        }
      );
    }
  }
}
