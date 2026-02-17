import { TestBed } from '@angular/core/testing';

import { AdminMasterTablesService } from './admin-master-tables.service';

describe('AdminMasterTablesService', () => {
  let service: AdminMasterTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMasterTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
