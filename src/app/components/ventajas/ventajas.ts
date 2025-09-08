import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ventajas',
  imports: [CommonModule],
  templateUrl: './ventajas.html',
  styleUrl: './ventajas.css',
})
export class Ventajas {
  items: any[] = [
    { icon: 'assets/icons/innovacion.png', title: 'INNOVACIÓN', text: 'Ofrecemos una plataforma moderna y fácil de usar para que tus compras sean rápidas y seguras.' },
    { icon: 'assets/icons/calidad.png', title: 'CALIDAD', text: 'Seleccionamos productos de alta calidad y trabajamos con proveedores confiables para garantizar tu satisfacción.' },
    { icon: 'assets/icons/experiencia.png', title: 'EXPERIENCIA', text: 'Contamos con experiencia en comercio electrónico, brindando un servicio eficiente y confiable.' },
    { icon: 'assets/icons/clientes.png', title: 'CLIENTES', text: 'Nos enfocamos en la experiencia del cliente, ofreciendo atención personalizada y soluciones a tus necesidades.' },
    { icon: 'assets/icons/soporte.png', title: 'SOPORTE', text: 'Disponemos de soporte técnico y atención al cliente para ayudarte en todo momento durante tu compra.' },
  ];
}
