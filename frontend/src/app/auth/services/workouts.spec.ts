import { TestBed } from '@angular/core/testing';

import { Workouts } from './workouts';

describe('Workouts', () => {
  let service: Workouts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workouts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
