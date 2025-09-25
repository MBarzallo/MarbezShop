import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from "./layouts/main-layout/main-layout";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MarbezShop';
    // fecha límite del landing
  private deadline = new Date('2025-10-05T20:30:00');

  // true si estamos antes de la fecha → mostrar landing
  get isLandingActive(): boolean {
    return false;
  }
}
