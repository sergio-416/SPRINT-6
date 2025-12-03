import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Quote } from '../../models/quote';

@Component({
  selector: 'app-budgets-list',
  imports: [],
  templateUrl: './budgets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsList {
  quotes = input.required<Quote[]>();

  getServicesText(quote: Quote): string {
    const services: string[] = [];
    if (quote.services.seo) services.push('SEO');
    if (quote.services.ads) services.push('Ads');
    if (quote.services.web) {
      services.push(`Web (${quote.webConfig.pages} pages, ${quote.webConfig.languages} languages)`);
    }
    return services.join(' + ');
  }
}
