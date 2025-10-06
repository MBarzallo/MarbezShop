import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';
import { Option, Product, ProductoDetallado } from '../../../models/product';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private sb: Supabase) {}

  
  async createSuggestion(texto: string): Promise<void> {
    const usuario_email = await this.getCurrentEmail();   
    const ip = await this.getClientIp();                  

    const { error } = await this.sb.supabase
      .from('sugerencias')
      .insert([{ texto, usuario_email, ip }]);

    if (error) throw error;
  }

  private async getCurrentEmail(): Promise<string | null> {
    try {
      const { data } = await this.sb.supabase.auth.getUser();
      return data?.user?.email ?? null;
    } catch {
      return null;
    }
  }

  private async getClientIp(): Promise<string | null> {
    try {
      // ipify permite CORS y devuelve { ip: "x.x.x.x" }
      const res = await fetch('https://api.ipify.org?format=json');
      if (!res.ok) return null;
      const { ip } = await res.json();
      return ip ?? null;
    } catch {
      return null;
    }
  }

  
}
