import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

// le décorateur @Directive  , à qui on passe un objet de configuration avec un  selector  , un peu comme pour les components. Pour pouvoir placer cette directive en tant qu'attribut HTML, le  selector  doit être entre crochets  []  ;
// la Directive implémente le lifecycle hook AfterViewInit  , car vous devez vous assurer que la view existe avant de commencer à manipuler des éléments qui s'y trouvent ;
// dans le  constructor  , vous injectez ElementRef  et Renderer2  :
//   ElementRef  est la référence à l'élément du DOM, et l'injection d'Angular vous permet de l'injecter directement comme ça,
//   Renderer2  est un outil qui vous permet d'interagir avec le DOM de manière testable, c'est-à-dire que vous pourrez écrire des tests unitaires – qui peuvent être exécutés dans un contexte où le DOM n'existe pas – qui fonctionneront correctement ;
// après l'initialisation de la view, vous utilisez la méthode  setStyle  de  Renderer2  pour changer la couleur de fond de l'élément sur lequel la Directive se trouve – l'objet  ElementRef  le met à disposition via son objet  nativeElement  .
@Directive({
  selector:'[highlight]'
})
export class HighlightDirective implements AfterViewInit {
  constructor(private el: ElementRef,
              private  renderer: Renderer2) {
  }
  @Input() highlight!: string;

  ngAfterViewInit() {
    this.setBackgroundColor(this.highlight);
  }

  setBackgroundColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

  // Dans cet exemple :
  //   quand la souris entre sur l'élément, vous changez sa couleur de fond en  lightgreen  ;
  // si la souris sort sans avoir cliqué, la couleur revient à sa couleur par défaut ;
  // si l'utilisateur clique sur l'élément, la couleur par défaut est changée en  lightgreen  ,
  // ce qui donne l'effet de "valider" ce qui est cliqué : l'élément restera  lightgreen  en permanence.
  @HostListener('mouseenter') onMouseEnter() {
    this.setBackgroundColor('lightgreen')
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor(this.highlight);
  }

  @HostListener('click') onClick() {
    this.highlight  = 'lightgreen';
  }
}



