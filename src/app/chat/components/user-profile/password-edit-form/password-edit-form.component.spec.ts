import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordEditFormComponent } from './password-edit-form.component';

describe('PasswordEditFormComponent', () => {
  let component: PasswordEditFormComponent;
  let fixture: ComponentFixture<PasswordEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
