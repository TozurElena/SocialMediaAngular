import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, delay, map, Observable, tap } from 'rxjs';
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
}


// Il y a deux éléments de state – des sources de données – à exposer dans CandidatesService :
//   loading$  – qui émettra  true  ou  false  selon qu'un chargement est en cours ou non ;
// candidates$  – qui émettra des tableaux de  Candidate .
//   Pour créer des BehaviorSubjects qui sont exposés comme des Observables simples (empêchant des components d'appeler leur méthode  next ),
//   je vous propose un pattern  private + getter  :
