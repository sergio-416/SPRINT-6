// Unit tests for WebsitePanel component
// Tests increment/decrement controls and help modal triggers - references website-panel.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebsitePanel } from './website-panel';
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';

describe('WebsitePanel', () => {
  let component: WebsitePanel;
  let fixture: ComponentFixture<WebsitePanel>;

  // Sets up test environment with mock Signal Forms before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsitePanel);
    component = fixture.componentInstance;

    // Creates mock webConfig form with initial values
    const mockModel = signal({
      pages: 1,
      languages: 1,
      selected: true,
    });

    const mockForm = TestBed.runInInjectionContext(() => form(mockModel));

    fixture.componentRef.setInput('webConfigFields', mockForm);
    fixture.detectChanges();
  });

  // Verifies component instantiates correctly
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Tests pages input field renders
  it('should render pages input field', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');
    expect(pagesInput).not.toBeNull();
  });

  // Tests languages input field renders
  it('should render languages input field', () => {
    const compiled = fixture.nativeElement;
    const languagesInput = compiled.querySelector('[data-testid="languages-input"]');
    expect(languagesInput).not.toBeNull();
  });

  // Tests pages input displays current value
  it('should display current pages value', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');
    expect(pagesInput.value).toBe('1');
  });

  // Tests languages input displays current value
  it('should display current languages value', () => {
    const compiled = fixture.nativeElement;
    const languagesInput = compiled.querySelector('[data-testid="languages-input"]');
    expect(languagesInput.value).toBe('1');
  });

  // Tests pages increment button renders
  it('should render increment button for pages', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="pages-increment"]');
    expect(incrementButton).not.toBeNull();
  });

  // Tests pages decrement button renders
  it('should render decrement button for pages', () => {
    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');
    expect(decrementButton).not.toBeNull();
  });

  // Tests incrementPages() increases value by 1
  it('should increment pages when increment button is clicked', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="pages-increment"]');

    incrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(2);
  });

  // Tests decrementPages() decreases value by 1
  it('should decrement pages when decrement button is clicked', () => {
    component.webConfigFields().pages().value.set(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(4);
  });

  // Tests minimum value boundary - cannot go below 1
  it('should not decrement pages below 1', () => {
    component.webConfigFields().pages().value.set(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(1);
  });

  // Tests incrementLanguages() increases value by 1
  it('should increment languages when increment button is clicked', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="languages-increment"]');

    incrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().languages().value()).toBe(2);
  });

  // Tests minimum value boundary for languages - cannot go below 1
  it('should not decrement languages below 1', () => {
    component.webConfigFields().languages().value.set(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="languages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().languages().value()).toBe(1);
  });

  // Tests direct input changes update Signal Forms value
  it('should update pages value when input changes', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');

    pagesInput.value = '10';
    pagesInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(10);
  });

  // Tests pages help button renders
  it('should render help button for pages', () => {
    const compiled = fixture.nativeElement;
    const helpButton = compiled.querySelector('[data-testid="pages-help-button"]');
    expect(helpButton).not.toBeNull();
  });

  // Tests languages help button renders
  it('should render help button for languages', () => {
    const compiled = fixture.nativeElement;
    const helpButton = compiled.querySelector('[data-testid="languages-help-button"]');
    expect(helpButton).not.toBeNull();
  });
});
