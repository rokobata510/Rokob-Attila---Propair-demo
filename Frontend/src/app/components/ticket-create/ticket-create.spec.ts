import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCreateComponent } from './ticket-create';

describe('TicketCreate', () => {
  let component: TicketCreateComponent;
  let fixture: ComponentFixture<TicketCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
