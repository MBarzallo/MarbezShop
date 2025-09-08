import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ventajas } from './ventajas';

describe('Ventajas', () => {
  let component: Ventajas;
  let fixture: ComponentFixture<Ventajas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ventajas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ventajas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
