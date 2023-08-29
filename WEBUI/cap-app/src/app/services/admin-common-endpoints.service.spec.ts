/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminCommonEndpointsService } from './admin-common-endpoints.service';

describe('Service: AdminCommonEndpoints', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminCommonEndpointsService]
    });
  });

  it('should ...', inject([AdminCommonEndpointsService], (service: AdminCommonEndpointsService) => {
    expect(service).toBeTruthy();
  }));
});
