# Testing

See also: [testing-arrange-act-assert-adjust.md](./testing-arrange-act-assert-adjust.md) for how to structure the body of an individual test (Arrange-Act-Assert-Adjust).

## Test definition

Tests should be defined using the following pattern:

```javascript
it('should adhere to some conditions', () => {
  // test body
})
```

## Single expectation per test

Tests should check for a single condition where possible. In practice, that means a single `expect()` call — which may itself compare a whole object or array in one go (e.g. `toEqual`/`toMatchObject`) — rather than several independent, unrelated checks bundled into one test.

```javascript
it('should adhere to condition A', () => {
  const result = testedFunction()

  expect(checkConditionA(result)).toBe(true)
})
```

### Rewrite coupled tests

Coupled tests (ones having multiple expectations) can be rewritten into more useful, decoupled groups of tests with little overhead and without the loss of readability.

### Examples

#### Bad

```javascript
it('should return expected value', () => {
  const data = {
    a: 10,
    b: 'blue',
    c: true,
  }

  const result = testedFunction(data)

  expect(result).toHaveProperty('a', 10)
  expect(result).toHaveProperty('b', 'blue')
  expect(result).toHaveProperty('c', true)
})
```

A single test has a lot of expectations, making it less informative if it fails:
- we know that an expectation failed;
- we might know which one;
- we're not sure if it is the only one that would fail;
- the description of the failing test doesn't tell us specifically what failed.

#### Less bad

```javascript
describe('testedFunction()', () => {
  it('should return a value with property "a" set to 10', () => {
    const data = {
      a: 10,
      b: 'blue',
      c: true,
    }

    const result = testedFunction(data)

    expect(result).toHaveProperty('a', 10)
  })

  it('should return a value with property "b" set to "blue"', () => {
    const data = {
      a: 10,
      b: 'blue',
      c: true,
    }

    const result = testedFunction(data)

    expect(result).toHaveProperty('b', 'blue')
  })

  it('should return a value with property "c" set to true', () => {
    const data = {
      a: 10,
      b: 'blue',
      c: true,
    }

    const result = testedFunction(data)

    expect(result).toHaveProperty('c', true)
  })
})
```

Each expectation has its own test, but there is a lot of redundancy in test setup and execution.

#### Almost good

```javascript
it('should return the expected value', () => {
  const data = {
    a: 10,
    b: 'blue',
    c: true,
  }

  const result = testedFunction(data)

  expect(result).toEqual({ a: 10, b: 'blue', c: true })
})
```

A single `expect()` call checking the whole object is still one expectation, so this doesn't violate "single expectation per test" the way the "Bad" example does, and most test runners print a full diff between the expected and received objects on failure, so you're not left guessing. It's an acceptable shortcut when the properties are one cohesive fact (e.g. "this is the shape of the returned object") rather than independent conditions. The tradeoff versus the "Good" example below: the test description ("should return the expected value") is less specific than "should have property 'b' set to 'blue'", so a failure tells you *that* the object was wrong, not *which part* of it was wrong without reading the diff.

#### Good

```javascript
describe('testedFunction()', () => {
  describe('returned value', () => {
    const data = {
      a: 10,
      b: 'blue',
      c: true,
    }

    const result = testedFunction(data)

    it('should have property "a" set to 10', () => {
      expect(result).toHaveProperty('a', 10)
    })

    it('should have property "b" set to "blue"', () => {
      expect(result).toHaveProperty('b', 'blue')
    })

    it('should have property "c" set to true', () => {
      expect(result).toHaveProperty('c', true)
    })
  })
})
```

Each expectation has its own test and setup is not redundant, while remaining descriptive and informative. Whichever test fails here, will point us in a direction of exactly what failed.

This shape — computing `result` once, directly in the `describe` body — only works when `testedFunction` is synchronous and pure. If it's async and/or has side effects (an API client, a function touching mocks or shared state), do the shared arrange in `beforeEach` instead:

```javascript
describe('testedFunction()', () => {
  describe('returned value', () => {
    const data = {
      a: 10,
      b: 'blue',
      c: true,
    }
    let result

    beforeEach(async () => {
      result = await testedFunction(data)
    })

    it('should have property "a" set to 10', () => {
      expect(result).toHaveProperty('a', 10)
    })

    it('should have property "b" set to "blue"', () => {
      expect(result).toHaveProperty('b', 'blue')
    })

    it('should have property "c" set to true', () => {
      expect(result).toHaveProperty('c', true)
    })
  })
})
```

`beforeEach` re-runs the arrange step fresh before every test, which matters if `testedFunction` mutates anything the tests can observe, and it's `async`-safe in every major test runner — unlike an `async describe` body, which not every runner honors the same way.
