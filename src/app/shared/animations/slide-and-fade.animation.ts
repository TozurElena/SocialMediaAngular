import { animate, animation, style } from '@angular/animations';

export const slideAndFadeAnimation = animation([
  // d'une animation qui contient la description de l'animation et les styles d'arrivée.
  style({
    transform: 'translateX(-100%)',
    opacity:0,
    'background-color': '{{ startColor }}',
  }),
  animate('{{ time }} ease-out', style({
    transform: 'translateX(0)',
    opacity:1,
    'background-color': 'white',
  })),
])
