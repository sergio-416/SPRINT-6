import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsForm } from './products-form';

describe('ProductsForm', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all checkboxes unchecked', () => {
    const formValue = component.quoteModel();
    expect(formValue.seoSelected).toBe(false);
    expect(formValue.adsSelected).toBe(false);
    expect(formValue.webSelected).toBe(false);
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

  it('should calculate total as 500 when only Web is selected', () => {
    component.quoteForm.webSelected().value.set(true);
    expect(component.totalPrice()).toBe(500);
  });

  it('should calculate total as 1200 when all services are selected', () => {
    component.quoteForm.seoSelected().value.set(true);
    component.quoteForm.adsSelected().value.set(true);
    component.quoteForm.webSelected().value.set(true);
    expect(component.totalPrice()).toBe(1200);
  });

  it('should render three checkboxes', () => {
    const compiled = fixture.nativeElement;
    const checkboxes = compiled.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
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
});
