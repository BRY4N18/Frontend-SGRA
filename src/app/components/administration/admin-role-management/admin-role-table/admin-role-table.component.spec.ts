import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleTableComponent } from './admin-role-table.component';

describe('AdminRoleTableComponent', () => {
  let component: AdminRoleTableComponent;
  let fixture: ComponentFixture<AdminRoleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoleTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoleTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
