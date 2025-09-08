import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  msg = '';
  loading = false;

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    password: ['', []], // opcional si usas magic link
  });
  }

  async signIn() {
    if (this.form.invalid) return;
    this.loading = true; this.msg = '';
    const { email, password } = this.form.value;
    try {
        const { error } = await this.auth.signInWithPassword(email!, password);
        if (error) throw error;
        this.router.navigateByUrl('/');
    } catch (e: any) {
      this.msg = e.message ?? 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  
}
