/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudentCommonEndpointsService } from './student-common-endpoints.service';

describe('Service: StudentCommonEndpoints', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentCommonEndpointsService]
    });
  });

  it('should ...', inject([StudentCommonEndpointsService], (service: StudentCommonEndpointsService) => {
    expect(service).toBeTruthy();
  }));
});
