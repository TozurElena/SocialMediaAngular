import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, mapTo, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ComplexFormValue } from '../modele/complex-form-valid.model';

@Injectable()
export class ComplexFormService {
  constructor(private http: HttpClient) {
  }
  // L'idée avec cette méthode est de recevoir un message  true  pour une requête réussie,
  // ou  false  pour une requête échouée.
  saveUserInfo(formValue: ComplexFormValue): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/users`, formValue).pipe(
      // utilise mapTo  pour transformer toute réponse du serveur (et donc émission de l'Observable) en true  , peu importe la valeur de la réponse ;
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
