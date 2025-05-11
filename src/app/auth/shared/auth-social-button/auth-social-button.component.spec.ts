import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSocialButtonComponent } from './auth-social-button.component';

describe('AuthSocialButtonComponent', () => {
  let component: AuthSocialButtonComponent;
  let fixture: ComponentFixture<AuthSocialButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSocialButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSocialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
