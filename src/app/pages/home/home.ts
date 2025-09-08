import { Component } from '@angular/core';
import { SwiperHero } from "../../components/swiper-hero/swiper-hero";
import { Ventajas } from "../../components/ventajas/ventajas";
import { Categorias } from "../../components/categorias/categorias";

@Component({
  selector: 'app-home',
  imports: [SwiperHero, Ventajas, Categorias],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
