export interface Quote {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  services: {
    seo: boolean;
    ads: boolean;
    web: boolean;
  };
  webConfig: {
    pages: number;
    languages: number;
  };
  totalPrice: number;
  createdAt: Date;
}
