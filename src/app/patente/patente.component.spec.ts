import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatenteComponent } from './patente.component';

describe('PatenteComponent', () => {
  let component: PatenteComponent;
  let fixture: ComponentFixture<PatenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
