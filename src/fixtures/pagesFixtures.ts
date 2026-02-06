// import { test as base, expect } from '@playwright/test';
// import { PlaywrightBrowserAction } from '../lib/uiAction/browserAction.playwright';
// type Fixtures = {
//     browserAction: PlaywrightBrowserAction;
//     signupPage: SignupPage;
// };

// export const test = base.extend<Fixtures>({
//     browserAction: async ({ page }, use) => {
//         const browserAction = new PlaywrightBrowserAction(page);
//         await use(browserAction);
//     },

//     signupPage: async ({ browserAction }, use) => {
//         const signupPage = new SignupPage(browserAction);
//         await use(signupPage);
//     },
// });

// export { expect };

// export default test;

