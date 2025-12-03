import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {
  private router = inject(Router);

  navigateToBudget(): void {
    this.router.navigate(['/budget']);
  }
}
