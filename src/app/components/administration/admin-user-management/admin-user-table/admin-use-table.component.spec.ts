import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUseTableComponentComponent } from './admin-use-table.component';

describe('AdminUseTableComponentComponent', () => {
  let component: AdminUseTableComponentComponent;
  let fixture: ComponentFixture<AdminUseTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUseTableComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUseTableComponentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
