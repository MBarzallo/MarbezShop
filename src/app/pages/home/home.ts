import { Component, OnInit } from '@angular/core';
import { SwiperHero } from '../../components/swiper-hero/swiper-hero';
import { Ventajas } from '../../components/ventajas/ventajas';
import { Categorias } from '../../components/categorias/categorias';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products-service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [SwiperHero, CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  skeletons = Array.from({ length: 8 });
  offset: number = 0;
  limit: number = 8;
  search = '';

  private search$ = new Subject<string>();

  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/' && !sessionStorage.getItem('firstVisit')) {
      sessionStorage.setItem('firstVisit', '1');
      this.router.navigate(['/category/mascotas'], { replaceUrl: true });
    }
    this.getProducts();
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((q) => {
        this.offset = 0;
        this.products = [];
        this.skeletons = Array.from({ length: 8 });
        this.getProducts();
      });
  }

  onSearch(q: string) {
    this.search$.next(q ?? '');
  }

  getProducts() {
    this.loading = true;
    this.productsService
      .getProducts({
        offset: this.offset,
        limit: this.limit,
        search: this.search,
      })
      .then((products) => {
        console.log(this.offset, this.limit);
        this.loading = false;
        if (products.length < this.limit) {
          this.skeletons = [];
        }
        this.products = [...this.products, ...products];
        this.offset += this.limit;
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error fetching products:', error);
      });
  }
  trackById(_: number, p: Product) {
    return p?.id ?? _;
  }
}
