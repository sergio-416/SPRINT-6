import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsForm } from './products-form';
import { Budget } from '../../services/budget';

describe('ProductsForm', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;
  let budgetService: Budget;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
    budgetService = TestBed.inject(Budget);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all checkboxes unchecked', () => {
    const formValue = component.quoteModel();
    expect(formValue.seoSelected).toBe(false);
    expect(formValue.adsSelected).toBe(false);
    expect(formValue.webConfig.selected).toBe(false);
  });

  it('should initialize website config with default values', () => {
    const formValue = component.quoteModel();
    expect(formValue.webConfig.pages).toBe(1);
    expect(formValue.webConfig.languages).toBe(1);
  });

  it('should calculate total as 0 when no services are selected', () => {
    expect(component.totalPrice()).toBe(0);
  });

  it('should calculate total as 300 when only SEO is selected', () => {
    component.quoteForm.seoSelected().value.set(true);
    expect(component.totalPrice()).toBe(300);
  });

  it('should calculate total as 400 when only Ads is selected', () => {
    component.quoteForm.adsSelected().value.set(true);
    expect(component.totalPrice()).toBe(400);
  });

  it('should calculate total as 530 when Web is selected with default configuration', () => {
    component.quoteForm.webConfig.selected().value.set(true);
    expect(component.totalPrice()).toBe(530);
  });

  it('should calculate total as 800 when Web is selected with 5 pages and 2 languages', () => {
    component.quoteForm.webConfig.selected().value.set(true);
    component.quoteForm.webConfig.pages().value.set(5);
    component.quoteForm.webConfig.languages().value.set(2);
    expect(component.totalPrice()).toBe(800);
  });

  it('should calculate total as 1230 when all services are selected with default configuration', () => {
    component.quoteForm.seoSelected().value.set(true);
    component.quoteForm.adsSelected().value.set(true);
    component.quoteForm.webConfig.selected().value.set(true);
    expect(component.totalPrice()).toBe(1230);
  });

  it('should render three service checkboxes', () => {
    const compiled = fixture.nativeElement;
    const checkboxes = compiled.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);
  });

  it('should display the calculated total price', () => {
    component.quoteForm.seoSelected().value.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const totalElement = compiled.querySelector('[data-testid="total-price"]');
    expect(totalElement.textContent).toContain('300');
  });

  it('should update submission status when form is submitted', () => {
    expect(component.submissionStatus()).toBe('idle');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.submissionStatus()).toBe('submitted');
  });

  it('should not show panel when website is not selected', () => {
    const compiled = fixture.nativeElement;
    const panel = compiled.querySelector('app-website-panel');
    expect(panel).toBeNull();
  });

  it('should show panel when website is selected', () => {
    component.quoteForm.webConfig.selected().value.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const panel = compiled.querySelector('app-website-panel');
    expect(panel).not.toBeNull();
  });
});
