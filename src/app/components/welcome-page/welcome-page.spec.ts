import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { WelcomePage } from './welcome-page';
import { ProductsForm } from '../products-form/products-form';

describe('WelcomePage', () => {
  let component: WelcomePage;
  let fixture: ComponentFixture<WelcomePage>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomePage],
      providers: [
        provideRouter([
          { path: '', component: WelcomePage },
          { path: 'budget', component: ProductsForm },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(WelcomePage);
    component = fixture.componentInstance;

    await fixture.ngZone?.run(() => router.navigate(['/']));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome heading', () => {
    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('[data-testid="welcome-heading"]');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Welcome');
  });

  it('should render description text', () => {
    const compiled = fixture.nativeElement;
    const description = compiled.querySelector('[data-testid="welcome-description"]');
    expect(description).not.toBeNull();
  });

  it('should render navigation button', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should navigate to budget page when button is clicked', async () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(location.path()).toBe('/budget');
  });

  it('should have accessible button text', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]');
    expect(button.textContent.trim().length).toBeGreaterThan(0);
  });
});
