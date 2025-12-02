import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Field, form, min, required, email as emailValidator } from '@angular/forms/signals';
import { QuoteFormModel } from '../../models/quote-form';
import { SortOption } from '../../models/sort-option';
import { Budget } from '../../services/budget';
import { WebsitePanel } from '../website-panel/website-panel';
import { PageHeader } from '../page-header/page-header';
import { BudgetsList } from '../budgets-list/budgets-list';

@Component({
  selector: 'app-products-form',
  imports: [Field, WebsitePanel, PageHeader, BudgetsList],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm {
  searchQuery = signal('');
  sortBy = signal<SortOption>('date');

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

  quoteForm = form(this.quoteModel, (schemaPath) => {
    required(schemaPath.clientName, { message: 'Client name is required' });
    required(schemaPath.phone, { message: 'Phone is required' });
    required(schemaPath.email, { message: 'Email is required' });
    emailValidator(schemaPath.email, { message: 'Valid email is required' });
    min(schemaPath.webConfig.pages, 1, { message: 'Pages must be at least 1' });
    min(schemaPath.webConfig.languages, 1, { message: 'Languages must be at least 1' });
  });

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

  filteredAndSortedQuotes = computed(() => {
    let quotes = [...this.budgetService.quotes()];

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      quotes = quotes.filter((quote) => quote.clientName.toLowerCase().includes(query));
    }

    const sortOption = this.sortBy();
    quotes.sort((a, b) => {
      switch (sortOption) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'price':
          return b.totalPrice - a.totalPrice;
        case 'name':
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return quotes;
  });

  constructor(public budgetService: Budget) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.quoteForm().invalid()) {
      return;
    }

    const formValue = this.quoteForm().value();

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

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSortChange(sort: SortOption): void {
    this.sortBy.set(sort);
  }

  private resetForm(): void {
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
