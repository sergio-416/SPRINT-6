import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { QuoteFormModel } from '../../models/quote-form';
import { Budget } from '../../services/budget';

@Component({
  selector: 'app-products-form',
  imports: [Field],
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

  quoteForm = form(this.quoteModel);

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
