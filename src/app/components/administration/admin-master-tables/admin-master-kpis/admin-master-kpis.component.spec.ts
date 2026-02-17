import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterKpisComponent } from './admin-master-kpis.component';

describe('AdminMasterKpisComponent', () => {
  let component: AdminMasterKpisComponent;
  let fixture: ComponentFixture<AdminMasterKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMasterKpisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMasterKpisComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
