import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionMatrixComponent } from './admin-permission-matrix.component';

describe('AdminPermissionMatrixComponent', () => {
  let component: AdminPermissionMatrixComponent;
  let fixture: ComponentFixture<AdminPermissionMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPermissionMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPermissionMatrixComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
