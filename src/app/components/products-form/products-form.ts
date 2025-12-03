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
import { Field, form, min, required, email as emailValidator } from '@angular/forms/signals';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { QuoteFormModel } from '../../models/quote-form';
import { SortOption, SortDirection } from '../../models/sort-option';
import { Budget } from '../../services/budget';
import { WebsitePanel } from '../website-panel/website-panel';
import { PageHeader } from '../page-header/page-header';
import { BudgetsList } from '../budgets-list/budgets-list';

@Component({
  selector: 'app-products-form',
  imports: [Field, WebsitePanel, PageHeader, BudgetsList],
  templateUrl: './products-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm {
  budgetService = inject(Budget);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchQuery = signal('');
  sortBy = signal<SortOption>('date');
  sortDirection = signal<SortDirection>('desc');
  formJustReset = signal(false);
  private isInitializing = signal(true);

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

  private readonly queryParams: Signal<Params>;

  constructor() {
    this.queryParams = toSignal(this.route.queryParams, { initialValue: {} });

    effect(() => {
      const params = this.queryParams();

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

      untracked(() => {
        this.quoteModel.set(model);
      });

      if (untracked(() => this.isInitializing())) {
        this.isInitializing.set(false);
      }
    });

    effect(() => {
      if (this.isInitializing()) {
        return;
      }

      const model = this.quoteModel();

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
    if (this.sortBy() === sort) {
      this.sortDirection.update((dir) => (dir === 'desc' ? 'asc' : 'desc'));
    } else {
      this.sortBy.set(sort);
      const defaultDirection = sort === 'name' ? 'asc' : 'desc';
      this.sortDirection.set(defaultDirection);
    }
  }

  onFieldInteraction(): void {
    if (this.formJustReset()) {
      this.formJustReset.set(false);
    }
  }

  private resetForm(): void {
    this.formJustReset.set(true);

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
