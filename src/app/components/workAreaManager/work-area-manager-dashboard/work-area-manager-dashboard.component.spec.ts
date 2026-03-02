import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAreaManagerDashboardComponent } from './work-area-manager-dashboard.component';

describe('WorkAreaManagerDashboardComponent', () => {
  let component: WorkAreaManagerDashboardComponent;
  let fixture: ComponentFixture<WorkAreaManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkAreaManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAreaManagerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
