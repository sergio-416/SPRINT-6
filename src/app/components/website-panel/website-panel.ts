// Website configuration panel component - manages pages and languages inputs
// Standalone component with OnPush detection - template in website-panel.html
// Used in products-form.html when web service selected
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { HelpModal } from '../help-modal/help-modal';
import { HELP_CONTENT } from '../../constants/help-content';

@Component({
  selector: 'app-website-panel',
  imports: [Field, HelpModal],
  templateUrl: './website-panel.html',
  styleUrl: './website-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePanel {
  // Receives FieldTree from parent products-form.ts containing Signal Forms fields
  webConfigFields =
    input.required<FieldTree<{ selected: boolean; pages: number; languages: number }>>();

  // Help content constants from help-content.ts
  readonly helpContent = HELP_CONTENT;

  // ViewChild references to help modal instances
  pagesModal = viewChild.required<HelpModal>('pagesModal');
  languagesModal = viewChild.required<HelpModal>('languagesModal');

  // Increments pages value by 1 - no upper limit
  incrementPages(): void {
    const currentValue = this.webConfigFields().pages().value();
    this.webConfigFields()
      .pages()
      .value.set(currentValue + 1);
  }

  // Decrements pages value by 1 - minimum value is 1
  decrementPages(): void {
    const currentValue = this.webConfigFields().pages().value();
    if (currentValue > 1) {
      this.webConfigFields()
        .pages()
        .value.set(currentValue - 1);
    }
  }

  // Increments languages value by 1 - no upper limit
  incrementLanguages(): void {
    const currentValue = this.webConfigFields().languages().value();
    this.webConfigFields()
      .languages()
      .value.set(currentValue + 1);
  }

  // Decrements languages value by 1 - minimum value is 1
  decrementLanguages(): void {
    const currentValue = this.webConfigFields().languages().value();
    if (currentValue > 1) {
      this.webConfigFields()
        .languages()
        .value.set(currentValue - 1);
    }
  }

  // Opens pages help modal by setting isOpen signal to true
  openPagesHelp(): void {
    this.pagesModal().isOpen.set(true);
  }

  // Opens languages help modal by setting isOpen signal to true
  openLanguagesHelp(): void {
    this.languagesModal().isOpen.set(true);
  }
}
