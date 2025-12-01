import { TestBed } from '@angular/core/testing';
import { Budget } from './budget';
import { Quote } from '../models/quote';

describe('Budget', () => {
  let service: Budget;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Budget],
    });
    service = TestBed.inject(Budget);
  });

  describe('Price Calculations', () => {
    it('should calculate website price correctly', () => {
      expect(service.calculateWebsitePrice(2, 3)).toBe(180);
    });

    it('should calculate total price with only SEO', () => {
      expect(service.calculateTotalPrice(true, false, false, 1, 1)).toBe(300);
    });

    it('should calculate total price with only Ads', () => {
      expect(service.calculateTotalPrice(false, true, false, 1, 1)).toBe(400);
    });

    it('should calculate total price with Web default config', () => {
      expect(service.calculateTotalPrice(false, false, true, 1, 1)).toBe(530);
    });

    it('should calculate total price with all services', () => {
      expect(service.calculateTotalPrice(true, true, true, 1, 1)).toBe(1230);
    });
  });

  describe('Quote Management', () => {
    it('should start with empty quotes array', () => {
      expect(service.quotes().length).toBe(0);
    });

    it('should add a quote to the collection', () => {
      const quote: Quote = {
        id: '1',
        clientName: 'John Doe',
        phone: '123-456-7890',
        email: 'john@example.com',
        services: {
          seo: true,
          ads: false,
          web: false,
        },
        webConfig: {
          pages: 1,
          languages: 1,
        },
        totalPrice: 300,
        createdAt: new Date(),
      };

      service.addQuote(quote);

      expect(service.quotes().length).toBe(1);
      expect(service.quotes()[0]).toEqual(quote);
    });

    it('should add multiple quotes to the collection', () => {
      const quote1: Quote = {
        id: '1',
        clientName: 'John Doe',
        phone: '123-456-7890',
        email: 'john@example.com',
        services: { seo: true, ads: false, web: false },
        webConfig: { pages: 1, languages: 1 },
        totalPrice: 300,
        createdAt: new Date(),
      };

      const quote2: Quote = {
        id: '2',
        clientName: 'Jane Smith',
        phone: '098-765-4321',
        email: 'jane@example.com',
        services: { seo: false, ads: true, web: true },
        webConfig: { pages: 5, languages: 2 },
        totalPrice: 800,
        createdAt: new Date(),
      };

      service.addQuote(quote1);
      service.addQuote(quote2);

      expect(service.quotes().length).toBe(2);
      expect(service.quotes()[0]).toEqual(quote1);
      expect(service.quotes()[1]).toEqual(quote2);
    });

    it('should generate unique IDs for quotes', () => {
      const quoteData = {
        clientName: 'Test Client',
        phone: '555-0000',
        email: 'test@test.com',
        seoSelected: true,
        adsSelected: false,
        webSelected: false,
        pages: 1,
        languages: 1,
        totalPrice: 300,
      };

      const id1 = service.createQuote(quoteData);
      const id2 = service.createQuote(quoteData);

      expect(id1).not.toBe(id2);
      expect(service.quotes().length).toBe(2);
    });
  });
});
