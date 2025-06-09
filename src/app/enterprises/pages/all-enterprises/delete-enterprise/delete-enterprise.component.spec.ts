import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEnterpriseComponent } from './delete-enterprise.component';

describe('DeleteEnterpriseComponent', () => {
  let component: DeleteEnterpriseComponent;
  let fixture: ComponentFixture<DeleteEnterpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteEnterpriseComponent]
    });
    fixture = TestBed.createComponent(DeleteEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
