import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ivideogame } from '../pages/dashboard/models/ivideogame';

@Injectable({
  providedIn: 'root'
})
export class VideogameService {
  private apiUrl = 'http://localhost:8080/videogiochi/get/sorted/bestmetascore';

  constructor(private http: HttpClient) {}

 getAllVideogamesByMetacritic(startIndex: number, pageSize: number): Observable<any> {
    return this.http.get<Ivideogame[]>(this.apiUrl);
  }

  searchVideogames(query: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/titolo?titolo=${query}`;
    return this.http.get(url);
  }

  searchVideogamesByGenre(genre: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/genere?genere=${genre}`;
    return this.http.get(url);
  }
}
