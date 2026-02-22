import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterCreateModalComponent } from './admin-master-create-modal.component';

describe('AdminMasterCreateModalComponent', () => {
  let component: AdminMasterCreateModalComponent;
  let fixture: ComponentFixture<AdminMasterCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMasterCreateModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
