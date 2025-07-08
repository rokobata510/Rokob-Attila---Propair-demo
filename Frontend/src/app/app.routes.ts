import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TicketCreateComponent } from './components/ticket-create/ticket-create';
import { TicketListComponent } from './components/ticket-list/ticket-list';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail';

export const routes: Routes = [
  { 
    path: 'tickets/create', 
    component: TicketCreateComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tickets', 
    component: TicketListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tickets/:id',
    component: TicketDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];