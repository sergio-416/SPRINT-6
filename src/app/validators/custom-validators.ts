// Custom form validators for Spanish phone numbers, enhanced email, and client names
// Used in products-form.ts for form validation
import { validate } from '@angular/forms/signals';

// Validates Spanish mobile phone numbers (9 digits starting with 6 or 7)
// Accepts spaces and dashes as separators - extracts digits only for validation
export function spanishPhone<T>(path: any, options: { message: string }): void {
  validate(path, ({ value }) => {
    const phoneValue = value() as string;

    // Empty values pass validation - handled by required validator
    if (!phoneValue) {
      return null;
    }

    // Removes all non-digit characters for validation
    const digitsOnly = phoneValue.replace(/\D/g, '');
    // Spanish mobile format: exactly 9 digits, first digit must be 6 or 7
    const isValid = digitsOnly.length === 9 && (digitsOnly[0] === '6' || digitsOnly[0] === '7');

    if (!isValid) {
      return {
        kind: 'spanishPhone',
        message: options.message,
      };
    }

    return null;
  });
}

// Enhanced email validator with typo detection and format validation
// Detects common domain typos (gmial, yahooo, etc.) and invalid patterns
export function enhancedEmail<T>(path: any, options: { message: string }): void {
  validate(path, ({ value }) => {
    const emailValue = value() as string;

    // Empty values pass validation - handled by required validator
    if (!emailValue) {
      return null;
    }

    // Normalizes to lowercase and removes whitespace
    const email = emailValue.trim().toLowerCase();
    // Basic email format: alphanumeric + dots/hyphens @ domain with 2+ char TLD
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    if (!emailRegex.test(email)) {
      return {
        kind: 'enhancedEmail',
        message: options.message,
      };
    }

    // List of common email domain typos to catch user mistakes
    const commonTypos = [
      'gmial.com',
      'gmai.com',
      'gmil.com',
      'yahooo.com',
      'yaho.com',
      'hotmial.com',
      'outlok.com',
    ];

    const domain = email.split('@')[1];
    if (commonTypos.includes(domain)) {
      return {
        kind: 'enhancedEmail',
        message: 'Email domain appears to have a typo. Please verify.',
      };
    }

    // Rejects consecutive dots which are invalid in email addresses
    if (email.includes('..')) {
      return {
        kind: 'enhancedEmail',
        message: 'Email format is invalid (consecutive dots detected).',
      };
    }

    return null;
  });
}

// Validates client names with Spanish character support and length constraints
// Allows letters, spaces, hyphens, apostrophes - prevents XSS and SQL injection
export function clientName<T>(
  path: any,
  options: { message: string; minLength?: number; maxLength?: number }
): void {
  validate(path, ({ value }) => {
    const nameValue = value() as string;

    // Empty values pass validation - handled by required validator
    if (!nameValue) {
      return null;
    }

    // Rejects leading/trailing whitespace
    if (nameValue !== nameValue.trim()) {
      return {
        kind: 'clientName',
        message: options.message,
      };
    }

    const trimmed = nameValue.trim();

    // Enforces minimum length if specified
    if (options.minLength && trimmed.length < options.minLength) {
      return {
        kind: 'clientName',
        message: `Name must be at least ${options.minLength} characters`,
      };
    }

    // Enforces maximum length if specified
    if (options.maxLength && trimmed.length > options.maxLength) {
      return {
        kind: 'clientName',
        message: `Name must not exceed ${options.maxLength} characters`,
      };
    }

    // Pattern allows: letters (including Spanish), spaces, hyphens, apostrophes
    // Must start and end with letter - prevents XSS/SQL injection attempts
    const namePattern = /^[a-zA-ZÀ-ÿ]([a-zA-ZÀ-ÿ\s'-]*[a-zA-ZÀ-ÿ])?$/;

    if (!namePattern.test(trimmed)) {
      return {
        kind: 'clientName',
        message: options.message,
      };
    }

    return null;
  });
}
