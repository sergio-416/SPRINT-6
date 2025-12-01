import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  imports: [],
  templateUrl: './help-modal.html',
  styleUrl: './help-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpModal {
  title = input.required<string>();
  content = input.required<string>();
  isOpen = signal(false);

  constructor() {
    effect(() => {
      const dialogElement = document.querySelector('dialog');
      if (dialogElement) {
        if (this.isOpen()) {
          dialogElement.showModal();
        } else {
          dialogElement.close();
        }
      }
    });
  }

  close(): void {
    this.isOpen.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    const dialogElement = event.target as HTMLDialogElement;
    const rect = dialogElement.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      this.close();
    }
  }
}
