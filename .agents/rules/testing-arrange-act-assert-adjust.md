# Rule: Testing Pattern (AAAA)

## Context
When writing or refactoring automated tests, always follow the **AAAA (Arrange-Act-Assert-Adjust)** pattern. This pattern maps 1-to-1 to the classic SEVT (Setup, Exercise, Verify, Teardown) lifecycle.

## The AAAA Lifecycle

1. **Arrange** (Setup): Prepare the system, dependencies, mocks, and test data.
2. **Act** (Exercise): Execute the specific production code or behavior being tested.
3. **Assert** (Verify): Check that the outcome and side effects match expectations.
4. **Adjust** (Teardown): Undo changes, release resources, and return the system to its baseline.

Every test should clearly separate whichever of these phases it has into blank-line-delimited blocks, in the order above. Not every test needs all four — a pure function with no side effects has no Adjust, and a test with no per-test setup beyond shared hooks may have no Arrange of its own. What matters is that the phases present appear in this order, each visually separated.

The `// Arrange` / `// Act` / `// Assert` / `// Adjust` comments in the examples below are there to teach which block is which — they are **not** required in your actual tests. Blank lines between blocks are enough; don't add the labels as boilerplate to every test you write.

## Implementation Guidelines
To prevent failing assertions from skipping the **Adjust** phase (early exit risk), strictly adhere to the following two implementation strategies. **Do not** use custom disposable wrappers or magic lifecycle objects.

### 1. Inline Cleanup (Single Test)
Use an explicit `try-finally` block. Put the **Arrange** logic inside or right before the `try` block, and place the **Adjust** logic exclusively in the `finally` block to guarantee it always runs.

```javascript
// Example: Inline AAAA via try-finally
// 1. ARRANGE
const originalFlag = Features.isEnabled("NewDashboard");
Features.set("NewDashboard", true);

try {
    // 2. ACT
    const result = Dashboard.render();

    // 3. ASSERT
    expect(result).toContain("Welcome");
} finally {
    // 4. ADJUST
    Features.set("NewDashboard", originalFlag);
}
```

### 2. Shared Cleanup (Test Suite / File)
When multiple tests require the same setup and baseline restoration, extract the **Arrange** and **Adjust** logic into the testing framework's native hooks (`beforeEach` and `afterEach`).

```javascript
// Example: Shared AAAA via Hooks
describe("Dashboard Feature", () => {
    let originalFlag;

    beforeEach(() => {
        // 1. ARRANGE (Shared)
        originalFlag = Features.isEnabled("NewDashboard");
        Features.set("NewDashboard", true);
    });

    afterEach(() => {
        // 4. ADJUST (Shared)
        Features.set("NewDashboard", originalFlag);
    });

    it("should render the welcome message", () => {
        // 2. ACT
        const result = Dashboard.render();

        // 3. ASSERT
        expect(result).toContain("Welcome");
    });
});
```

## Anti-Patterns to Avoid
* ❌ **Inline Adjust without protection**: Writing cleanup code at the bottom of a test block without a `try-finally`. If an assertion fails, the system state will remain corrupted.
* ❌ **Disposable / Context Magic**: Avoiding language-specific `using` blocks or hidden `dispose` patterns that obscure when the cleanup actually happens. Stick to explicit `try-finally` or framework hooks.
