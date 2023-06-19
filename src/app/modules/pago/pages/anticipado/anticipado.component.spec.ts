import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipadoComponent } from './anticipado.component';

describe('AnticipadoComponent', () => {
  let component: AnticipadoComponent;
  let fixture: ComponentFixture<AnticipadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnticipadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnticipadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
