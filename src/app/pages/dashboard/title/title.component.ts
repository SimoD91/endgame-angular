import { Component, OnInit } from '@angular/core';
import { VideogameService } from '../../../services/videogame.service';
import { ActivatedRoute } from '@angular/router';
import { Ivideogamedetails } from '../models/ivideogamedetails';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit {
  selectedVideogame: Ivideogamedetails | undefined;
  safeTrailerUrl: SafeResourceUrl | undefined;
  pageTitle: string = 'I migliori per Metacritic';
  videogames: any[] = [];
  totalVideogames: number = 0;
  isEnlarged: boolean = false;
  pageNumber: number = 0;
  isFavorite: boolean = false;
  userId: number = 0;
  favoriteVideogameIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private videogameService: VideogameService,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const videogameId = params.get('id');
      if (videogameId) {
        this.getVideogameById(parseInt(videogameId));

        const token = localStorage.getItem('token');
        if (token) {
          this.userId = this.userService.getUserIdFromToken(token);

          this.loadFavoriteVideogameIds();
        } else {
          console.error('Token non presente nel local storage');
        }
      }
    });
  }



  getVideogameById(id: number): void {
    this.videogameService.getVideogiocoById(id).subscribe(
      (data: Ivideogamedetails) => {
        this.selectedVideogame = data;
        if (this.selectedVideogame && this.selectedVideogame.trailer) {
          this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideogame.trailer);
        }
      },
      (error) => {
        console.error('Errore durante il caricamento del videogioco:', error);
      }
    );
  }

  private extractVideoId(url: string): string {
    const pattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  }

  getYouTubeEmbedUrl(videoUrl: string | undefined): string {
    if (!videoUrl) return '';
    const videoId = this.extractVideoId(videoUrl);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  loadVideogamesMetacritic(): void {
    this.videogameService.getAllVideogamesByMetacritic(this.pageNumber).subscribe(
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

  toggleEnlarged(event: MouseEvent) {
    const imgElement = event.target as HTMLElement;
    if (this.isEnlarged) {
      imgElement.classList.remove('enlarged');
    } else {
      imgElement.classList.add('enlarged');
    }
    this.isEnlarged = !this.isEnlarged;
  }

  addToFavorites(videogameId: number): void {
    if (this.userId) {
      this.userService.addToFavorites(this.userId, videogameId).subscribe(
        () => {
          this.favoriteVideogameIds.push(videogameId);
        },
        error => {
          console.error('Errore durante l\'aggiunta ai preferiti:', error);
        }
      );
    }
  }

  removeFromFavorites(videogameId: number): void {
    if (this.userId) {
      this.userService.removeFromFavorites(this.userId, videogameId).subscribe(
        () => {
          const index = this.favoriteVideogameIds.indexOf(videogameId);
          if (index !== -1) {
            this.favoriteVideogameIds.splice(index, 1);
          }
        },
        error => {
          console.error('Errore durante la rimozione dai preferiti:', error);
        }
      );
    }
  }

  loadFavoriteVideogameIds(): void {
    if (!this.userId) return;

    this.userService.getFavoriteVideogameIds(this.userId).subscribe(
      (data: number[]) => {
        this.favoriteVideogameIds = data;
      },
      (error) => {
        console.error('Errore nel recupero degli ID dei preferiti:', error);
      }
    );
  }

  toggleFavorite(): void {
    if (!this.selectedVideogame || !this.userId) return;

    const videogameId = this.selectedVideogame.idVideogioco;

    const isCurrentlyFavorite = this.selectedVideogame.isFavorite;

    if (isCurrentlyFavorite) {
      this.userService.removeFromFavorites(this.userId, videogameId)?.subscribe(() => {
        if (this.selectedVideogame) {
          this.selectedVideogame.isFavorite = false;
        }
      });
    } else {
      this.userService.addToFavorites(this.userId, videogameId)?.subscribe(() => {
        if (this.selectedVideogame) {
          this.selectedVideogame.isFavorite = true;
        }
      });
    }
  }
}
