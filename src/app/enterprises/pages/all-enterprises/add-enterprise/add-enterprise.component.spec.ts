import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnterpriseComponent } from './add-enterprise.component';

describe('AddEnterpriseComponent', () => {
  let component: AddEnterpriseComponent;
  let fixture: ComponentFixture<AddEnterpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEnterpriseComponent]
    });
    fixture = TestBed.createComponent(AddEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
