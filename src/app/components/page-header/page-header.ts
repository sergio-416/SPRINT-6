import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {}
