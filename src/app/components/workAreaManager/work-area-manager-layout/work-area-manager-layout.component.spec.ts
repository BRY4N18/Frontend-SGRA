import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAreaManagerLayoutComponent } from './work-area-manager-layout.component';

describe('WorkAreaManagerLayoutComponent', () => {
  let component: WorkAreaManagerLayoutComponent;
  let fixture: ComponentFixture<WorkAreaManagerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkAreaManagerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAreaManagerLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
