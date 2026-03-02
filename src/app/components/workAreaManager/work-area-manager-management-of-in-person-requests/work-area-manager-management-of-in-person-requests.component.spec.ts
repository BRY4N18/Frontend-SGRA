import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAreaManagerManagementOfInPersonRequestsComponent } from './work-area-manager-management-of-in-person-requests.component';

describe('WorkAreaManagerManagementOfInPersonRequestsComponent', () => {
  let component: WorkAreaManagerManagementOfInPersonRequestsComponent;
  let fixture: ComponentFixture<WorkAreaManagerManagementOfInPersonRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkAreaManagerManagementOfInPersonRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAreaManagerManagementOfInPersonRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
