// Quote form model interface - defines structure for form data
// Used in products-form.ts to create Signal Forms
export interface QuoteFormModel {
  // Client contact information fields
  clientName: string;
  phone: string;
  email: string;
  // Service selection flags
  seoSelected: boolean;
  adsSelected: boolean;
  // Website configuration with selection flag
  webConfig: {
    selected: boolean;
    pages: number;
    languages: number;
  };
}
