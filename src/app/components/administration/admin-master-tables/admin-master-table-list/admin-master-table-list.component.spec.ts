import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterTableListComponent } from './admin-master-table-list.component';

describe('AdminMasterTableListComponent', () => {
  let component: AdminMasterTableListComponent;
  let fixture: ComponentFixture<AdminMasterTableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterTableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMasterTableListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
