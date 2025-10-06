import { Component, Input, OnInit } from '@angular/core';
import {
  Review,
  ReviewsService,
} from '../../shared/services/review/review-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  @Input() productId!: string;

  rating = 5;
  comment = '';
  reviews: (Review & { verified?: boolean })[] = [];
  stats: any;
  loading = false;

  constructor(private reviewsSvc: ReviewsService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    try {
      [this.reviews, this.stats] = await Promise.all([
        this.reviewsSvc.listReviews(this.productId, 0, 20),
        this.reviewsSvc.getStats(this.productId),
      ]);
    } finally {
      this.loading = false;
    }
  }

  setRating(v: number) {
    this.rating = v;
  }

  async submit() {
    try {
      const result = await this.reviewsSvc.addReview(
        this.productId,
        this.rating,
        this.comment
      );
      this.comment = '';
      await this.load();

      alert( 
        result === 'updated'
          ? 'Actualizamos tu reseña anterior para este producto. ¡Gracias!'
          : '¡Gracias por tu reseña!'
      );
    } catch (e: any) {
      alert(e?.message ?? 'No se pudo enviar la reseña.');
    }
  }

  get avgRounded(): string {
    const a = Number(this.stats?.avg_rating ?? 0);
    return a ? a.toFixed(1) : '–';
  }

  starPercent(star: number): number {
    const total = Number(this.stats?.total_reviews ?? 0);
    if (!total) return 0;

    const key = `stars_${star}` as
      | 'stars_1'
      | 'stars_2'
      | 'stars_3'
      | 'stars_4'
      | 'stars_5';
    const count = Number(this.stats?.[key] ?? 0);

    return Math.round((count / total) * 100);
  }

  initials(email?: string | null): string {
    if (!email) return 'A';
    const name = email.split('@')[0] || '';
    const parts = name
      .replace(/[\W_]+/g, ' ')
      .trim()
      .split(' ');
    const first = (parts[0]?.[0] || 'A').toUpperCase();
    const second = (parts[1]?.[0] || '').toUpperCase();
    return first + second || 'A';
  }

  trackById(_: number, r: Review) {
    return r.id;
  }
}
