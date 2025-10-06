import { Component } from '@angular/core';
import { Header } from '../../headers/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuggestionService } from '../../shared/services/suggestion/suggestion-service';

@Component({
  selector: 'app-main-layout',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  constructor(private suggestionService: SuggestionService) {}

  mostrarModal = false;
  sugerencia = '';
  errorMessage = '';
  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  async enviarSugerencia() {
    const texto = this.sugerencia.trim();
    if (!texto) {
      this.errorMessage = 'Por favor escribe una sugerencia.';
      return;
    }

    try{
      await this.suggestionService.createSuggestion(texto);
      this.sugerencia = '';
      this.errorMessage = '';
      this.cerrarModal();
      alert('¡Gracias por tu sugerencia!');
    } catch (error) {
      console.error('Error al enviar sugerencia:', error);
      this.errorMessage = 'Hubo un error al enviar tu sugerencia. Intenta nuevamente.';
    }
  }
}
