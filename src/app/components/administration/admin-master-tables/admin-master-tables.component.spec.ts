import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterTablesComponent } from './admin-master-tables.component';

describe('AdminMasterTablesComponent', () => {
  let component: AdminMasterTablesComponent;
  let fixture: ComponentFixture<AdminMasterTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMasterTablesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
