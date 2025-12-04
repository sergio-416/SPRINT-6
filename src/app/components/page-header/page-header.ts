// Page header component - simple presentational component
// Standalone component with OnPush detection - template in page-header.html
// Used in products-form.html
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {}
