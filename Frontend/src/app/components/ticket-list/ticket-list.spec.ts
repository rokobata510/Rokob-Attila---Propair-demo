<div class="header">
  <h1>Ticket List</h1>
  <div>
    <button routerLink="/tickets/create" class="btn create-btn">Create New Ticket</button>
    <button (click)="logout()" class="btn logout-btn">Logout</button>
  </div>
</div>

<div *ngIf="isLoading" class="loading">
  Loading tickets...
</div>

<div *ngIf="errorMessage" class="error">
  {{ errorMessage }}
</div>

<table *ngIf="!isLoading && tickets.length > 0">
  <thead>
    <tr>
      <th>Title</th>
      <th>Status</th>
      <th>Description</th>
      <th>Created At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let ticket of tickets">
      <td>{{ ticket.title }}</td>
      <td>
        <span class="status-badge" [ngClass]="getStatusClass(ticket.status)">
          {{ ticket.status }}
        </span>
      </td>
      <td class="description">{{ ticket.description | truncate:50 }}</td>
      <td>{{ ticket.createdAt | date:'medium' }}</td>
      <td class="actions">
        <button [routerLink]="['/tickets', ticket._id]" class="btn view-btn">View</button>
        <button (click)="deleteTicket(ticket._id)" class="btn delete-btn">Delete</button>
      </td>
    </tr>
  </tbody>
</table>

<div *ngIf="!isLoading && tickets.length === 0" class="no-tickets">
  No tickets found. <a routerLink="/tickets/create">Create your first ticket</a>
</div>