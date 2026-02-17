import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionKpisComponent } from './admin-permission-kpis.component';

describe('AdminPermissionKpisComponent', () => {
  let component: AdminPermissionKpisComponent;
  let fixture: ComponentFixture<AdminPermissionKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPermissionKpisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPermissionKpisComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
