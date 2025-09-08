import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperHero } from './swiper-hero';

describe('SwiperHero', () => {
  let component: SwiperHero;
  let fixture: ComponentFixture<SwiperHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperHero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
