import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Movie, Message} from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  constructor(private http: HttpClient) {
  }

  import(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>('/api/movie/import', fd);
  }

  save(movieData: object): Observable<any> {
    return this.http.post<any>('/api/movie/', movieData);
  }

  fetch(): Observable<Movie[]> {
    return this.http.get<Movie[]>('/api/movie/');
  }

  delete(id: string): Observable<Message>{
    return this.http.delete<Message>(`/api/movie/${id}`);
  }

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`/api/movie/${id}`);
  }

  search(criterion: string, text: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`/api/movie/${criterion}/${text}`);
  }
}

