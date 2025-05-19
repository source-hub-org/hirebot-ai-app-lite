# Component Testing

This directory contains automated tests for React components using Jest and React Testing Library.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To run tests for a specific component:

```bash
npm test -- LoadingComponent
```

## Testing Approach

The tests in this directory follow these principles:

1. **Component Isolation**: Components are tested in isolation from their dependencies using mocks.
2. **Behavior Testing**: Tests focus on component behavior rather than implementation details.
3. **Accessibility**: Tests verify that components are accessible by using proper ARIA attributes and roles.
4. **User Interaction**: Tests simulate user interactions to verify component behavior.

## Test Structure

Each test file typically includes:

1. **Unit Tests**: Testing individual component functionality in isolation
2. **Integration Tests**: Testing component interaction with its context or other components
3. **Snapshot Tests**: Ensuring UI consistency (when appropriate)

## Example

The `LoadingComponent.test.tsx` file demonstrates:

- Mocking the LoadingContext to test different loading states
- Testing that the component renders nothing when not loading
- Testing that the component renders the loading overlay when loading
- Testing the structure and styling of the component
- Integration testing with a custom provider
