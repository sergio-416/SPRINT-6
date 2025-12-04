// Unit tests for custom form validators (65 tests total)
// Tests Spanish phone, enhanced email, and client name validation - references custom-validators.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { spanishPhone, enhancedEmail, clientName } from './custom-validators';

describe('spanishPhone validator', () => {
  let testForm: ReturnType<typeof form<{ phone: string }>>;

  // Creates test form instance with Spanish phone validator before each test
  beforeEach(() => {
    const model = signal({ phone: '' });
    testForm = TestBed.runInInjectionContext(() =>
      form(model, (schemaPath) => {
        spanishPhone(schemaPath.phone, {
          message: 'Please enter a valid Spanish phone number',
        });
      })
    );
  });

  // Tests valid mobile numbers starting with 6
  it('should accept valid Spanish mobile number starting with 6', () => {
    testForm.phone().value.set('666777888');
    expect(testForm.phone().valid()).toBe(true);
    expect(testForm.phone().errors()).toHaveLength(0);
  });

  // Tests valid mobile numbers starting with 7
  it('should accept valid Spanish mobile number starting with 7', () => {
    testForm.phone().value.set('777888999');
    expect(testForm.phone().valid()).toBe(true);
    expect(testForm.phone().errors()).toHaveLength(0);
  });

  // Tests phone format with space separators
  it('should accept phone number with spaces', () => {
    testForm.phone().value.set('666 777 888');
    expect(testForm.phone().valid()).toBe(true);
  });

  // Tests phone format with dash separators
  it('should accept phone number with dashes', () => {
    testForm.phone().value.set('666-777-888');
    expect(testForm.phone().valid()).toBe(true);
  });

  // Tests phone format with mixed space and dash separators
  it('should accept phone number with mixed separators', () => {
    testForm.phone().value.set('666 777-888');
    expect(testForm.phone().valid()).toBe(true);
  });

  // Empty string validation is delegated to required validator
  it('should accept empty string (handled by required validator)', () => {
    testForm.phone().value.set('');
    expect(testForm.phone().valid()).toBe(true);
  });

  // Tests rejection of incorrect digit count
  it('should reject phone number with less than 9 digits', () => {
    testForm.phone().value.set('66677788');
    expect(testForm.phone().valid()).toBe(false);
    expect(testForm.phone().errors()).toHaveLength(1);
    expect(testForm.phone().errors()[0].message).toBe('Please enter a valid Spanish phone number');
  });

  // Tests rejection of excessive digits
  it('should reject phone number with more than 9 digits', () => {
    testForm.phone().value.set('6667778889');
    expect(testForm.phone().valid()).toBe(false);
  });

  // Tests rejection of invalid starting digit 5
  it('should reject phone number starting with 5', () => {
    testForm.phone().value.set('566777888');
    expect(testForm.phone().valid()).toBe(false);
  });

  // Tests rejection of invalid starting digit 8
  it('should reject phone number starting with 8', () => {
    testForm.phone().value.set('866777888');
    expect(testForm.phone().valid()).toBe(false);
  });

  // Tests rejection of invalid starting digit 9
  it('should reject phone number starting with 9', () => {
    testForm.phone().value.set('966777888');
    expect(testForm.phone().valid()).toBe(false);
  });

  // Tests rejection of alphabetic characters
  it('should reject phone number with letters', () => {
    testForm.phone().value.set('66ABC7888');
    expect(testForm.phone().valid()).toBe(false);
  });

  // Tests rejection of special characters
  it('should reject phone number with special characters', () => {
    testForm.phone().value.set('666@77#88');
    expect(testForm.phone().valid()).toBe(false);
  });
});

