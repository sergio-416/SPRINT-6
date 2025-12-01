import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpModal } from './help-modal';

describe('HelpModal', () => {
  let component: HelpModal;
  let fixture: ComponentFixture<HelpModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpModal],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Default Test Title');
    fixture.componentRef.setInput('content', 'Default test content');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal initially when isOpen is false', () => {
    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should show modal when isOpen signal is set to true', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('dialog');
    expect(dialog.hasAttribute('open')).toBe(true);
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Help Title');
    component.isOpen.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('[data-testid="modal-title"]');
    expect(titleElement.textContent).toContain('Test Help Title');
  });

  it('should render content when provided', () => {
    fixture.componentRef.setInput('content', 'This is test help content');
    component.isOpen.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const contentElement = compiled.querySelector('[data-testid="modal-content"]');
    expect(contentElement.textContent).toContain('This is test help content');
  });

  it('should close modal when backdrop is clicked', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('dialog');
    const rect = dialog.getBoundingClientRect();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: rect.right + 10,
      clientY: rect.top,
    });

    Object.defineProperty(clickEvent, 'currentTarget', {
      writable: false,
      value: dialog,
    });

    dialog.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should not close modal when content area is clicked', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('dialog');
    const rect = dialog.getBoundingClientRect();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    });

    Object.defineProperty(clickEvent, 'currentTarget', {
      writable: false,
      value: dialog,
    });

    dialog.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(dialog.hasAttribute('open')).toBe(true);
  });
});
