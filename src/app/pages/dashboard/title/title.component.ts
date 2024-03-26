import { Component, OnInit } from '@angular/core';
import { VideogameService } from '../../../services/videogame.service';
import { ActivatedRoute } from '@angular/router';
import { Ivideogamedetails } from '../models/ivideogamedetails';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  constructor(
    private route: ActivatedRoute,
    private videogameService: VideogameService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const videogameId = params.get('id');
      if (videogameId) {
        this.getVideogameById(parseInt(videogameId));
        this.loadVideogamesMetacritic();
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
}
