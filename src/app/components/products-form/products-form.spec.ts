describe('Quote filtering and sorting', () => {
  beforeEach(() => {
    const budgetService = TestBed.inject(Budget);

    budgetService.createQuote({
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

    budgetService.createQuote({
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

    budgetService.createQuote({
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
    const sorted = component.filteredAndSortedQuotes();
    expect(sorted[0].clientName).toBe('Charlie Brown');
    expect(sorted[2].clientName).toBe('Alice Johnson');
  });

  it('should sort quotes by price (highest first)', () => {
    component.sortBy.set('price');
    const sorted = component.filteredAndSortedQuotes();
    expect(sorted[0].totalPrice).toBe(700);
    expect(sorted[1].totalPrice).toBe(400);
    expect(sorted[2].totalPrice).toBe(300);
  });

  it('should sort quotes alphabetically by name', () => {
    component.sortBy.set('name');
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
