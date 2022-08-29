import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Post } from '../models/post.model';
import { PostsService } from '../services/posts.service';
import { Observable } from 'rxjs';

@Injectable()
export class PostsResolver implements Resolve<Post[]> {
  constructor(private postsService: PostsService) {
  }

 //  implémentez une méthode resolve qui :
 // accepte des  snapshot  de la route active et de son état – vous ne vous en servirez pas ici, mais sachez que chaque resolver reçoit automatiquement ces arguments,
 //  retourne les données récupérées – elles peuvent être retournées dans un Observable, une Promise, ou "en vrac".//  Ici on préférera l'Observable pour sa flexibilité.
 // Vous remarquerez que le resolver retourne l'Observable sans y souscrire.
  // C'est Angular qui effectuera la souscription quand il le faudra.
 // Il faut ajouter le nouveau resolver aux  providers  de SocialMediaModule pour qu'il soit utilisable :
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
    return this.postsService.getPosts();
  }
}
