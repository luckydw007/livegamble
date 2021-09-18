import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalTimerComponent } from './digital-timer.component';

describe('DigitalTimerComponent', () => {
  let component: DigitalTimerComponent;
  let fixture: ComponentFixture<DigitalTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
