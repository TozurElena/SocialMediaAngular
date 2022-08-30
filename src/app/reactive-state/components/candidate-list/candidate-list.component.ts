import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CandidatesService } from '../../services/candidates.service';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Candidate } from '../../models/candidate.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { CandidateSearchType } from '../../enums/candidate-search-type.enum';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  // objet searchTypeOptions associe des valeurs valides pour la recherche à un label pour l'affichage dans le dropdown
  searchTypeOptions!: {
    value: CandidateSearchType,
    label: string
  }[];

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  constructor(private  candidateService: CandidatesService,
              private  formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
    this.candidateService.getCandidatesFromServer();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(CandidateSearchType.LASTNAME);
    this.searchTypeOptions = [
      { value: CandidateSearchType.LASTNAME, label: 'Nom' },
      { value: CandidateSearchType.FIRSTNAME, label: 'Prenom' },
      { value: CandidateSearchType.COMPANY, label: 'Entreprise' }
    ];
  }

  private initObservables() {
    this.loading$ = this.candidateService.loading$;

    const search$ = this.searchCtrl.valueChanges.pipe(
      // un opérateur startWith pour faire émettre les Observables au moment de la souscription –
      // ils émettront la valeur par défaut des champs.
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<CandidateSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    // combiner ces Observables avec l'Observable du service :
    // L'opérateur combineLatest prend un tableau d'Observables en argument.
    //   Il attend que chaque Observable ait émis au moins une fois, et puis,
    //   à chaque émission d'un des Observables, émet les dernières émissions de tous les Observables sous forme de tuple.
    // Ici, on a d'abord un tuple de cette forme :
    //   ['', 'lastName', [ tableau de tous les candidats ]]
    this.candidates$ = combineLatest([
      search$,
      searchType$,
      this.candidateService.candidates$
    ]).pipe(
    //  filter candidates here
      map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }


}
