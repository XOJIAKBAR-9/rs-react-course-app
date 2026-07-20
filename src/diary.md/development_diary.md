All component tests were written using React Testing Library (RTL). Instead of inspecting internal React state or calling lifecycle methods directly, we tested the components exactly as a user interacts with them—by finding elements on the screen, simulating clicks, and typing text.
All tests are located alongside the components they test.
Service Mocking: We mocked the native globalThis.fetch function. This prevents tests from failing if the Star Wars API goes down, and makes the tests run instantly.
To run all tests, use the command `npm run test`. To see coverage `npm run test:coverage`
.husky/pre-push
What it does: A script that automatically runs npm run test:run every time you try to push code to GitHub.
