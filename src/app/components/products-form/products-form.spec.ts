import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ProductsForm } from './products-form';
import { Budget } from '../../services/budget';

describe('ProductsForm', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
      providers: [Budget, provideRouter([])],
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

  it('should render client name input', () => {
    const compiled = fixture.nativeElement;
    const nameInput = compiled.querySelector('[data-testid="client-name"]');
    expect(nameInput).not.toBeNull();
  });

  it('should render phone input', () => {
    const compiled = fixture.nativeElement;
    const phoneInput = compiled.querySelector('[data-testid="client-phone"]');
    expect(phoneInput).not.toBeNull();
  });

  it('should render email input', () => {
    const compiled = fixture.nativeElement;
    const emailInput = compiled.querySelector('[data-testid="client-email"]');
    expect(emailInput).not.toBeNull();
  });

  it('should create quote when form is submitted with valid data', () => {
    component.quoteModel.update((current) => ({
      ...current,
      clientName: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      seoSelected: true,
    }));

    const budgetService = TestBed.inject(Budget);
    const initialCount = budgetService.quotes().length;

    component.onSubmit(new Event('submit'));

    expect(budgetService.quotes().length).toBe(initialCount + 1);
    expect(budgetService.quotes()[initialCount].clientName).toBe('John Doe');
  });

  it('should clear form after successful submission', () => {
    component.quoteModel.update((current) => ({
      ...current,
      clientName: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      seoSelected: true,
    }));

    component.onSubmit(new Event('submit'));

    const formValue = component.quoteForm().value();
    expect(formValue.clientName).toBe('');
    expect(formValue.phone).toBe('');
    expect(formValue.email).toBe('');
    expect(formValue.seoSelected).toBe(false);
  });
});

describe('Quote filtering and sorting', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
      providers: [Budget, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const budgetService = TestBed.inject(Budget);
    const baseTime = new Date('2025-01-01T10:00:00Z');

    const alice = budgetService.createQuote({
      clientName: 'Alice Johnson',
      phone: '111-1111',
      email: 'alice@test.com',
      seoSelected: true,
      adsSelected: false,
      webSelected: false,
      pages: 1,
      languages: 1,
      totalPrice: 300,
    });

    const aliceQuote = budgetService.quotes().find((q) => q.id === alice);
    if (aliceQuote) {
      Object.defineProperty(aliceQuote, 'createdAt', {
        value: new Date(baseTime.getTime()),
        writable: true,
      });
    }

    const bob = budgetService.createQuote({
      clientName: 'Bob Smith',
      phone: '222-2222',
      email: 'bob@test.com',
      seoSelected: false,
      adsSelected: true,
      webSelected: false,
      pages: 1,
      languages: 1,
      totalPrice: 400,
    });

    const bobQuote = budgetService.quotes().find((q) => q.id === bob);
    if (bobQuote) {
      Object.defineProperty(bobQuote, 'createdAt', {
        value: new Date(baseTime.getTime() + 60000),
        writable: true,
      });
    }

    const charlie = budgetService.createQuote({
      clientName: 'Charlie Brown',
      phone: '333-3333',
      email: 'charlie@test.com',
      seoSelected: true,
      adsSelected: true,
      webSelected: false,
      pages: 1,
      languages: 1,
      totalPrice: 700,
    });

    const charlieQuote = budgetService.quotes().find((q) => q.id === charlie);
    if (charlieQuote) {
      Object.defineProperty(charlieQuote, 'createdAt', {
        value: new Date(baseTime.getTime() + 120000),
        writable: true,
      });
    }

    fixture.detectChanges();
  });

  it('should display all quotes initially', () => {
    expect(component.filteredAndSortedQuotes().length).toBe(3);
  });

  it('should filter quotes by client name (case insensitive)', () => {
    component.searchQuery.set('alice');
    expect(component.filteredAndSortedQuotes().length).toBe(1);
    expect(component.filteredAndSortedQuotes()[0].clientName).toBe('Alice Johnson');
  });

  it('should filter quotes with partial name match', () => {
    component.searchQuery.set('o');
    expect(component.filteredAndSortedQuotes().length).toBe(3);
  });

  it('should return empty array when no quotes match search', () => {
    component.searchQuery.set('xyz');
    expect(component.filteredAndSortedQuotes().length).toBe(0);
  });

  it('should sort quotes by date (newest first by default)', () => {
    component.sortBy.set('date');
    component.sortDirection.set('desc');
    const sorted = component.filteredAndSortedQuotes();
    expect(sorted[0].clientName).toBe('Charlie Brown');
    expect(sorted[2].clientName).toBe('Alice Johnson');
  });

  it('should sort quotes by price (highest first)', () => {
    component.sortBy.set('price');
    component.sortDirection.set('desc');
    const sorted = component.filteredAndSortedQuotes();
    expect(sorted[0].totalPrice).toBe(700);
    expect(sorted[1].totalPrice).toBe(400);
    expect(sorted[2].totalPrice).toBe(300);
  });

  it('should sort quotes alphabetically by name', () => {
    component.sortBy.set('name');
    component.sortDirection.set('asc');
    const sorted = component.filteredAndSortedQuotes();
    expect(sorted[0].clientName).toBe('Alice Johnson');
    expect(sorted[1].clientName).toBe('Bob Smith');
    expect(sorted[2].clientName).toBe('Charlie Brown');
  });

  it('should apply both filtering and sorting', () => {
    component.searchQuery.set('o');
    component.sortBy.set('price');
    const result = component.filteredAndSortedQuotes();
    expect(result.length).toBe(3);
    expect(result[0].totalPrice).toBe(700);
  });

  it('should render search input', () => {
    const compiled = fixture.nativeElement;
    const searchInput = compiled.querySelector('[data-testid="search-input"]');
    expect(searchInput).not.toBeNull();
  });

  it('should render sort buttons', () => {
    const compiled = fixture.nativeElement;
    const dateButton = compiled.querySelector('[data-testid="sort-date"]');
    const priceButton = compiled.querySelector('[data-testid="sort-price"]');
    const nameButton = compiled.querySelector('[data-testid="sort-name"]');

    expect(dateButton).not.toBeNull();
    expect(priceButton).not.toBeNull();
    expect(nameButton).not.toBeNull();
  });
});

