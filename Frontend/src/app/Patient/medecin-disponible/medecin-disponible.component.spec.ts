import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinDisponibleComponent } from './medecin-disponible.component';

describe('MedecinDisponibleComponent', () => {
  let component: MedecinDisponibleComponent;
  let fixture: ComponentFixture<MedecinDisponibleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedecinDisponibleComponent]
    });
    fixture = TestBed.createComponent(MedecinDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
