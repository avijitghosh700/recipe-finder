import { Component, OnInit, WritableSignal, effect, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, debounceTime, finalize, merge, switchMap } from 'rxjs';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent implements OnInit {
  public searchForm!: UntypedFormGroup;

  public recipes$: Observable<Recipe[]> | null = null;
  private searchObservable$: Observable<Recipe[]> | null = null;
  private initialRecipesObservable$: Observable<Recipe[]> | null = null;

  public isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly recipeService: RecipeService
  ) {
    this.searchForm = this.formBuilder.group({
      search: [],
    });

    effect(() => {
      document.body.style.overflow = this.isLoading() ? 'hidden' : '';
    })
  }

  ngOnInit(): void {
    this.searchObservable$ = this.searchForm.controls[
      'search'
    ].valueChanges.pipe(
      debounceTime(200),
      switchMap((value: string) => this.searchRecipesWithLoading(value))
    );

    this.initialRecipesObservable$ = this.getRecipesWithLoading();

    this.recipes$ = merge(this.searchObservable$, this.initialRecipesObservable$);
  }

  private searchRecipesWithLoading(value: string): Observable<Recipe[]> {
    this.isLoading.update(() => true);

    return this.recipeService.searchRecipes(value).pipe(
      finalize(() => {
        this.isLoading.update(() => false);
      })
    );
  }

  private getRecipesWithLoading(): Observable<Recipe[]> {
    this.isLoading.update(() => true);

    return this.recipeService.getRecipes().pipe(
      finalize(() => {
        this.isLoading.update(() => false);
      })
    );
  }

  clearField() {
    this.searchForm.controls['search'].patchValue('');
    this.initialRecipesObservable$ = this.getRecipesWithLoading();
  }
}
