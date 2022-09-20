import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedViewComponent } from './speed-view.component';

describe('SpeedViewComponent', () => {
  let component: SpeedViewComponent;
  let fixture: ComponentFixture<SpeedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
