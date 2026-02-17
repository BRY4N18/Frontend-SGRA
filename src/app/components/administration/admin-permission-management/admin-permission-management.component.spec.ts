import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionManagementComponent } from './admin-permission-management.component';

describe('AdminPermissionManagementComponent', () => {
  let component: AdminPermissionManagementComponent;
  let fixture: ComponentFixture<AdminPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPermissionManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPermissionManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
