import { TestBed } from '@angular/core/testing';

import { BornesService } from './bornes.service';

describe('BornesService', () => {
  let service: BornesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BornesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
