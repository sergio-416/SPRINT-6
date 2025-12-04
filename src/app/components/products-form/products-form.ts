// Main quote calculator component - handles form, pricing, search/sort, URL sync
// Standalone component with OnPush detection - template in products-form.html
// Uses Budget service, custom validators, Signal Forms, URL query params
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Field, form, min, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { QuoteFormModel } from '../../models/quote-form';
import { SortOption, SortDirection } from '../../models/sort-option';
import { Budget } from '../../services/budget';
import { WebsitePanel } from '../website-panel/website-panel';
import { PageHeader } from '../page-header/page-header';
import { BudgetsList } from '../budgets-list/budgets-list';
import { spanishPhone, enhancedEmail, clientName } from '../../validators/custom-validators';

@Component({
  selector: 'app-products-form',
  imports: [Field, WebsitePanel, PageHeader, BudgetsList],
  templateUrl: './products-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm {
  // Injects Budget service for pricing and quote management
  budgetService = inject(Budget);
  // Injects Router for programmatic navigation
  private router = inject(Router);
  // Injects ActivatedRoute for reading URL query parameters
  private route = inject(ActivatedRoute);

  // Search query signal for filtering quotes by client name
  searchQuery = signal('');
  // Sort option signal (date/price/name)
  sortBy = signal<SortOption>('date');
  // Sort direction signal (asc/desc)
  sortDirection = signal<SortDirection>('desc');
  // Flag to prevent showing validation errors immediately after form reset
  formJustReset = signal(false);
  // Flag to prevent URL updates during initial load from query params
  private isInitializing = signal(true);

  // Quote form data model signal - source of truth for form state
  quoteModel = signal<QuoteFormModel>({
    clientName: '',
    phone: '',
    email: '',
    seoSelected: false,
    adsSelected: false,
    webConfig: {
      selected: false,
      pages: 1,
      languages: 1,
    },
  });

  // Signal Forms instance with custom validators - synced to quoteModel signal
  quoteForm = form(this.quoteModel, (schemaPath) => {
    // Client name validation: required, 2-100 chars, letters/spaces/hyphens only
    required(schemaPath.clientName, { message: 'Client name is required' });
    clientName(schemaPath.clientName, {
      message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
      minLength: 2,
      maxLength: 100,
    });

    // Phone validation: required, Spanish format (9 digits, starts with 6/7)
    required(schemaPath.phone, { message: 'Phone is required' });
    spanishPhone(schemaPath.phone, {
      message: 'Please enter a valid Spanish phone number (9 digits starting with 6 or 7)',
    });

    // Email validation: required, enhanced format with typo detection
    required(schemaPath.email, { message: 'Email is required' });
    enhancedEmail(schemaPath.email, {
      message: 'Please enter a valid email address',
    });

    // Website config validation: minimum 1 page and 1 language
    min(schemaPath.webConfig.pages, 1, { message: 'Pages must be at least 1' });
    min(schemaPath.webConfig.languages, 1, { message: 'Languages must be at least 1' });
  });

  // Computed total price based on selected services and configuration
  // Delegates calculation to Budget service
  totalPrice = computed(() => {
    const formValue = this.quoteForm().value();

    return this.budgetService.calculateTotalPrice(
      formValue.seoSelected,
      formValue.adsSelected,
      formValue.webConfig.selected,
      formValue.webConfig.pages,
      formValue.webConfig.languages
    );
  });

  // Computed filtered and sorted quotes array
  // Filters by search query, then sorts by selected option and direction
  filteredAndSortedQuotes = computed(() => {
    let quotes = [...this.budgetService.quotes()];

    // Filter by search query (case-insensitive, partial match)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      quotes = quotes.filter((quote) => quote.clientName.toLowerCase().includes(query));
    }

    // Sort by selected option and direction
    const sortOption = this.sortBy();
    const direction = this.sortDirection();
    const multiplier = direction === 'desc' ? -1 : 1;

    quotes.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'price':
          comparison = a.totalPrice - b.totalPrice;
          break;
        case 'name':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
      }
      return comparison * multiplier;
    });

    return quotes;
  });

  // Signal for URL query parameters - reactive to route changes
  private readonly queryParams: Signal<Params>;

  constructor() {
    // Converts Observable route.queryParams to Signal
    this.queryParams = toSignal(this.route.queryParams, { initialValue: {} });

    // Effect: Updates form from URL query parameters (initial load and URL changes)
    effect(() => {
      const params = this.queryParams();

      // Constructs form model from query params with defaults
      const model: QuoteFormModel = {
        clientName: (params['clientName'] as string) || '',
        phone: (params['phone'] as string) || '',
        email: (params['email'] as string) || '',
        seoSelected: params['seo'] === 'true',
        adsSelected: params['ads'] === 'true',
        webConfig: {
          selected: params['web'] === 'true',
          pages: params['pages'] ? parseInt(params['pages'] as string, 10) : 1,
          languages: params['languages'] ? parseInt(params['languages'] as string, 10) : 1,
        },
      };

      // Updates form model without triggering URL effect
      untracked(() => {
        this.quoteModel.set(model);
      });

      // Marks initialization complete after first URL load
      if (untracked(() => this.isInitializing())) {
        this.isInitializing.set(false);
      }
    });

    // Effect: Updates URL from form model changes (after initialization)
    effect(() => {
      // Skip URL updates during initialization to prevent loop
      if (this.isInitializing()) {
        return;
      }

      const model = this.quoteModel();

      // Constructs query params from form model
      const queryParams = {
        clientName: model.clientName || '',
        phone: model.phone || '',
        email: model.email || '',
        seo: model.seoSelected.toString(),
        ads: model.adsSelected.toString(),
        web: model.webConfig.selected.toString(),
        pages: model.webConfig.pages.toString(),
        languages: model.webConfig.languages.toString(),
      };

      // Updates URL without navigation or history entry
      untracked(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
    });
  }

  // Handles form submission - creates quote if valid, resets form
  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.quoteForm().invalid()) {
      return;
    }

    const formValue = this.quoteForm().value();

    // Delegates quote creation to Budget service
    this.budgetService.createQuote({
      clientName: formValue.clientName,
      phone: formValue.phone,
      email: formValue.email,
      seoSelected: formValue.seoSelected,
      adsSelected: formValue.adsSelected,
      webSelected: formValue.webConfig.selected,
      pages: formValue.webConfig.pages,
      languages: formValue.webConfig.languages,
      totalPrice: this.totalPrice(),
    });

    this.resetForm();
  }

  // Handles search input changes - updates searchQuery signal
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Handles sort button clicks - toggles direction on same option, resets on new
  onSortChange(sort: SortOption): void {
    if (this.sortBy() === sort) {
      // Toggle direction if clicking same sort option
      this.sortDirection.update((dir) => (dir === 'desc' ? 'asc' : 'desc'));
    } else {
      // Set new sort option with default direction
      this.sortBy.set(sort);
      const defaultDirection = sort === 'name' ? 'asc' : 'desc';
      this.sortDirection.set(defaultDirection);
    }
  }

  // Clears formJustReset flag on any field interaction
  onFieldInteraction(): void {
    if (this.formJustReset()) {
      this.formJustReset.set(false);
    }
  }

  // Resets form to initial empty state
  private resetForm(): void {
    // Sets flag to prevent validation errors from showing immediately
    this.formJustReset.set(true);

    // Resets form model to defaults
    this.quoteModel.set({
      clientName: '',
      phone: '',
      email: '',
      seoSelected: false,
      adsSelected: false,
      webConfig: {
        selected: false,
        pages: 1,
        languages: 1,
      },
    });
  }
}
