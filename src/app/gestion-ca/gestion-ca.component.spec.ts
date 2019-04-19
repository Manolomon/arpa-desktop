import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCaComponent } from './gestion-ca.component';

describe('GestionCaComponent', () => {
  let component: GestionCaComponent;
  let fixture: ComponentFixture<GestionCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
