import { TestBed } from '@angular/core/testing';

import { AdminPermissionManagement } from './admin-permission-management.service';

describe('AdminPermissionManagement', () => {
  let service: AdminPermissionManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPermissionManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
