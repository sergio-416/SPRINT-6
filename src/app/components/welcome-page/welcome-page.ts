// Welcome page component - landing page with navigation to budget calculator
// Standalone component with OnPush change detection - template in welcome-page.html
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  imports: [],
  templateUrl: './welcome-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {
  // Router service for programmatic navigation
  private router = inject(Router);

  // Navigates to /budget route when "Get Started" button clicked
  navigateToBudget(): void {
    this.router.navigate(['/budget']);
  }
}
