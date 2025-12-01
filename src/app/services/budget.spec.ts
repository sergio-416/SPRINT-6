import { TestBed } from '@angular/core/testing';
import { Budget } from './budget';

describe('Budget', () => {
  let service: Budget;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Budget);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateWebsitePrice', () => {
    it('should return 0 when pages is 0', () => {
      const result = service.calculateWebsitePrice(0, 5);
      expect(result).toBe(0);
    });

    it('should return 0 when languages is 0', () => {
      const result = service.calculateWebsitePrice(5, 0);
      expect(result).toBe(0);
    });

    it('should calculate correctly with 1 page and 1 language', () => {
      const result = service.calculateWebsitePrice(1, 1);
      expect(result).toBe(30);
    });

    it('should calculate correctly with 5 pages and 2 languages', () => {
      const result = service.calculateWebsitePrice(5, 2);
      expect(result).toBe(300);
    });

    it('should calculate correctly with 10 pages and 3 languages', () => {
      const result = service.calculateWebsitePrice(10, 3);
      expect(result).toBe(900);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return 0 when no services are selected', () => {
      const result = service.calculateTotalPrice(false, false, false, 0, 0);
      expect(result).toBe(0);
    });

    it('should return 300 when only SEO is selected', () => {
      const result = service.calculateTotalPrice(true, false, false, 0, 0);
      expect(result).toBe(300);
    });

    it('should return 400 when only Ads is selected', () => {
      const result = service.calculateTotalPrice(false, true, false, 0, 0);
      expect(result).toBe(400);
    });

    it('should return 500 when only Web is selected without customization', () => {
      const result = service.calculateTotalPrice(false, false, true, 0, 0);
      expect(result).toBe(500);
    });

    it('should return 800 when Web is selected with 5 pages and 2 languages', () => {
      const result = service.calculateTotalPrice(false, false, true, 5, 2);
      expect(result).toBe(800);
    });

    it('should return 1200 when all services are selected without customization', () => {
      const result = service.calculateTotalPrice(true, true, true, 0, 0);
      expect(result).toBe(1200);
    });

    it('should return 1500 when all services are selected with 5 pages and 2 languages', () => {
      const result = service.calculateTotalPrice(true, true, true, 5, 2);
      expect(result).toBe(1500);
    });
  });
});
