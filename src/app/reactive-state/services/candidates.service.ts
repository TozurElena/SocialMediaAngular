import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, delay, map, Observable, switchMap, take, tap } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { environment } from '../../../environments/environment';

@Injectable()
export  class CandidatesService {
  constructor(private http: HttpClient) {}

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  private lastCandidatesLoad = 0;

  // Appeler  next  sur l'un des BehaviorSubjects du service,
  // c'est s'assurer que tous les components qui sont souscrits à leurs Observables recevront cette nouvelle donnée.
  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getCandidatesFromServer() {
    // si la différence entre  Date.now()  et  lastCandidatesLoaded  est inférieure à 300.000 (5 minutes en millisecondes), vous ne faites rien ;
    // si ça fait plus de 5 minutes, vous lancez la logique de rechargement, et vous stockez la  Date.now()  du moment de la réception des données.
    if (Date.now() - this.lastCandidatesLoad <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Candidate[]>(`${environment.apiUrl}/candidates`).pipe(
      delay(1000),
      tap(candidates => {
        this.lastCandidatesLoad = Date.now();
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getCandidateById(id: number): Observable<Candidate> {
    if (!this.lastCandidatesLoad) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      map(candidates => candidates.filter(candidate => candidate.id === id)[0])
    );
  }
  //modification pessimiste
  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/candidates/${id}`).pipe(
      delay(1000),
      // quand la requête réussit, vous transférez l'Observable vers les candidates$ à l'instant t ;
      switchMap(() => this.candidates$),
      take(1),
      // si vous ne mettez pas le take(1) , vous finirez dans un infinite loop !
      // Tout ce qui vient après ce switchMap ne doit être exécuté qu'une seule fois par suppression ;
      // utilisez map pour modifier le tableau,
      // retournant un tableau qui contient tous les candidats sauf celui qui comporte l' id passé en argument ;
      map(candidates => candidates.filter(candidate => candidate.id != id)),
      //  faites émettre la nouvelle liste de candidats et l'état de chargement.- state management réactif
      tap(candidates => {
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  // Pour la modification optimiste,
  // vous allez d'abord mettre à jour les données de l'application avant même d'envoyer la requête au serveur :
  // transformez puis faites émettre le tableau des candidats à jour,
  // puis vous envoyez une requête PATCH avec le candidat mis à jour !
  hireCandidate(id: number): void {
    this.candidates$.pipe(
      take(1),
      map(candidates => candidates
        .map(candidate => candidate.id === id ?
          {...candidate, company: 'Snapface Ltd'} :
          candidate
        )
      ),
      tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
      switchMap(updatedCandidates =>
        this.http.patch(`${environment.apiUrl}/candidates/${id}`,
        updatedCandidates.find(candidate => candidate.id === id))
      )
    ).subscribe();
  }
}



// Il y a deux éléments de state – des sources de données – à exposer dans CandidatesService :
//   loading$  – qui émettra  true  ou  false  selon qu'un chargement est en cours ou non ;
// candidates$  – qui émettra des tableaux de  Candidate .
//   Pour créer des BehaviorSubjects qui sont exposés comme des Observables simples (empêchant des components d'appeler leur méthode  next ),
//   je vous propose un pattern  private + getter
