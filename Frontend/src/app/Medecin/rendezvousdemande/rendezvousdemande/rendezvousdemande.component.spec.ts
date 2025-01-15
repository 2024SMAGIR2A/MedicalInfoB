import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousdemandeComponent } from './rendezvousdemande.component';

describe('RendezvousdemandeComponent', () => {
  let component: RendezvousdemandeComponent;
  let fixture: ComponentFixture<RendezvousdemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RendezvousdemandeComponent]
    });
    fixture = TestBed.createComponent(RendezvousdemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
