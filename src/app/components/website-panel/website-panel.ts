import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-website-panel',
  imports: [Field],
  templateUrl: './website-panel.html',
  styleUrl: './website-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsitePanel {
  webConfigFields =
    input.required<FieldTree<{ selected: boolean; pages: number; languages: number }>>();

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
}
