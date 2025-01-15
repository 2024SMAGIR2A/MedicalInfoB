import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousrejeteeComponent } from './rendezvousrejetee.component';

describe('RendezvousrejeteeComponent', () => {
  let component: RendezvousrejeteeComponent;
  let fixture: ComponentFixture<RendezvousrejeteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RendezvousrejeteeComponent]
    });
    fixture = TestBed.createComponent(RendezvousrejeteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
