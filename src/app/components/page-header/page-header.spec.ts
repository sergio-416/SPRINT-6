// Unit tests for PageHeader component
// Basic component creation test - references page-header.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeader } from './page-header';

describe('PageHeader', () => {
  let component: PageHeader;
  let fixture: ComponentFixture<PageHeader>;

  // Sets up test environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Verifies component instantiates correctly
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
