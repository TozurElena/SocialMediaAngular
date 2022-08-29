import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostsResolver } from './resolvers/posts.resolver';

const routes: Routes = [
  // L'objet resolve que vous passez à la configuration de la route lie les données récupérées par le resolver à une clé posts
  // qui permettra à PostListComponent d'y accéder.
  { path: '', component: PostListComponent, resolve: { posts: PostsResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
