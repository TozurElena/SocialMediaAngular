import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name:"timeAgo"
})

export class TimeAgoPipe implements PipeTransform {
  timeDiffs = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  };

  transform(value: string | Date): any {
    const now = Date.now();
    const then = new Date(value).getTime();
    const diff = now - then;
    if (diff < this.timeDiffs.minute) {
      return 'Il y a quelques secondes';
    } else if (diff < this.timeDiffs.hour) {
      return 'Il y a quelques minutes';
    } else if (diff < this.timeDiffs.day) {
      return 'Il y a quelques heures';
    } else if (diff < this.timeDiffs.week) {
      return 'Il y a quelques jours';
    } else if (diff < this.timeDiffs.month) {
      return 'Il y a quelques semaines';
    } else if (diff < this.timeDiffs.year) {
      return 'Il y a quelques mois';
    } else {
      return 'Il y a plus d\'un an';
    }
  }
}


// Dans ce Pipe :
//   l'objet  timeDiffs  permet de regrouper (et de nommer) des durées en millisecondes pour la comparaison de deux dates ;
// la méthode  transform  accepte des  string  ou des  Date  ;
// une première constante  now  contient le moment exact du runtime sous forme du nombre de millisecondes depuis le 1er janvier 1970 (l'époque UNIX) ;
// une deuxième constante  then  crée un nouvel objet  Date  à partir de value – ça marche pour les types  string  et  Date  – et utilise  getTime()  pour récupérer le nombre de millisecondes correspondant ;
// une dernière constante  diff  correspond à la différence entre  now  et  then  .
//   On compare la valeur de  diff  aux différentes durées dans  timeDiffs  pour retourner un texte descriptif approprié.
