import { TestBed } from '@angular/core/testing';

import { AdminDashboardService } from './admin-dashboard.service';

describe('AdminDashboard', () => {
  let service: AdminDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
