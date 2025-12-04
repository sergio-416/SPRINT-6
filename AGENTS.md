# AGENTS.md

## Build Commands
- `npm run build` - Build the application
- `npm run test` - Run all tests (single test: `npm run test -- --run --grep "test name"`)
- `npm run test:ui` - Run tests with UI
- `npm run start` - Start dev server
- `npm run watch` - Build in watch mode

## Code Style Guidelines

### TypeScript/Angular
- Single quotes, 2-space indentation
- OnPush change detection for components
- Use signals for state management
- `input.required<>()` for required inputs
- Services: `@Injectable({ providedIn: 'root' })`

### Imports & Naming
- Angular imports first, then internal modules
- Components: PascalCase (BudgetsList)
- Services: PascalCase (Budget)
- Constants: UPPER_SNAKE_CASE (SEO_PRICE)

### Error Handling
- TypeScript strict mode enabled
- Explicit return types preferred
- Use crypto.randomUUID() for IDs