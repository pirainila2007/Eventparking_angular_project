import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingReview } from './booking-review';

describe('BookingReview', () => {
  let component: BookingReview;
  let fixture: ComponentFixture<BookingReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingReview],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
