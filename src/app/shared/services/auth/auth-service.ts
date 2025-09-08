import { Injectable } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, map } from 'rxjs';
import { Supabase } from '../supabase/supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session$ = new BehaviorSubject<Session | null>(null);

  /** Observables públicos */
  readonly session$ = this._session$.asObservable();
  readonly user$ = this.session$.pipe(map(s => s?.user ?? null));
  /** Síncronos */
  get session(): Session | null { return this._session$.value; }
  get user(): User | null { return this._session$.value?.user ?? null; }

  constructor(private sb: Supabase) {
    // Cargar sesión al iniciar y escuchar cambios
    this.sb.supabase.auth.getSession().then(({ data }) => this._session$.next(data.session ?? null));
    this.sb.supabase.auth.onAuthStateChange((_event, session) => this._session$.next(session ?? null));
  }

  // ---------- Sign in ----------
  signInWithPassword(email: string, password: string) {
    return this.sb.supabase.auth.signInWithPassword({ email, password });
  }

  // Magic link (OTP)
  signInWithOtp(email: string, redirectTo?: string) {
    return this.sb.supabase.auth.signInWithOtp({
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });
  }

  // OAuth (Google, GitHub, etc.)
  signInWithOAuth(provider: 'google' | 'github' | 'azure' | 'facebook', redirectTo?: string) {
    return this.sb.supabase.auth.signInWithOAuth({
      provider,
      options: redirectTo ? { redirectTo } : undefined,
    });
  }

  // ---------- Sign up ----------
  signUpWithPassword(email: string, password: string, profile?: { nombre?: string; direccion?: string; telefono?: string }) {
    return this.sb.supabase.auth.signUp({
      email,
      password,
      options: {
        data: profile, 
      },
    });
  }

  // Reset de contraseña por email
  resetPasswordForEmail(email: string, redirectTo: string) {
    // redirectTo debe apuntar a una ruta de tu app donde pedirás la nueva password
    return this.sb.supabase.auth.resetPasswordForEmail(email, { redirectTo });
  }

  // Al volver del link de reset, actualiza la contraseña
  updatePassword(newPassword: string) {
    return this.sb.supabase.auth.updateUser({ password: newPassword });
  }

  // Cerrar sesión
  signOut() {
    return this.sb.supabase.auth.signOut();
  }
}
