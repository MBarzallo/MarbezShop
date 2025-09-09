import { Component, OnInit } from '@angular/core';
import { SwiperHero } from "../../components/swiper-hero/swiper-hero";
import { Ventajas } from "../../components/ventajas/ventajas";
import { Categorias } from "../../components/categorias/categorias";
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products-service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [SwiperHero, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
    skeletons = Array.from({ length: 8 });

  constructor(private router: Router, private productsService: ProductsService) {}

  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/' && !sessionStorage.getItem('firstVisit')) {
      sessionStorage.setItem('firstVisit', '1');
      this.router.navigate(['/category/mascotas'], { replaceUrl: true });
    }
    this.getProducts();
  }
  getProducts() {
    this.loading = true;
    this.productsService.getProductosByCategory("mascotas")
      .then(products => {
        this.loading = false;
        this.products = products;
      })
      .catch(error => {
        this.loading = false;
        console.error('Error fetching products:', error);
      });
  }
  trackById(_: number, p: Product) {
    return p?.id ?? _;
  }

}
