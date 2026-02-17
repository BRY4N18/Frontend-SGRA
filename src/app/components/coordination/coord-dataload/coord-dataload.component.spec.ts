import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordDataloadComponent } from './coord-dataload.component';

describe('CoordDataloadComponent', () => {
  let component: CoordDataloadComponent;
  let fixture: ComponentFixture<CoordDataloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordDataloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordDataloadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
