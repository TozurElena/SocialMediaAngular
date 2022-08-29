import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmEqualValidator(main:string, confirm: string): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(main) || !ctrl.get(confirm)) {
      return  {
        confirmEqual: 'Invalid controls names'
      };
    }

    const mainValue = ctrl.get(main)!.value;
    const confirmValue = ctrl.get((confirm))!.value;
    // si les deux champs contiennent des valeurs égales,  retournez  null :
    // sinon,  retournez une erreur qui contient les deux valeurs comparées.
    return mainValue === confirmValue ? null : {
      confirmEqual: {
        main: mainValue,
        confirm: confirmValue
      }
    };
  };
}

// donc l'appliquer aux deux FormGroups emailForm  et  loginInfoForm  ,
// en passant un deuxième argument à  FormBuilder.group
