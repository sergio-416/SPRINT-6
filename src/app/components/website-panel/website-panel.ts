import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { HelpModal } from '../help-modal/help-modal';

@Component({
  selector: 'app-website-panel',
  imports: [Field, HelpModal],
  templateUrl: './website-panel.html',
  styleUrl: './website-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePanel {
  webConfigFields =
    input.required<FieldTree<{ selected: boolean; pages: number; languages: number }>>();

  pagesModal = viewChild.required<HelpModal>('pagesModal');
  languagesModal = viewChild.required<HelpModal>('languagesModal');

  incrementPages(): void {
    const currentValue = this.webConfigFields().pages().value();
    this.webConfigFields()
      .pages()
      .value.set(currentValue + 1);
  }

  decrementPages(): void {
    const currentValue = this.webConfigFields().pages().value();
    if (currentValue > 1) {
      this.webConfigFields()
        .pages()
        .value.set(currentValue - 1);
    }
  }

  incrementLanguages(): void {
    const currentValue = this.webConfigFields().languages().value();
    this.webConfigFields()
      .languages()
      .value.set(currentValue + 1);
  }

  decrementLanguages(): void {
    const currentValue = this.webConfigFields().languages().value();
    if (currentValue > 1) {
      this.webConfigFields()
        .languages()
        .value.set(currentValue - 1);
    }
  }

  openPagesHelp(): void {
    this.pagesModal().isOpen.set(true);
  }

  openLanguagesHelp(): void {
    this.languagesModal().isOpen.set(true);
  }
}
