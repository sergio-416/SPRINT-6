import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebsitePanel } from './website-panel';
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';

describe('WebsitePanel', () => {
  let component: WebsitePanel;
  let fixture: ComponentFixture<WebsitePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsitePanel);
    component = fixture.componentInstance;

    const mockModel = signal({
      pages: 1,
      languages: 1,
      selected: true,
    });

    const mockForm = TestBed.runInInjectionContext(() => form(mockModel));

    fixture.componentRef.setInput('webConfigFields', mockForm);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render pages input field', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');
    expect(pagesInput).not.toBeNull();
  });

  it('should render languages input field', () => {
    const compiled = fixture.nativeElement;
    const languagesInput = compiled.querySelector('[data-testid="languages-input"]');
    expect(languagesInput).not.toBeNull();
  });

  it('should display current pages value', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');
    expect(pagesInput.value).toBe('1');
  });

  it('should display current languages value', () => {
    const compiled = fixture.nativeElement;
    const languagesInput = compiled.querySelector('[data-testid="languages-input"]');
    expect(languagesInput.value).toBe('1');
  });

  it('should render increment button for pages', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="pages-increment"]');
    expect(incrementButton).not.toBeNull();
  });

  it('should render decrement button for pages', () => {
    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');
    expect(decrementButton).not.toBeNull();
  });

  it('should increment pages when increment button is clicked', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="pages-increment"]');

    incrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(2);
  });

  it('should decrement pages when decrement button is clicked', () => {
    component.webConfigFields().pages().value.set(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(4);
  });

  it('should not decrement pages below 1', () => {
    component.webConfigFields().pages().value.set(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="pages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(1);
  });

  it('should increment languages when increment button is clicked', () => {
    const compiled = fixture.nativeElement;
    const incrementButton = compiled.querySelector('[data-testid="languages-increment"]');

    incrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().languages().value()).toBe(2);
  });

  it('should not decrement languages below 1', () => {
    component.webConfigFields().languages().value.set(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const decrementButton = compiled.querySelector('[data-testid="languages-decrement"]');

    decrementButton.click();
    fixture.detectChanges();

    expect(component.webConfigFields().languages().value()).toBe(1);
  });

  it('should update pages value when input changes', () => {
    const compiled = fixture.nativeElement;
    const pagesInput = compiled.querySelector('[data-testid="pages-input"]');

    pagesInput.value = '10';
    pagesInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.webConfigFields().pages().value()).toBe(10);
  });

  it('should render help button for pages', () => {
    const compiled = fixture.nativeElement;
    const helpButton = compiled.querySelector('[data-testid="pages-help-button"]');
    expect(helpButton).not.toBeNull();
  });

  it('should render help button for languages', () => {
    const compiled = fixture.nativeElement;
    const helpButton = compiled.querySelector('[data-testid="languages-help-button"]');
    expect(helpButton).not.toBeNull();
  });
});
