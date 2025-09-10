import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products-service';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

type Category = { id: string; title: string; description: string; image: string };

// Ajusta tus assets/rutas reales
const CATEGORIES: Category[] = [
  { id: 'mascotas', title: 'Mascotas', description: 'Todo para tu mejor amigo.', image: 'assets/images/categorias/mascotas.png' },
  
];




@Component({
  selector: 'app-category-page',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css'
})
export class CategoryPage {

  category?: Category;
  loading: boolean = false;
  skeletons = Array.from({ length: 8 });
  products: Product[] = [];
  search = '';
  
  private search$ = new Subject<string>();

  constructor(private route: ActivatedRoute, private router: Router, private productsService: ProductsService) {}

  ngOnInit(): void {
    console.log('CategoryPage initialized');
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.category = CATEGORIES.find(c => c.id === id);
    if (!this.category) {
      this.router.navigateByUrl('/categories');
      return;
    }
    this.getProducts();
    this.search$
          .pipe(debounceTime(400), distinctUntilChanged())
          .subscribe((q) => {
            this.products = [];
            this.skeletons = Array.from({ length: 8 });
            this.getProducts();
          });
  }
  onSearch(q: string) {
    this.search$.next(q ?? '');
  }

  getProducts() {
    if (!this.category) return;
    this.loading = true;
    this.productsService.getProductosByCategory(this.category.id, this.search)
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
