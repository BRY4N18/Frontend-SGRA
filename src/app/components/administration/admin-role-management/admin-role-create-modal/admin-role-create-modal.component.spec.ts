import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleCreateModalComponent } from './admin-role-create-modal.component';

describe('AdminRoleCreateModalComponent', () => {
  let component: AdminRoleCreateModalComponent;
  let fixture: ComponentFixture<AdminRoleCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoleCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoleCreateModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
