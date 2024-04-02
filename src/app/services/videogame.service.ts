import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ivideogame } from '../pages/dashboard/models/ivideogame';
import { Ivideogamedetails } from '../pages/dashboard/models/ivideogamedetails';

@Injectable({
  providedIn: 'root'
})
export class VideogameService {
apiUrl = 'http://localhost:8080/videogiochi/get/sorted/bestmetascore';
apiUrlAll = 'http://localhost:8080/videogiochi/get';


  constructor(private http: HttpClient) {}

  //--- Tutti i videogiochi best of metacritic tramite chiamata get ---\\
  getAllVideogamesByMetacritic(pageNumber: number): Observable<any> {
    return this.http.get<Ivideogame[]>(`${this.apiUrl}?page=${pageNumber}`);
  }

  //--- Tutti i videogiochi presenti nel DB tramite chiamata get ---\\
  getAllVideogames(pageNumber: number): Observable<any>{
    return this.http.get<Ivideogame[]>(`${this.apiUrlAll}?page=${pageNumber}`);
  }

  //--- Ricerca videogiochi per titolo ---\\
  searchVideogames(query: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/titolo?titolo=${query}`;
    return this.http.get(url);
  }

  //--- Ricerca videogiochi per genere ---\\
  searchVideogamesByGenre(genre: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/genere?genere=${genre}`;
    return this.http.get(url);
  }

  //--- Ricerca videogiochi per titolo e genere ---\\
  searchVideogamesTitleAndGenre(query: string, selectedGenre: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/titoloegenere?titolo=${query}&genere=${selectedGenre}`;
    return this.http.get<Ivideogame[]>(url);
  }

  //--- Ricerca videogiochi per anno ---\\
  searchVideogamesByYear(year: number): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/anno?annoDiUscita=${year}`;
    return this.http.get<Ivideogame[]>(url);
  }

  //--- Ricerca videogiochi per console ---\\
  searchVideogamesByConsole(selectedConsole: string): Observable<any> {
    const url = `http://localhost:8080/videogiochi/get/sorted/console?console=${selectedConsole}`;
    return this.http.get<Ivideogame[]>(url);
  }

  //--- Recupera videogioco per id ---\\
  getVideogiocoById(id: number): Observable<Ivideogamedetails> {
    const url = `http://localhost:8080/videogiochi/get/${id}`;
    return this.http.get<Ivideogamedetails>(url);
  }

}
