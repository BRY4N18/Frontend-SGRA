import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordPhysicalspacesComponent } from './coord-physicalspaces.component';

describe('CoordPhysicalspacesComponent', () => {
  let component: CoordPhysicalspacesComponent;
  let fixture: ComponentFixture<CoordPhysicalspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordPhysicalspacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordPhysicalspacesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
