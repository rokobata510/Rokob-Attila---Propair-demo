import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private apiUrl = 'http://localhost:5000/tickets';
  private aiUrl = 'http://localhost:5000/ai';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'x-auth-token': token ? token : ''
    });
  }

  suggestTitle(description: string): Observable<{ title: string }> {
    return this.http.post<{ title: string }>(
      `${this.aiUrl}/suggest-title`, 
      { description },
      { headers: this.getAuthHeaders() }
    );
  }

  createTicket(ticket: { title: string; status: string; description: string }): Observable<any> {
    return this.http.post(this.apiUrl, ticket, {
      headers: this.getAuthHeaders()
    });
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getTicket(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getComments(ticketId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${ticketId}/comments`, {
      headers: this.getAuthHeaders()
    });
  }

  updateStatus(ticketId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/status`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ticketId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  addComment(ticketId: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/comments`, { text }, {
      headers: this.getAuthHeaders()
    });
  }
}