// Unit tests for WelcomePage component
// Tests rendering and navigation functionality - references welcome-page.ts
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

  // Sets up test environment with routing configured
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

  // Verifies component instantiates correctly
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Tests heading element renders with expected text
  it('should render welcome heading', () => {
    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('[data-testid="welcome-heading"]');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Welcome');
  });

  // Tests description text renders
  it('should render description text', () => {
    const compiled = fixture.nativeElement;
    const description = compiled.querySelector('[data-testid="welcome-description"]');
    expect(description).not.toBeNull();
  });

  // Tests navigation button renders as button element
  it('should render navigation button', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]');
    expect(button).not.toBeNull();
    expect(button.tagName).toBe('BUTTON');
  });

  // Tests button click triggers navigation to /budget route
  it('should navigate to budget page when button is clicked', async () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(location.path()).toBe('/budget');
  });

  // Tests button has accessible text content
  it('should have accessible button text', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('[data-testid="start-button"]');
    expect(button.textContent.trim().length).toBeGreaterThan(0);
  });
});
