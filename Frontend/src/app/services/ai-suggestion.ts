import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AiSuggestionService {
  private apiUrl = 'http://localhost:5000/ai/suggest-title';

  constructor(private http: HttpClient) {}

  suggestTitle(description: string): Observable<string> {
    return this.http.post<{ title: string }>(this.apiUrl, { description })
      .pipe(map(response => response.title));
  }
}