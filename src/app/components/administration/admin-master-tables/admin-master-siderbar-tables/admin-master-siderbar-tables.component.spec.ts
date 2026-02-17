import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterSiderbarTablesComponent } from './admin-master-siderbar-tables.component';

describe('AdminMasterSiderbarTablesComponent', () => {
  let component: AdminMasterSiderbarTablesComponent;
  let fixture: ComponentFixture<AdminMasterSiderbarTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterSiderbarTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMasterSiderbarTablesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