describe('enhancedEmail validator', () => {
  let testForm: ReturnType<typeof form<{ email: string }>>;

  // Creates test form instance with enhanced email validator before each test
  beforeEach(() => {
    const model = signal({ email: '' });
    testForm = TestBed.runInInjectionContext(() =>
      form(model, (schemaPath) => {
        enhancedEmail(schemaPath.email, {
          message: 'Please enter a valid email address',
        });
      })
    );
  });

  // Tests standard email format validation
  it('should accept standard email format', () => {
    testForm.email().value.set('user@example.com');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests email with subdomain support
  it('should accept email with subdomain', () => {
    testForm.email().value.set('user@mail.example.com');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests email local part with dots
  it('should accept email with dots in local part', () => {
    testForm.email().value.set('first.last@example.com');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests email with numeric characters
  it('should accept email with numbers', () => {
    testForm.email().value.set('user123@example456.com');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests email with hyphenated names
  it('should accept email with hyphens', () => {
    testForm.email().value.set('user-name@example-domain.com');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests case insensitivity for uppercase letters
  it('should accept email with uppercase letters', () => {
    testForm.email().value.set('User@EXAMPLE.COM');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests mixed case handling
  it('should accept email with mixed case', () => {
    testForm.email().value.set('UsEr@ExAmPlE.CoM');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests trimming of whitespace
  it('should accept email with leading/trailing spaces (normalized)', () => {
    testForm.email().value.set('  user@example.com  ');
    expect(testForm.email().valid()).toBe(true);
  });

  // Empty string validation is delegated to required validator
  it('should accept empty string (handled by required validator)', () => {
    testForm.email().value.set('');
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests rejection of missing @ symbol
  it('should reject email without @ symbol', () => {
    testForm.email().value.set('userexample.com');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests rejection of missing domain
  it('should reject email without domain', () => {
    testForm.email().value.set('user@');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests rejection of missing local part
  it('should reject email without local part', () => {
    testForm.email().value.set('@example.com');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests rejection of missing TLD
  it('should reject email without TLD', () => {
    testForm.email().value.set('user@example');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests minimum TLD length requirement
  it('should reject email with TLD shorter than 2 characters', () => {
    testForm.email().value.set('user@example.c');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests detection of common Gmail typo
  it('should reject email with common Gmail typo (gmial)', () => {
    testForm.email().value.set('user@gmial.com');
    expect(testForm.email().valid()).toBe(false);
    expect(testForm.email().errors()[0].message).toContain('typo');
  });

  // Tests detection of Gmail typo variant
  it('should reject email with common Gmail typo (gmai)', () => {
    testForm.email().value.set('user@gmai.com');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests detection of Yahoo typo
  it('should reject email with common Yahoo typo (yahooo)', () => {
    testForm.email().value.set('user@yahooo.com');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests detection of Hotmail typo
  it('should reject email with common Hotmail typo (hotmial)', () => {
    testForm.email().value.set('user@hotmial.com');
    expect(testForm.email().valid()).toBe(false);
  });

  // Tests rejection of consecutive dots
  it('should reject email with consecutive dots', () => {
    testForm.email().value.set('user..name@example.com');
    expect(testForm.email().valid()).toBe(false);
    expect(testForm.email().errors()[0].message).toContain('consecutive dots');
  });

  // Tests rejection of multiple @ symbols
  it('should reject email with multiple @ symbols', () => {
    testForm.email().value.set('user@@example.com');
    expect(testForm.email().valid()).toBe(false);
  });
});

describe('clientName validator', () => {
  let testForm: ReturnType<typeof form<{ name: string }>>;

  // Creates test form instance with client name validator before each test
  beforeEach(() => {
    const model = signal({ name: '' });
    testForm = TestBed.runInInjectionContext(() =>
      form(model, (schemaPath) => {
        clientName(schemaPath.name, {
          message: 'Please enter a valid name',
          minLength: 2,
          maxLength: 100,
        });
      })
    );
  });

  // Tests basic name format
  it('should accept simple name', () => {
    testForm.name().value.set('John Doe');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests single word names
  it('should accept single word name', () => {
    testForm.name().value.set('Madonna');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests Spanish accented characters
  it('should accept Spanish name with accents', () => {
    testForm.name().value.set('José García');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests Spanish ñ character
  it('should accept name with ñ', () => {
    testForm.name().value.set('María Muñoz');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests multiple Spanish diacritics
  it('should accept name with multiple Spanish characters', () => {
    testForm.name().value.set('Ángel López');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests hyphenated names
  it('should accept hyphenated name', () => {
    testForm.name().value.set('Jean-Luc Picard');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests apostrophes in names
  it('should accept name with apostrophe', () => {
    testForm.name().value.set("O'Brien");
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests compound Spanish names
  it('should accept compound Spanish name', () => {
    testForm.name().value.set('María José');
    expect(testForm.name().valid()).toBe(true);
  });

  // Empty string validation is delegated to required validator
  it('should accept empty string (handled by required validator)', () => {
    testForm.name().value.set('');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests rejection of numeric characters
  it('should reject name with numbers', () => {
    testForm.name().value.set('John123');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests rejection of special characters
  it('should reject name with special characters', () => {
    testForm.name().value.set('John@Doe');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests XSS attack prevention
  it('should reject name with HTML tags (XSS attempt)', () => {
    testForm.name().value.set('<script>alert("xss")</script>');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests SQL injection prevention
  it('should reject name with SQL injection attempt', () => {
    testForm.name().value.set("Robert'; DROP TABLE users--");
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests rejection of leading whitespace
  it('should reject name starting with space', () => {
    testForm.name().value.set(' John Doe');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests rejection of trailing whitespace
  it('should reject name ending with space', () => {
    testForm.name().value.set('John Doe ');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests rejection of leading hyphen
  it('should reject name starting with hyphen', () => {
    testForm.name().value.set('-John');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests rejection of trailing hyphen
  it('should reject name ending with hyphen', () => {
    testForm.name().value.set('John-');
    expect(testForm.name().valid()).toBe(false);
  });

  // Tests minimum length enforcement
  it('should reject name shorter than minimum length', () => {
    testForm.name().value.set('J');
    expect(testForm.name().valid()).toBe(false);
    expect(testForm.name().errors()[0].message).toContain('at least 2 characters');
  });

  // Tests minimum length boundary
  it('should accept name at minimum length', () => {
    testForm.name().value.set('Jo');
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests maximum length boundary
  it('should accept name at maximum length', () => {
    const longName = 'A'.repeat(100);
    testForm.name().value.set(longName);
    expect(testForm.name().valid()).toBe(true);
  });

  // Tests maximum length enforcement
  it('should reject name exceeding maximum length', () => {
    const tooLongName = 'A'.repeat(101);
    testForm.name().value.set(tooLongName);
    expect(testForm.name().valid()).toBe(false);
    expect(testForm.name().errors()[0].message).toContain('must not exceed 100 characters');
  });
});

describe('Validator Integration', () => {
  // Tests all validators working together in single form
  it('should validate complete form with all custom validators', () => {
    const model = signal({
      name: '',
      phone: '',
      email: '',
    });

    const testForm = TestBed.runInInjectionContext(() =>
      form(model, (schemaPath) => {
        clientName(schemaPath.name, {
          message: 'Invalid name',
          minLength: 2,
          maxLength: 100,
        });
        spanishPhone(schemaPath.phone, {
          message: 'Invalid phone',
        });
        enhancedEmail(schemaPath.email, {
          message: 'Invalid email',
        });
      })
    );

    testForm.name().value.set('José García');
    testForm.phone().value.set('666777888');
    testForm.email().value.set('jose@example.com');

    expect(testForm().valid()).toBe(true);
    expect(testForm.name().valid()).toBe(true);
    expect(testForm.phone().valid()).toBe(true);
    expect(testForm.email().valid()).toBe(true);
  });

  // Tests individual field validation in multi-field form
  it('should correctly identify which field is invalid in a multi-field form', () => {
    const model = signal({
      name: 'Valid Name',
      phone: '12345',
      email: 'valid@example.com',
    });

    const testForm = TestBed.runInInjectionContext(() =>
      form(model, (schemaPath) => {
        clientName(schemaPath.name, { message: 'Invalid name' });
        spanishPhone(schemaPath.phone, { message: 'Invalid phone' });
        enhancedEmail(schemaPath.email, { message: 'Invalid email' });
      })
    );

    expect(testForm().invalid()).toBe(true);
    expect(testForm.name().valid()).toBe(true);
    expect(testForm.phone().invalid()).toBe(true);
    expect(testForm.email().valid()).toBe(true);
    expect(testForm.phone().errors()).toHaveLength(1);
    expect(testForm.phone().errors()[0].message).toBe('Invalid phone');
  });
});
