import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTableFactorComponent } from './progress-table-factor.component';

describe('ProgressTableComponent', () => {
  let component: ProgressTableFactorComponent;
  let fixture: ComponentFixture<ProgressTableFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTableFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTableFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
