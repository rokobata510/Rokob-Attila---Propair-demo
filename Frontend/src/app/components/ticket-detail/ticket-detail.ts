import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: any = null;
  isLoading = true;
  errorMessage: string | null = null;
  statusForm = new FormControl('', Validators.required);
  commentForm = new FormControl('', Validators.required);
  statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];
  isUpdatingStatus = false;
  isAddingComment = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(id);
    } else {
      this.errorMessage = 'Invalid ticket ID';
      this.isLoading = false;
    }
  }

  loadTicket(id: string) {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.ticketService.getTicket(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.statusForm.setValue(ticket.status);
        
        this.ticketService.getComments(id).subscribe({
          next: (comments) => {
            this.ticket.comments = comments;
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to load comments. ' + (err.error?.message || 'Please try again.');
            console.error('Comments load error:', err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load ticket. Please try again.';
        console.error('Ticket load error:', err);
      }
    });
  }

  updateStatus() {
    if (this.statusForm.invalid || !this.ticket) return;
    
    this.isUpdatingStatus = true;
    this.errorMessage = null;
    
    if (this.statusForm.value === this.ticket.status) {
      this.isUpdatingStatus = false;
      return;
    }
    if (this.statusForm.value == null) {
      this.errorMessage = 'Please select a status.';
      this.isUpdatingStatus = false;
      return;
    }

    this.ticketService.updateStatus(this.ticket._id, this.statusForm.value)
      .subscribe({
        next: () => {
          this.ticket.status = this.statusForm.value;
          this.isUpdatingStatus = false;
        },
        error: (err) => {
          this.isUpdatingStatus = false;
          this.errorMessage = err.error?.message || 'Failed to update status. Please try again.';
        }
      });
  }

  addComment() {
    if (this.commentForm.invalid || !this.ticket) return;
    
    this.isAddingComment = true;
    this.errorMessage = null;
    const commentText = this.commentForm.value?.trim() || '';

    if (!commentText) {
      this.errorMessage = 'Comment cannot be empty.';
      this.isAddingComment = false;
      return;
    }

    this.ticketService.addComment(this.ticket._id, commentText)
      .subscribe({
        next: (comment) => {
          if (!this.ticket.comments) {
            this.ticket.comments = [];
          }
          this.ticket.comments.push(comment);
          this.commentForm.reset();
          this.isAddingComment = false;
        },
        error: (err) => {
          this.isAddingComment = false;
          this.errorMessage = err.error?.message || 'Failed to add comment. Please try again.';
        }
      });
  }

  deleteTicket() {
    if (!this.ticket || !confirm('Are you sure you want to delete this ticket?')) return;
    
    this.ticketService.deleteTicket(this.ticket._id)
      .subscribe({
        next: () => {
          this.router.navigate(['/tickets']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete ticket.';
        }
      });
  }

  navigateToTicketList() {
    this.router.navigate(['/tickets']);
  }
}