import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit, OnDestroy {
  targetDate = new Date('2025-10-05T20:30:00').getTime();

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  private intervalId: any;

  ngOnInit() {
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const diff = this.targetDate - now;

    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }
  isModalOpen = false;
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required]
    });
    if (localStorage.getItem('ea_submitted') === 'yes') {
      this.submitted = true;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async submitForm() {
    if (this.form.invalid) return;

    if(this.submitted) {
      alert('Ya estás registrado. ¡Gracias!');
      return;
    }

    this.loading = true;

    const data = {
      correo: this.form.value.correo,
      nombres: this.form.value.nombres,
      apellidos: this.form.value.apellidos,
      date: new Date().toISOString()
    };

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbzBP8jBV7V2v2elzV_4O3uggl5z-sxoUsXUCHJVJ06xGa_yi-WlcNx9X9aVGnDv69Oadw/exec',
        {
          method: 'POST',
          mode: 'no-cors', // 👈 esto evita el bloqueo por CORS
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );

      // Como no podemos leer la respuesta, asumimos éxito
      this.submitted = true;
      localStorage.setItem('ea_submitted', 'yes');
    } catch (err) {
      alert('Error al enviar. Inténtalo de nuevo.');
    } finally {
      this.loading = false;
    }
  }
}
