import { Injectable, signal } from '@angular/core';
import { Quote } from '../models/quote';

@Injectable({
  providedIn: 'root',
})
export class Budget {
  private readonly SEO_PRICE = 300;
  private readonly ADS_PRICE = 400;
  private readonly WEB_BASE_PRICE = 500;
  private readonly WEBSITE_CUSTOMIZATION_RATE = 30;

  private quotesSignal = signal<Quote[]>([]);

  readonly quotes = this.quotesSignal.asReadonly();

  calculateWebsitePrice(pages: number, languages: number): number {
    return pages * languages * this.WEBSITE_CUSTOMIZATION_RATE;
  }

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

  addQuote(quote: Quote): void {
    this.quotesSignal.update((quotes) => [...quotes, quote]);
  }

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
