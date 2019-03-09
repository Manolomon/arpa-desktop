import { TestBed } from '@angular/core/testing';

import { MiembroService } from './miembro.service';

describe('MiembroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiembroService = TestBed.get(MiembroService);
    expect(service).toBeTruthy();
  });
});
