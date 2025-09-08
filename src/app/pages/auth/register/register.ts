import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  msg = '';
  loading = false;

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form= this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre: [''],
    telefono: [''],
    direccion: [''],
  });
  }

  async signUp() {
    if (this.form.invalid) return;
    this.loading = true; this.msg = '';
    const { email, password, nombre, telefono, direccion } = this.form.value;
    try {
      const { error } = await this.auth.signUpWithPassword(email!, password!, { nombre: nombre ?? '', telefono: telefono ?? '', direccion: direccion ?? '' });
      if (error) throw error;
      this.msg = 'Revisa tu correo para confirmar tu cuenta.';
    } catch (e: any) {
      this.msg = e.message ?? 'Error al registrarte';
    } finally {
      this.loading = false;
    }
  }
}
