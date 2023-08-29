/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AllFaqService } from './all-faq.service';

describe('Service: AllFaq', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllFaqService]
    });
  });

  it('should ...', inject([AllFaqService], (service: AllFaqService) => {
    expect(service).toBeTruthy();
  }));
});
