import { TestBed } from '@angular/core/testing';

import { AdminRoleManagementService } from './admin-role-management.service';

describe('AdminRoleManagementService', () => {
  let service: AdminRoleManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRoleManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
