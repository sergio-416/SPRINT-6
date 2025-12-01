import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Field, form, min } from '@angular/forms/signals';
import { QuoteFormModel } from '../../models/quote-form';
import { Budget } from '../../services/budget';
import { WebsitePanel } from '../website-panel/website-panel';
import { PageHeader } from '../page-header/page-header';

@Component({
  selector: 'app-products-form',
  imports: [Field, WebsitePanel, PageHeader],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm {
  quoteModel = signal<QuoteFormModel>({
    seoSelected: false,
    adsSelected: false,
    webConfig: {
      selected: false,
      pages: 1,
      languages: 1,
    },
  });

  quoteForm = form(this.quoteModel, (schemaPath) => {
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

  submissionStatus = signal<'idle' | 'submitted'>('idle');

  constructor(private budgetService: Budget) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submissionStatus.set('submitted');
  }
}
