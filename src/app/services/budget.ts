// Budget service - handles pricing calculations and quote management
// Injectable service used in products-form.ts, provides root-level singleton instance
import { Injectable, signal } from '@angular/core';
import { Quote } from '../models/quote';

@Injectable({
  providedIn: 'root',
})
export class Budget {
  // Service pricing constants in euros
  readonly SEO_PRICE = 300;
  readonly ADS_PRICE = 400;
  readonly WEB_BASE_PRICE = 500;
  readonly WEBSITE_CUSTOMIZATION_RATE = 30;

  // Internal writable signal for quotes collection
  private quotesSignal = signal<Quote[]>([]);

  // Public read-only accessor for quotes - prevents external modification
  readonly quotes = this.quotesSignal.asReadonly();

  // Calculates website customization cost based on pages and languages
  // Formula: pages × languages × €30 per unit
  calculateWebsitePrice(pages: number, languages: number): number {
    return pages * languages * this.WEBSITE_CUSTOMIZATION_RATE;
  }

  // Calculates total quote price based on selected services and configuration
  // Returns sum of selected service prices plus website customization if web selected
  calculateTotalPrice(
    seoSelected: boolean,
    adsSelected: boolean,
    webSelected: boolean,
    pages: number,
    languages: number
  ): number {
    let total = 0;

    if (seoSelected) {
      total += this.SEO_PRICE;
    }

    if (adsSelected) {
      total += this.ADS_PRICE;
    }

    if (webSelected) {
      total += this.WEB_BASE_PRICE;
      total += this.calculateWebsitePrice(pages, languages);
    }

    return total;
  }

  // Adds quote to collection using immutable update pattern
  // Preserves existing quotes while adding new one
  addQuote(quote: Quote): void {
    this.quotesSignal.update((quotes) => [...quotes, quote]);
  }

  // Creates new quote from form data and adds to collection
  // Generates unique ID using crypto.randomUUID(), returns ID for tracking
  createQuote(data: {
    clientName: string;
    phone: string;
    email: string;
    seoSelected: boolean;
    adsSelected: boolean;
    webSelected: boolean;
    pages: number;
    languages: number;
    totalPrice: number;
  }): string {
    const id = crypto.randomUUID();
    const quote: Quote = {
      id,
      clientName: data.clientName,
      phone: data.phone,
      email: data.email,
      services: {
        seo: data.seoSelected,
        ads: data.adsSelected,
        web: data.webSelected,
      },
      webConfig: {
        pages: data.pages,
        languages: data.languages,
      },
      totalPrice: data.totalPrice,
      createdAt: new Date(),
    };

    this.addQuote(quote);
    return id;
  }
}
