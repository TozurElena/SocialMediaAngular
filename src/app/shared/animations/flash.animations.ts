import { animate, animation, sequence, style } from '@angular/animations';

export const flashAnimation = animation([
  // la  sequence  qui correspond au flash au  group  des fade-in:
  sequence([
    animate('{{ time }}', style({
      'background-color': '{{ flashColor}}'
    })),
    animate('{{ time }}', style({
      'background-color': 'white'
    })),
  ]),
])
