import { TestBed } from '@angular/core/testing';

import { MedecinDisponbleService } from './medecin-disponble.service';

describe('MedecinDisponbleService', () => {
  let service: MedecinDisponbleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedecinDisponbleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
