import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasivoComponent } from './masivo.component';

describe('MasivoComponent', () => {
  let component: MasivoComponent;
  let fixture: ComponentFixture<MasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
