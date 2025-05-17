# Context Testing

This directory contains automated tests for React contexts using Jest and React Testing Library.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To run tests for a specific context:

```bash
npm test -- LoadingContext
```

## Testing Approach

The tests in this directory follow these principles:

1. **Context Isolation**: Contexts are tested in isolation from their dependencies using mocks.
2. **Behavior Testing**: Tests focus on context behavior rather than implementation details.
3. **User Interaction**: Tests simulate user interactions to verify context behavior.
4. **Time-based Testing**: For contexts with time-based behavior, Jest's timer mocking is used.

## Test Structure

Each test file typically includes:

1. **Unit Tests**: Testing individual context functionality in isolation
2. **Integration Tests**: Testing context interaction with components that consume it
3. **Edge Cases**: Testing boundary conditions and special cases

## Example Tests

### LoadingContext.test.tsx

The `LoadingContext.test.tsx` file demonstrates:

- Testing the initial state of the context
- Testing the showLoading and hideLoading functions
- Testing the minimum loading time feature
- Testing the cancellation of hideLoading timeout when showLoading is called
- Using Jest's timer mocking to control time-based behavior
