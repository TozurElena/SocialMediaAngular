import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from '../../../environments/environment';

// vous n'ajoutez pas  { providedIn: 'root' }  au décorateur  @Injectable() .
// Puisque SocialMediaModule est lazy-loaded et que PostsService ne sert qu'à l'intérieur de SocialMediaModule,
// ça ne nous intéresse pas que ce service soit chargé à la racine de l'application.
// On voudrait qu'il soit lié uniquement au module où il sert.
//   Pour cela, vous allez ajouter un tableau providers à SocialMediaModule
@Injectable()
export class PostsService {
  constructor(private http: HttpClient) {
  }

/**la méthode  getPosts()  retournera la requête pour récupérer tous les Posts du backend*/
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }

  addNewComment(postCommented: { comment: string; postId: number }) {
    console.log(postCommented);
  }
}
