import { TestBed } from '@angular/core/testing';

import { LoaderService } from './loader.service';

describe('LoaderngService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
