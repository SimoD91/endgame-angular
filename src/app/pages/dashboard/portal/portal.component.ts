import { Ivideogame } from './../models/ivideogame';
import { Component, OnInit } from '@angular/core';
import { VideogameService } from '../../../services/videogame.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnInit {
  totalVideogames = 0;
  videogames: Ivideogame[] = [];
  searchedVideogames: Ivideogame[] = [];
  isVideogamesArray: boolean = false;
  searchQuery: string = '';
  searched: boolean = false;
  selectedGenre: string = '';
  pageTitle: string = 'I migliori per Metacritic'

  constructor(private videogameService: VideogameService) {
  }

  ngOnInit(): void {
    this.loadVideogamesMetacritic();
  }

  loadVideogamesMetacritic(): void {
    this.videogameService.getAllVideogamesByMetacritic().subscribe(
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

  loadAllVideogames(): void {
    this.pageTitle = 'Tutti i titoli';
    this.videogameService.getAllVideogames().subscribe(
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
    const searchTerm = this.searchQuery.trim();

    if ((!searchTerm || searchTerm === '') && (!this.selectedGenre || this.selectedGenre === 'any')) {
      this.loadAllVideogames();
      return;
    }

    if (!searchTerm && !this.selectedGenre) {
      this.searchedVideogames = [];
      this.searched = false;
      return;
    }

    if (searchTerm && !this.selectedGenre) {
      this.searchGamesByTitle(searchTerm);
    } else if ((!searchTerm || searchTerm === '') && (!this.selectedGenre || this.selectedGenre === 'any')) {
      this.loadAllVideogames();
    } else if (!searchTerm && this.selectedGenre) {
      this.searchGamesByGenre(this.selectedGenre);
    } else if (searchTerm && this.selectedGenre) {
      if (!this.selectedGenre || this.selectedGenre === 'any')  {
        this.searchGamesByTitle(searchTerm);
      } else {
        this.searchGamesByTitleAndGenre(searchTerm, this.selectedGenre);
      }
    }

  }

clearSearchQuery(): void {
  this.searchQuery = '';
}

  searchGamesByTitleAndGenre(searchTerm: string, selectedGenre: string): void {
    this.videogameService.searchVideogamesTitleAndGenre(searchTerm, selectedGenre).subscribe(
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
        console.error('Errore durante la ricerca dei videogiochi per titolo e genere:', error);
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

  searchGamesByTitle(searchTerm: string): void {

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

  searchGamesByGenre(selectedGenre: string): void {
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
