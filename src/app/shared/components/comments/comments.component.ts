import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  animate,
  animateChild,
  group,
  query,
  stagger,
  state,
  style,
  transition,
  trigger, useAnimation
} from '@angular/animations';
import { flashAnimation } from '../../animations/flash.animations';
import { slideAndFadeAnimation } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@listItem', [
          // Pour déclencher les animations d'un élément enfant, utiliser  animateChild
          // pour décaler ces déclenchements dans le temps, utiliser  stagger
          stagger(50, [
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('listItem', [
      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(155,86,219)',
        'z-index': 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
      // pouvez remplacer  'void => *'  par son raccourci  ':enter'
      transition(':enter', [
        query('.comment-text, .comment-date', [
          style({
            opacity:0
          }),
        ]),
        useAnimation(slideAndFadeAnimation, {
          params: {
            time:'500ms',
            startColor: 'rgb(96,24,163)'
          }
        }),
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'rgb(230,125,58)'
            }
          }),
          // la fonction  query  permet de cibler des enfants de l'élément qui comporte le  trigger  :
          query('.comment-text', [
            animate('250ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('800ms', style({
              opacity: 1
            }))
          ]),
        ])

      ])
    ])
  ]
})
export class CommentsComponent implements OnInit {

  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();
  commentCtrl!: FormControl;
  animationStates: { [key: number]: 'default' | 'active' } = {};

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);
    for (let index in this.comments) {
      this.animationStates[index] = 'default';
    }
  }

  // méthode onLeaveComment():
  //   si l'utilisateur n'a pas entré un commentaire valable dans le champ de texte, vous ignorez l'événement – avec l'affichage en rouge fourni par Material, il s'agit d'une alternative à la désactivation du bouton ;
  // vous appelez  emit  sur votre nouvel  EventEmitter  en y passant le contenu du champ de texte ;
  // vous appelez  reset  sur le  FormControl  pour vider le champ de texte.
  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }
    const maxId = Math.max(...this.comments.map(comment => comment.id));
    //add new comment à la debut de tableau
    this.comments.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId:1
    })
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  onListItemMouseEnter(index:number) {
    this.animationStates[index] = 'active';
  }
  onListItemMouseLeave(index:number) {
    this.animationStates[index] = 'default';
  }
}
