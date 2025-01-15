import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousaccepteeComponent } from './rendezvousacceptee.component';

describe('RendezvousaccepteeComponent', () => {
  let component: RendezvousaccepteeComponent;
  let fixture: ComponentFixture<RendezvousaccepteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RendezvousaccepteeComponent]
    });
    fixture = TestBed.createComponent(RendezvousaccepteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