describe('URL state synchronization', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm],
      providers: [
        Budget,
        provideRouter([{ path: '', component: ProductsForm }]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;

    await fixture.ngZone?.run(() => router.navigate(['/']));
    fixture.detectChanges();
  });

  it('should initialize form from URL query parameters', async () => {
    await fixture.ngZone?.run(async () => {
      await router.navigate(['/'], {
        queryParams: {
          clientName: 'John Doe',
          phone: '555-1234',
          email: 'john@example.com',
          seo: 'true',
          ads: 'true',
          web: 'true',
          pages: '5',
          languages: '2',
        },
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    const formValue = component.quoteForm().value();
    expect(formValue.clientName).toBe('John Doe');
    expect(formValue.phone).toBe('555-1234');
    expect(formValue.email).toBe('john@example.com');
    expect(formValue.seoSelected).toBe(true);
    expect(formValue.adsSelected).toBe(true);
    expect(formValue.webConfig.selected).toBe(true);
    expect(formValue.webConfig.pages).toBe(5);
    expect(formValue.webConfig.languages).toBe(2);
  });

  it('should update URL when form values change', async () => {
    component.quoteModel.update((current) => ({
      ...current,
      seoSelected: true,
      adsSelected: true,
    }));

    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const params = new URLSearchParams(location.path().split('?')[1] || '');
    expect(params.get('seo')).toBe('true');
    expect(params.get('ads')).toBe('true');
  });

  it('should handle missing query parameters with defaults', async () => {
    await fixture.ngZone?.run(async () => {
      await router.navigate(['/'], { queryParams: {} });
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    const formValue = component.quoteForm().value();
    expect(formValue.seoSelected).toBe(false);
    expect(formValue.adsSelected).toBe(false);
    expect(formValue.webConfig.selected).toBe(false);
    expect(formValue.webConfig.pages).toBe(1);
    expect(formValue.webConfig.languages).toBe(1);
  });

  it('should handle partial query parameters', async () => {
    await fixture.ngZone?.run(async () => {
      await router.navigate(['/'], {
        queryParams: {
          seo: 'true',
          pages: '10',
        },
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    const formValue = component.quoteForm().value();
    expect(formValue.seoSelected).toBe(true);
    expect(formValue.adsSelected).toBe(false);
    expect(formValue.webConfig.pages).toBe(10);
  });

  it('should not update URL when form is reset after submission', async () => {
    component.quoteModel.update((current) => ({
      ...current,
      clientName: 'Test User',
      phone: '555-0000',
      email: 'test@example.com',
      seoSelected: true,
    }));

    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));

    component.onSubmit(new Event('submit'));

    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const params = new URLSearchParams(location.path().split('?')[1] || '');
    expect(params.get('clientName')).toBe('');
    expect(params.get('seo')).toBe('false');
  });
});
