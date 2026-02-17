import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserCreateModalComponentComponent } from './admin-user-create-modal.component';

describe('AdminUserCreateModalComponentComponent', () => {
  let component: AdminUserCreateModalComponentComponent;
  let fixture: ComponentFixture<AdminUserCreateModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserCreateModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserCreateModalComponentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
