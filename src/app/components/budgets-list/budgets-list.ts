// Budgets list component - displays saved quotes with formatted service details
// Standalone component with OnPush detection - template in budgets-list.html
// Used in products-form.html, receives filtered/sorted quotes array as input
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Quote } from '../../models/quote';

@Component({
  selector: 'app-budgets-list',
  imports: [],
  templateUrl: './budgets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsList {
  // Input signal receives quotes array from parent component
  quotes = input.required<Quote[]>();

  // Formats quote services into human-readable text
  // Returns services joined with ' + ' separator, includes web config details
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
