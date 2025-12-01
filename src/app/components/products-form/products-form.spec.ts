import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsForm } from './products-form';
import { Budget } from '../../services/budget';

describe('ProductsForm', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
      providers: [Budget],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all checkboxes unchecked', () => {
    const formValue = component.quoteForm().value();
    expect(formValue.seoSelected).toBe(false);
    expect(formValue.adsSelected).toBe(false);
    expect(formValue.webConfig.selected).toBe(false);
  });

  it('should initialize website config with default values', () => {
    const formValue = component.quoteForm().value();
    expect(formValue.webConfig.pages).toBe(1);
    expect(formValue.webConfig.languages).toBe(1);
  });

  it('should calculate total as 0 when no services are selected', () => {
    expect(component.totalPrice()).toBe(0);
  });

  it('should calculate total as 300 when only SEO is selected', () => {
    component.quoteModel.update((current) => ({
      ...current,
      seoSelected: true,
    }));
    expect(component.totalPrice()).toBe(300);
  });

  it('should calculate total as 400 when only Ads is selected', () => {
    component.quoteModel.update((current) => ({
      ...current,
      adsSelected: true,
    }));
    expect(component.totalPrice()).toBe(400);
  });

  it('should calculate total as 530 when Web is selected with default configuration', () => {
    component.quoteModel.update((current) => ({
      ...current,
      webConfig: {
        ...current.webConfig,
        selected: true,
      },
    }));
    expect(component.totalPrice()).toBe(530);
  });

  it('should calculate total as 800 when Web is selected with 5 pages and 2 languages', () => {
    component.quoteModel.update((current) => ({
      ...current,
      webConfig: {
        ...current.webConfig,
        selected: true,
        pages: 5,
        languages: 2,
      },
    }));
    expect(component.totalPrice()).toBe(800);
  });

  it('should calculate total as 1230 when all services are selected with default configuration', () => {
    component.quoteModel.update((current) => ({
      ...current,
      seoSelected: true,
      adsSelected: true,
      webConfig: {
        ...current.webConfig,
        selected: true,
      },
    }));
    expect(component.totalPrice()).toBe(1230);
  });

  it('should render three service checkboxes', () => {
    const compiled = fixture.nativeElement;
    const checkboxes = compiled.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
  });

  it('should display the calculated total price', () => {
    const compiled = fixture.nativeElement;
    const totalElement = compiled.querySelector('[data-testid="total-price"]');
    expect(totalElement.textContent).toContain('€0');
  });

  it('should not show panel when website is not selected', () => {
    const compiled = fixture.nativeElement;
    const panel = compiled.querySelector('app-website-panel');
    expect(panel).toBeNull();
  });

  it('should show panel when website is selected', () => {
    component.quoteModel.update((current) => ({
      ...current,
      webConfig: {
        ...current.webConfig,
        selected: true,
      },
    }));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const panel = compiled.querySelector('app-website-panel');
    expect(panel).not.toBeNull();
  });
});
