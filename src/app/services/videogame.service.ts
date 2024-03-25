import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ivideogame } from '../pages/dashboard/models/ivideogame';

@Injectable({
  providedIn: 'root'
})
export class VideogameService {
apiUrl = 'http://localhost:8080/videogiochi/get/sorted/bestmetascore';
  private apiUrlAll = 'http://localhost:8080/videogiochi/get';


  constructor(private http: HttpClient) {}

  getAllVideogamesByMetacritic(): Observable<any> {
    return this.http.get<Ivideogame[]>(this.apiUrl);
  }

  getAllVideogames(): Observable<any>{
    return this.http.get<Ivideogame[]>(this.apiUrlAll);
  }

  searchVideogames(query: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/titolo?titolo=${query}`;
    return this.http.get(url);
  }

  searchVideogamesByGenre(genre: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/genere?genere=${genre}`;
    return this.http.get(url);
  }

  searchVideogamesTitleAndGenre(query: string, selectedGenre: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/titoloegenere?titolo=${query}&genere=${selectedGenre}`;
    return this.http.get<Ivideogame[]>(url);
  }

}
