import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesBarComponent } from './series-bar.component';

describe('SeriesBarComponent', () => {
  let component: SeriesBarComponent;
  let fixture: ComponentFixture<SeriesBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeriesBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
