import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Field, form, min, required, email as emailValidator } from '@angular/forms/signals';
import { QuoteFormModel } from '../../models/quote-form';
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
