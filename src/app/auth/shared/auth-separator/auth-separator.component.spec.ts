import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSeparatorComponent } from './auth-separator.component';

describe('AuthSeparatorComponent', () => {
  let component: AuthSeparatorComponent;
  let fixture: ComponentFixture<AuthSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSeparatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
