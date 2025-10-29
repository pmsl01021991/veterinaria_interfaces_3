import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuenoRegistro } from './dueno-registro';

describe('DuenoRegistro', () => {
  let component: DuenoRegistro;
  let fixture: ComponentFixture<DuenoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuenoRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuenoRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
