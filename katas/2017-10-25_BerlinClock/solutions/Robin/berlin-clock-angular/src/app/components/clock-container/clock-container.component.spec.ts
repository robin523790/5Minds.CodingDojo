import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockContainerComponent } from '@src/app/components/clock-container/clock-container.component';

describe('ClockContainerComponent', () => {
  let component: ClockContainerComponent;
  let fixture: ComponentFixture<ClockContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
