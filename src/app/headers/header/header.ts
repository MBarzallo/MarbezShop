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
}
