import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Budget {
  private readonly SEO_PRICE = 300;
  private readonly ADS_PRICE = 400;
  private readonly WEB_BASE_PRICE = 500;
  private readonly WEBSITE_CUSTOMIZATION_RATE = 30;

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

    if (seoSelected) total += this.SEO_PRICE;
    if (adsSelected) total += this.ADS_PRICE;
    if (webSelected) {
      total += this.WEB_BASE_PRICE;
      total += this.calculateWebsitePrice(pages, languages);
    }

    return total;
  }
}
