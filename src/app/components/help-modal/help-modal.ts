// Help modal component - reusable modal dialog for contextual help
// Standalone component with OnPush detection - template in help-modal.html
// Used in website-panel.html for pages and languages help tooltips
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-help-modal',
  imports: [],
  templateUrl: './help-modal.html',
  styleUrl: './help-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpModal {
  // Input signals for modal title and content text
  title = input.required<string>();
  content = input.required<string>();
  // Signal controlling modal open/close state
  isOpen = signal(false);

  // ViewChild reference to native dialog element
  private dialogElement = viewChild<ElementRef<HTMLDialogElement>>('dialogElement');

  constructor() {
    // Effect: Opens/closes native dialog when isOpen signal changes
    effect(() => {
      const dialog = this.dialogElement()?.nativeElement;
      if (dialog) {
        if (this.isOpen()) {
          // Uses showModal() for native modal behavior with backdrop
          if (typeof dialog.showModal === 'function') {
            dialog.showModal();
          } else {
            // Fallback for environments without showModal support
            dialog.setAttribute('open', '');
          }
        } else {
          // Closes dialog and removes from top layer
          if (typeof dialog.close === 'function') {
            dialog.close();
          } else {
            // Fallback for environments without close support
            dialog.removeAttribute('open');
          }
        }
      }
    });
  }

  // Closes modal by setting isOpen signal to false
  close(): void {
    this.isOpen.set(false);
  }

  // Handles backdrop clicks - closes modal if clicked outside content area
  // Calculates click position relative to dialog boundaries
  onBackdropClick(event: MouseEvent): void {
    const dialog = event.currentTarget as HTMLDialogElement;
    const rect = dialog.getBoundingClientRect();

    // Checks if click is within dialog content boundaries
    const clickedInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    // Closes modal if clicked outside content (on backdrop)
    if (!clickedInDialog) {
      this.close();
    }
  }
}
