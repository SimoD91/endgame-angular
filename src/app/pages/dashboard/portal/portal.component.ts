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
  pageNumber = 0;
  currentPage: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  showPagination = false;
  pageNumberConsole = 0;
  currentPageConsole: number = 0;
  totalPagesConsole: number = 0;
  pageNumbersConsole: number[] = [];
  searchPageNumber: number = 0;
  showConsolePagination = false;

  constructor(private videogameService: VideogameService) {
  }

  ngOnInit(): void {
    this.loadVideogamesMetacritic();
  }

    //--- Caricamento videogiochi metacritic ad avvio pagina ---\\
  loadVideogamesMetacritic(): void {
    this.videogameService.getAllVideogamesByMetacritic(this.currentPage).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.content)) {
          this.videogames = data.content;
          this.totalVideogames = data.totalElements;
          this.totalPages = data.totalPages;
          this.pageNumbers = this.totalPages > 0 ? Array.from({length: this.totalPages}, (_, i) => i) : [];
          this.showPagination = false;
        } else {
          console.error('Dati non validi per i videogiochi:', data);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei videogiochi:', error);
      }
    );
  }

   //--- Caricamento videogiochi totali nel DB ---\\
  loadAllVideogames(): void {
    this.pageTitle = 'Tutti i titoli';
    this.videogameService.getAllVideogames(this.currentPage).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.content)) {
          this.videogames = data.content;
          this.totalVideogames = data.totalElements;
          this.totalPages = data.totalPages;
          this.pageNumbers = this.totalPages > 0 ? Array.from({length: this.totalPages}, (_, i) => i) : [];
          this.showPagination = true;
          this.showConsolePagination = false;
        } else {
          console.error('Dati non validi per i videogiochi:', data);
        }
      },
      (error) => {
        console.error('Errore durante il recupero dei videogiochi:', error);
      }
    );
  }

 //--- Ricerca videogiochi in searchbar ---\\
 searchGames(): void {
  const searchTitle = this.searchQuery.trim();
  const searchYear = this.searchYear.trim();
  const searchGenre = this.selectedGenre;
  const searchConsole = this.selectedConsole;

  const isSearchEmptyOrAny = !searchTitle && !searchGenre && !searchYear && (!searchConsole || searchConsole === 'any');

  if (isSearchEmptyOrAny) {
    this.loadAllVideogames();
    this.errorMessage = '';
    return;
  }

  if (searchTitle) {
    this.searchGamesByTitle(searchTitle);
  } else if (searchYear) {
    this.searchGamesByYear(parseInt(searchYear, 10));
  } else if (searchGenre && searchGenre !== 'any') {
    this.searchGamesByGenre(searchGenre);
  } else if (searchConsole && searchConsole !== 'any') {
    this.currentPageConsole = 0;
    this.searchVideogamesByConsole();
  }
}


//--- Errore in caso di nessun risultato a schermo ---\\
setErrorMessageIfNoResults(): void {
  if (this.searchedVideogames.length === 0) {
    this.errorMessage = 'Nessun gioco trovato';
  } else {
    this.errorMessage = '';
  }
}

//--- Svuotamento campo input titolo searchbar dopo click ---\\
clearSearchQuery(): void {
  this.searchQuery = '';
}

//--- Svuotamento campo input anno searchbar dopo click ---\\
clearSearchYear(): void {
  this.searchYear = '';
}

//--- Ricerca incrociata videogiochi per titolo e genere ---\\
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

  //--- Rimozione duplicati videogiochi dopo ricerca ---\\
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

  //--- Ricerca videogioco per titolo ---\\
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

  //--- Ricerca videogioco per genere ---\\
  searchGamesByGenre(selectedGenre: string): void {
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

  //--- Ricerca videogioco per anno ---\\
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

  searchVideogamesByConsole(): void {
    if (this.selectedConsole && this.selectedConsole !== 'any') {
      this.videogameService.searchVideogamesByConsole(this.selectedConsole, this.currentPageConsole).subscribe(
        (data: any) => {
          if (data && Array.isArray(data.content)) {
            this.searchedVideogames = data.content;
            this.totalVideogames = data.totalElements;
            this.totalPagesConsole = data.totalPages;
            this.pageNumbersConsole = this.totalPagesConsole > 0 ? Array.from({length: this.totalPagesConsole}, (_, i) => i) : [];
            this.searched = true;
            this.showConsolePagination = true;
            this.showPagination = false;
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
      this.searchedVideogames = [];
      this.totalVideogames = 0;
      this.totalPagesConsole = 0;
      this.pageNumbersConsole = [];
      this.showConsolePagination = false;
      this.loadAllVideogames();
    }
  }

  //--- Numeri paginazione ---\\
  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.loadAllVideogames();
    }
  }

  //--- Button pagina precedente paginazione ---\\
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAllVideogames();
    }
  }

  //--- Button pagina successiva paginazione ---\\
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAllVideogames();
    }
  }

  //--- Numeri paginazione per ricerca per console ---\\
goToConsolePage(pageNumberConsole: number): void {
  if (pageNumberConsole >= 0 && pageNumberConsole <= this.totalPagesConsole) {
    this.currentPageConsole = pageNumberConsole;
    this.searchVideogamesByConsole();
  }
}

//--- Button pagina precedente paginazione per ricerca per console ---\\
previousConsolePage(): void {
  if (this.currentPageConsole > 0) {
    this.currentPageConsole--;
    this.searchVideogamesByConsole();
  }
}

//--- Button pagina successiva paginazione per ricerca per console ---\\
nextConsolePage(): void {
  if (this.currentPageConsole < this.totalPagesConsole - 1) {
    this.currentPageConsole++;
    this.searchVideogamesByConsole();
  }
}
}
