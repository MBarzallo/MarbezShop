import { Component, OnInit } from '@angular/core';
import { SwiperHero } from "../../components/swiper-hero/swiper-hero";
import { Ventajas } from "../../components/ventajas/ventajas";
import { Categorias } from "../../components/categorias/categorias";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [SwiperHero, Ventajas, Categorias],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/' && !sessionStorage.getItem('firstVisit')) {
      sessionStorage.setItem('firstVisit', '1');
      this.router.navigate(['/category/mascotas'], { replaceUrl: true });
    }
  }

}
