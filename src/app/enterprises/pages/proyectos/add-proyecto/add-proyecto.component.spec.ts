import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProyectoComponent } from './add-proyecto.component';

describe('AddProyectoComponent', () => {
  let component: AddProyectoComponent;
  let fixture: ComponentFixture<AddProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProyectoComponent]
    });
    fixture = TestBed.createComponent(AddProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
