import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';

export interface Review {
  id: number;
  product_id: string; // uuid (o string con tu tipo)
  rating: number; // 1..5
  comment?: string | null;
  usuario_email?: string | null;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private sb: Supabase) {}

  async addReview(
    productId: string,
    rating: number,
    comment: string
  ): Promise<'inserted' | 'updated'> {
    rating = Math.max(1, Math.min(5, Math.round(rating)));

    const { id: user_id, email: usuario_email } = await this.getCurrentUser();
    const ip = await this.getClientIp();

    const row = {
      product_id: productId,
      rating,
      comment: comment?.trim() || null,
      user_id,
      usuario_email,
      ip,
    };
    console.log('si llega qui');
    // 1) Si está autenticado: UPSERT por (product_id, user_id)
    if (user_id) {
      console.log(row);
      const { error } = await this.sb.supabase
        .from('reviews')
        .upsert(row, { onConflict: 'product_id,user_id' }); // actualiza si ya existe

      if (error) throw error;
      return 'updated'; // puede haber insert o update; tratamos como actualizado
    }

    // 2) Anónimo: intentamos INSERT; si choca con el índice único (23505), hacemos UPDATE por (product_id, ip, user_id null)
    const { error } = await this.sb.supabase.from('reviews').insert([row]);

    if (!error) return 'inserted';

    // Duplicado: violación de unique (product_id, ip) para anónimos

    if ((error as any).code === '23505') {
        console.log("productoId:");
      console.log(productId);
      console.log("ip:");
        console.log(ip);
        console.log("comment")
        console.log(row.comment);
      const { error: updErr } = await this.sb.supabase
        .from('reviews')
        .update({ rating, comment: row.comment })
        .eq('product_id', productId)
        .eq('ip', ip)
        .is('user_id', null); // <-- clave

      if (updErr) throw updErr;
      return 'updated';
    }

    // Otro error
    throw error;
  }

  async listReviews(
    productId: string,
    page = 0,
    limit = 20
  ): Promise<Review[]> {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await this.sb.supabase
      .from('reviews')
      .select('id, product_id, rating, comment, usuario_email, created_at')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data ?? []) as Review[];
  }

  async getStats(productId: string) {
    const { data, error } = await this.sb.supabase.rpc('reviews_stats', {
      p_product: productId,
    });
    if (error) throw error;
    return (
      data?.[0] ?? {
        avg_rating: null,
        total_reviews: 0,
        stars_1: 0,
        stars_2: 0,
        stars_3: 0,
        stars_4: 0,
        stars_5: 0,
      }
    );
  }

  // Helpers
  private async getCurrentUser(): Promise<{
    id: string | null;
    email: string | null;
  }> {
    try {
      const { data } = await this.sb.supabase.auth.getUser();
      return { id: data?.user?.id ?? null, email: data?.user?.email ?? null };
    } catch {
      return { id: null, email: null };
    }
  }

  private async getClientIp(): Promise<string | null> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (!res.ok) return null;
      const { ip } = await res.json();
      return ip ?? null;
    } catch {
      return null;
    }
  }
}
