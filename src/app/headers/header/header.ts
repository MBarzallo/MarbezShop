import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../shared/services/cart/car-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, AsyncPipe],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  user$: typeof this.auth.user$;
  count$: import('rxjs').Observable<number>;
  

  constructor(private auth: AuthService, private router: Router, public cart: CartService) {
    this.user$ = this.auth.user$;
    
    this.count$ = this.cart.items$.pipe(
    map(items => items.reduce((sum, it) => sum + it.qty, 0))
  );
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/');
  }
  abrirWhatsApp() {
    const url = `https://wa.me/593999762586?text=%C2%A1Hola!%20%F0%9F%91%8B%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20productos%20de%20Marbez%20Shop.%20%C2%BFPodr%C3%ADan%20darme%20m%C3%A1s%20informaci%C3%B3n%3F`;
    window.open(url, '_blank');
  }
}
