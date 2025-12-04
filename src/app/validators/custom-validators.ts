import { validate } from '@angular/forms/signals';

export function spanishPhone<T>(path: any, options: { message: string }): void {
  validate(path, ({ value }) => {
    const phoneValue = value() as string;

    if (!phoneValue) {
      return null;
    }

    const digitsOnly = phoneValue.replace(/\D/g, '');
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

export function enhancedEmail<T>(path: any, options: { message: string }): void {
  validate(path, ({ value }) => {
    const emailValue = value() as string;

    if (!emailValue) {
      return null;
    }

    const email = emailValue.trim().toLowerCase();
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    if (!emailRegex.test(email)) {
      return {
        kind: 'enhancedEmail',
        message: options.message,
      };
    }

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

    if (email.includes('..')) {
      return {
        kind: 'enhancedEmail',
        message: 'Email format is invalid (consecutive dots detected).',
      };
    }

    return null;
  });
}

export function clientName<T>(
  path: any,
  options: { message: string; minLength?: number; maxLength?: number }
): void {
  validate(path, ({ value }) => {
    const nameValue = value() as string;

    if (!nameValue) {
      return null;
    }

    if (nameValue !== nameValue.trim()) {
      return {
        kind: 'clientName',
        message: options.message,
      };
    }

    const trimmed = nameValue.trim();

    if (options.minLength && trimmed.length < options.minLength) {
      return {
        kind: 'clientName',
        message: `Name must be at least ${options.minLength} characters`,
      };
    }

    if (options.maxLength && trimmed.length > options.maxLength) {
      return {
        kind: 'clientName',
        message: `Name must not exceed ${options.maxLength} characters`,
      };
    }

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
