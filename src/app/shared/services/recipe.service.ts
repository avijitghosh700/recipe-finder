import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private headers: HttpHeaders = new HttpHeaders({
    'X-RapidAPI-Key': environment.XRapidAPIKey,
    'X-RapidAPI-Host': environment.XRapidAPIHost,
  });

  constructor(private readonly http: HttpClient) {}

  getRecipes(limit: number = 20): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(`${environment.rapidApiUrl}?from=${0}&size=${limit}`, {
        headers: this.headers,
      })
      .pipe(map((res: any) => res.results));
  }

  searchRecipes(query: string, limit: number = 20): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        `${environment.rapidApiUrl}?from=${0}&size=${limit}&q=${query}`,
        { headers: this.headers }
      )
      .pipe(map((res: any) => res.results));
  }
}
