import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products-service';
import { Product } from '../../models/product';

type Category = { id: string; title: string; description: string; image: string };

// Ajusta tus assets/rutas reales
const CATEGORIES: Category[] = [
  { id: 'mascotas', title: 'Mascotas', description: 'Todo para tu mejor amigo.', image: 'assets/images/categorias/mascotas.png' },
  
];




@Component({
  selector: 'app-category-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css'
})
export class CategoryPage {

  category?: Category;
  products: Product[] = [];

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
    
  }

  getProducts() {
    if (!this.category) return;
    this.productsService.getProductosByCategory(this.category.id)
      .then(products => {
        this.products = products;
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }
}
