import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorias',
  imports: [CommonModule, RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {
  starIcon = 'assets/icons/star.png';

  categories: any[] = [
    {
      id: 'mascotas',
      title: 'Mascotas',
      description:
        'Productos y accesorios para el bienestar de tus amigos peludos.',
      image: 'assets/images/categorias/mascotas.png', 
    }
  ];

}
