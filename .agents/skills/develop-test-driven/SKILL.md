---
name: develop-test-driven
description: Develop software using a test-driven approach. Use when asked to write tests, implement features based on tests, or follow TDD practices.
---

## Coding cycle

The TDD steps vary somewhat by author in count and description, but are generally as follows. These are based on the book Test-Driven Development by Example, and Kent Beck's Canon TDD article.

1. List scenarios for the new feature
List the expected variants in the new behavior. "There's the basic case & then what-if this service times out & what-if the key isn't in the database yet &…" The developer can discover these specifications by asking about use cases and user stories. A key benefit of TDD is that it makes the developer focus on requirements before writing code. This is in contrast with the usual practice, where unit tests are only written after code.
2. Write a test for an item on the list
Write an automated test that would pass if the variant in the new behavior is met.
3. Run all tests. The new test should fail – for expected reasons
This shows that new code is actually needed for the desired feature. It validates that the test harness is working correctly. It rules out the possibility that the new test is flawed and will always pass.
4. Write the simplest code that passes the new test
Inelegant code and hard coding is acceptable. The code will be honed in Step 6. No code should be added beyond the tested functions.
5. All tests should now pass
If any fail, fix failing tests with minimal changes until all pass.
6. Refactor as needed while ensuring all tests continue to pass
Code is refactored for readability and maintainability. In particular, hard-coded test data should be removed from the production code. Running the test suite after each refactor ensures that no existing function is broken. Examples of refactoring:
moving code to where it most logically belongs
removing duplicate code
making names self-documenting
splitting methods into smaller pieces
re-arranging inheritance hierarchies

### Repeat

Repeat the process, starting at step 2, with each test on the list until all tests are implemented and passing.

### Test size

Each tests should be small and commits made often. If new code fails some tests, the programmer can undo or revert rather than debug excessively.

### External libraries

When using external libraries, it is important not to write tests that are so small as to effectively test that library only, unless there is reason to believe that the library is buggy or too feature-poor to serve all needs of the software under development.
