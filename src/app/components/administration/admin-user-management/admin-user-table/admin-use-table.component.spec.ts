import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUseTableComponent } from './admin-use-table.component';

describe('AdminUseTableComponent', () => {
  let component: AdminUseTableComponent;
  let fixture: ComponentFixture<AdminUseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUseTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUseTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
