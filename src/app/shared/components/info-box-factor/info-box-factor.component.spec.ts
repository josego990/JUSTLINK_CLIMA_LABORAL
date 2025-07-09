import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBoxFactorComponent } from './info-box-factor.component';

describe('InfoBoxFactorComponent', () => {
  let component: InfoBoxFactorComponent;
  let fixture: ComponentFixture<InfoBoxFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBoxFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBoxFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
