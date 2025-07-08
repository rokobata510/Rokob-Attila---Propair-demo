import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-create.html',
})
export class TicketCreateComponent {
  ticketForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  isSuggesting = false; 
  suggestionError: string | null = null; 
  statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      status: ['Open', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSuggestTitle() {
    const description = this.ticketForm.get('description')?.value;
    if (!description || description.length < 10) {
      this.suggestionError = 'Please enter at least 10 characters to get a title suggestion';
      return;
    }

    this.isSuggesting = true;
    this.suggestionError = null;
    
    this.ticketService.suggestTitle(description).subscribe({
      next: (res) => {
        this.ticketForm.patchValue({ title: res.title });
        this.isSuggesting = false;
      },
      error: (err) => {
        this.isSuggesting = false;
        this.suggestionError = err.error?.message || 'Failed to get title suggestion. Please try again.';
      }
    });
  }

  onSubmit() {
    if (this.ticketForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const ticketData = {
      title: this.ticketForm.value.title,
      status: this.ticketForm.value.status,
      description: this.ticketForm.value.description
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tickets']);
      },
      error: (err: { error: { message: string; }; }) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create ticket. Please try again.';
        console.error('Ticket creation error:', err);
      }
    });
  }
}