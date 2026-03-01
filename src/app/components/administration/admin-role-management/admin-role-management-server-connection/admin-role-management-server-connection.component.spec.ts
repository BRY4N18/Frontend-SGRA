import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleManagementServerConnectionComponent } from './admin-role-management-server-connection.component';

describe('AdminRoleManagementServerConnectionComponent', () => {
  let component: AdminRoleManagementServerConnectionComponent;
  let fixture: ComponentFixture<AdminRoleManagementServerConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoleManagementServerConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoleManagementServerConnectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
