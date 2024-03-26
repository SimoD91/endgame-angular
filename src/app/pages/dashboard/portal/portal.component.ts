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
  pageTitle: string = 'I migliori per Metacritic';
  searchYear: string = '';
  selectedConsole: string = '';
  errorMessage: string = '';

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
    const searchTitle = this.searchQuery.trim();
    const searchYear = this.searchYear.trim();
    const searchGenre = this.selectedGenre;
    const searchConsole = this.selectedConsole;

    const isSearchEmptyOrAny = (!searchTitle || searchTitle === '') && (!searchGenre || searchGenre === 'any') && (!searchYear || searchYear === '') && (!searchConsole || searchConsole === 'any');

    if (isSearchEmptyOrAny) {
      this.loadAllVideogames();
      this.errorMessage = '';
      return;
    }


    if (searchTitle && !searchGenre && !searchYear && !searchConsole) {
      this.searchGamesByTitle(searchTitle);
    } else if ((!searchTitle || searchTitle === '') && (!searchGenre || searchGenre === 'any') && searchYear && !searchConsole) {
      this.searchGamesByYear(parseInt(searchYear));
    } else if ((!searchTitle || searchTitle === '') && (!searchGenre || searchGenre === 'any') && !searchYear && searchConsole && searchConsole !== 'any') {
      this.searchGamesByConsole();
    } else if ((!searchTitle || searchTitle === '') && (!searchGenre || searchGenre === 'any') && !searchYear && searchConsole && searchConsole === 'any') {
      this.loadAllVideogames();
    } else if (!searchTitle && searchGenre && !searchYear && !searchConsole) {
      this.searchGamesByGenre(searchGenre);
    } else if (searchTitle && searchGenre && !searchYear && !searchConsole) {
      if (!searchGenre || searchGenre === 'any')  {
        this.searchGamesByTitle(searchTitle);
      } else {
        this.searchGamesByTitleAndGenre(searchTitle, searchGenre);
      }
    }
}
setErrorMessageIfNoResults(): void {
  if (this.searchedVideogames.length === 0) {
    this.errorMessage = 'Nessun gioco trovato';
  } else {
    this.errorMessage = '';
  }
}


clearSearchQuery(): void {
  this.searchQuery = '';
}

clearSearchYear(): void {
  this.searchYear = '';
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
          if (data.content.length > 0) {
            this.searchedVideogames = data.content;
            this.totalVideogames = data.totalElements;
            this.searched = true;
            this.errorMessage = '';
          } else {
            this.searchedVideogames = [];
            this.searched = false;
            this.errorMessage = 'Nessun videogioco trovato';
          }
        } else {
          console.error('Dati non validi per i videogiochi:', data);
          this.searchedVideogames = [];
          this.searched = false;
          this.errorMessage = 'Errore durante la ricerca dei videogiochi';
        }
      },
      (error) => {
        console.error('Errore durante la ricerca dei videogiochi:', error);
        this.errorMessage = 'Errore durante la ricerca dei videogiochi';
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
  searchGamesByYear(year: number): void {
    if (!year) {
      console.error('Anno non valido');
      return;
    }

    this.videogameService.searchVideogamesByYear(year).subscribe(
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
        console.error('Errore durante la ricerca dei videogiochi per anno di uscita:', error);
      }
    );
  }

  searchGamesByConsole(): void {
    if (this.selectedConsole) {
      this.videogameService.searchVideogamesByConsole(this.selectedConsole).subscribe(
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
          console.error('Errore durante la ricerca dei videogiochi per console:', error);
        }
      );
    } else {
      console.error('Nessuna console selezionata.');
    }
  }
}
