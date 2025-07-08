import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css'] 
})
export class TicketListComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
  updatingStatus: { [key: string]: boolean } = {}; 
  updateErrors: { [key: string]: string } = {}; 

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load tickets. Please try again.';
        
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateStatus(ticketId: string, newStatus: string): void {
    this.updatingStatus[ticketId] = true;
    this.updateErrors[ticketId] = '';
    
    this.ticketService.updateStatus(ticketId, newStatus).subscribe({
      next: () => {
        const ticket = this.tickets.find(t => t._id === ticketId);
        if (ticket) {
          ticket.status = newStatus;
        }
        this.updatingStatus[ticketId] = false;
      },
      error: (err) => {
        this.updatingStatus[ticketId] = false;
        this.updateErrors[ticketId] = err.error?.message || 'Failed to update status. Please try again.';
      }
    });
  }

  deleteTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    
    this.ticketService.deleteTicket(ticketId).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(ticket => ticket._id !== ticketId);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete ticket.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}