import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMiembroComponent } from './lista-miembro.component';

describe('ListaMiembroComponent', () => {
  let component: ListaMiembroComponent;
  let fixture: ComponentFixture<ListaMiembroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaMiembroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
