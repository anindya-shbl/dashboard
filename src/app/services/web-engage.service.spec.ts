import { TestBed } from '@angular/core/testing';

import { WebEngageService } from './web-engage.service';

describe('WebEngageService', () => {
  let service: WebEngageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebEngageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
