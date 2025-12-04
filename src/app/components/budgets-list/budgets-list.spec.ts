// Unit tests for BudgetsList component
// Tests quote display with empty state and card rendering - references budgets-list.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetsList } from './budgets-list';
import { Quote } from '../../models/quote';

describe('BudgetsList', () => {
  let component: BudgetsList;
  let fixture: ComponentFixture<BudgetsList>;

  // Mock quotes data for testing
  const mockQuotes: Quote[] = [
    {
      id: '1',
      clientName: 'John Doe',
      phone: '123-456-7890',
      email: 'john@example.com',
      services: { seo: true, ads: false, web: false },
      webConfig: { pages: 1, languages: 1 },
      totalPrice: 300,
      createdAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      phone: '098-765-4321',
      email: 'jane@example.com',
      services: { seo: false, ads: true, web: true },
      webConfig: { pages: 5, languages: 2 },
      totalPrice: 800,
      createdAt: new Date('2025-01-02'),
    },
  ];

  // Sets up test environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsList],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetsList);
    component = fixture.componentInstance;
  });

  // Verifies component instantiates correctly
  it('should create the component', () => {
    fixture.componentRef.setInput('quotes', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Tests empty state message displays when no quotes
  it('should display message when no quotes exist', () => {
    fixture.componentRef.setInput('quotes', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('[data-testid="empty-message"]');
    expect(emptyMessage).not.toBeNull();
    expect(emptyMessage.textContent).toContain('No quotes created yet');
  });

  // Tests quote cards render when quotes exist
  it('should render quote cards when quotes exist', () => {
    fixture.componentRef.setInput('quotes', mockQuotes);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const quoteCards = compiled.querySelectorAll('[data-testid="quote-card"]');
    expect(quoteCards.length).toBe(2);
  });

  // Tests client name displays in quote card
  it('should display client name in quote card', () => {
    fixture.componentRef.setInput('quotes', [mockQuotes[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const clientName = compiled.querySelector('[data-testid="client-name"]');
    expect(clientName.textContent).toContain('John Doe');
  });

  // Tests total price displays in quote card
  it('should display total price in quote card', () => {
    fixture.componentRef.setInput('quotes', [mockQuotes[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const totalPrice = compiled.querySelector('[data-testid="quote-total"]');
    expect(totalPrice.textContent).toContain('€300');
  });

  // Tests selected services display correctly
  it('should display selected services', () => {
    fixture.componentRef.setInput('quotes', [mockQuotes[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const services = compiled.querySelector('[data-testid="quote-services"]');
    expect(services.textContent).toContain('SEO');
  });
});
