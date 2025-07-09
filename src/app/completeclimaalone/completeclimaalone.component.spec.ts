import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteclimaaloneComponent } from './completeclimaalone.component';

describe('CompleteclimaaloneComponent', () => {
  let component: CompleteclimaaloneComponent;
  let fixture: ComponentFixture<CompleteclimaaloneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteclimaaloneComponent]
    });
    fixture = TestBed.createComponent(CompleteclimaaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
