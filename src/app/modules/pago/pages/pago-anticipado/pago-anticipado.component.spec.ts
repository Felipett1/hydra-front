import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAnticipadoComponent } from './pago-anticipado.component';

describe('PagoAnticipadoComponent', () => {
  let component: PagoAnticipadoComponent;
  let fixture: ComponentFixture<PagoAnticipadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoAnticipadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoAnticipadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
