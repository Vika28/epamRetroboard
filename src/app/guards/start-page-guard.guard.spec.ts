import { TestBed } from '@angular/core/testing';

import { StartPageGuardGuard } from './start-page-guard.guard';

describe('StartPageGuardGuard', () => {
  let guard: StartPageGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StartPageGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
