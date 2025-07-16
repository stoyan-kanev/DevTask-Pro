import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';


interface AuthTokens {
  access: string;
  refresh: string;
}


interface User {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  private saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }


  getCurrentUser(): Observable<{ id: number; email: string; }> {
    return this.http.get<{ id: number; email: string; }>(`${this.apiUrl}/user/me`);
  }



  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post(`${this.apiUrl}/user/login`, { email, password }, { withCredentials: true }).pipe(
      switchMap(() => this.getCurrentUser()),
      map(user => this.saveUser(user))
    );
  }

  register(email: string, username: string, password: string): Observable<void> {
    return this.http.post(`${this.apiUrl}/user/register`, { email, username, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      switchMap(() => this.getCurrentUser()),
      map(user => this.saveUser(user))
    );
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ access: string }>(
      `${this.apiUrl}/user/refresh`,
      {},
      { withCredentials: true } // важно!
    ).pipe(
      switchMap(response => {
        const user = this.getUser();
        if (!user) {
          return throwError(() => new Error('No user data available'));
        }

        // само access се връща, не записваш нищо в localStorage
        return of(response.access);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }
  logout(): void {
    localStorage.removeItem('user');
    this.http.post(`${this.apiUrl}/user/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => window.location.href = '/login'
    });
  }

}
