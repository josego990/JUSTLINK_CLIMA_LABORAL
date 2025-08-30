import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorDemographicAccessComponent } from './factordemographicaccess.component';

describe('FactorDemographicAccessComponent', () => {
  let component: FactorDemographicAccessComponent;
  let fixture: ComponentFixture<FactorDemographicAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FactorDemographicAccessComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorDemographicAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
