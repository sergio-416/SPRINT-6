import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { QuoteFormModel } from '../../models/quote-form';

@Component({
  selector: 'app-products-form',
  imports: [Field],
  templateUrl: './products-form.html',
  styleUrl: './products-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsForm {
  private readonly SEO_PRICE = 300;
  private readonly ADS_PRICE = 400;
  private readonly WEB_PRICE = 500;

  quoteModel = signal<QuoteFormModel>({
    seoSelected: false,
    adsSelected: false,
    webSelected: false,
  });

  quoteForm = form(this.quoteModel);

  totalPrice = computed(() => {
    const formValue = this.quoteForm().value();
    let total = 0;

    if (formValue.seoSelected) total += this.SEO_PRICE;
    if (formValue.adsSelected) total += this.ADS_PRICE;
    if (formValue.webSelected) total += this.WEB_PRICE;

    return total;
  });

  submissionStatus = signal<'idle' | 'submitted'>('idle');

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submissionStatus.set('submitted');
  }
}
