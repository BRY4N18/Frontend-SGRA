import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserCreateModalComponent } from './admin-user-create-modal.component';

describe('AdminUserCreateModalComponent', () => {
  let component: AdminUserCreateModalComponent;
  let fixture: ComponentFixture<AdminUserCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserCreateModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
