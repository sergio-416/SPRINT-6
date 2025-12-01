export interface QuoteFormModel {
  clientName: string;
  phone: string;
  email: string;
  seoSelected: boolean;
  adsSelected: boolean;
  webConfig: {
    selected: boolean;
    pages: number;
    languages: number;
  };
}
