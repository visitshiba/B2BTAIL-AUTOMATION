// import test, { expect } from "@playwright/test";
// import { TestDataFactory } from "../utils/testDataFactory";
// import { VALID_USER } from "../testdata/signIn.data";
// import { SIGN_IN_PAGE_CONSTANTS } from "../constants/signInPage.const";
// import { PlaywrightBrowserAction } from "../lib/uiAction/PlaywrightBrowserAction";
// import { SignInPage } from "../pages/signIn.page";

// test.describe('Verify Sign In functionality1', () => {
//     let signInPage: SignInPage;

//     test.beforeEach(async ({ page }) => {
//         const browserAction = new PlaywrightBrowserAction(page);
//         signInPage = new SignInPage(browserAction);
//         await signInPage.openApplication();
//     });

//     test.afterEach(async () => {
//         await signInPage.closeApplication();
//     });

//     test('Valid User1', async () => {
//         await signInPage.signInToApplication(VALID_USER.email, VALID_USER.password);
//         expect(await signInPage.getCompanyLable()).toBe(SIGN_IN_PAGE_CONSTANTS.CompanyLable);
//     });

//     test('Invalid User1', async () => {
//         const user = TestDataFactory.generateAccountInformation();
//         const email = TestDataFactory.generateEmail();
//         await signInPage.signInToApplication(email, user.password);
//         expect(await signInPage.isInvalidCredentialErrorMessageVisible()).toBe(true);
//     });

//     const invalidEmailCases = [
//         { type: 'no_at', description: 'missing @ symbol' },
//         { type: 'no_domain', description: 'missing domain' },
//         { type: 'missing_tld', description: 'missing top-level domain' },
//         { type: 'double_at', description: 'double @ symbols' },
//         { type: 'leading_dot', description: 'leading dot in local part' },
//         { type: 'trailing_dot', description: 'trailing dot in local part' },
//         { type: 'special_chars', description: 'invalid characters in domain' },
//     ] as const;

//     for (const { type, description } of invalidEmailCases) {
//         test(`Invalid Email1 - ${description}`, async () => {
//             const email = TestDataFactory.generateInvalidEmail(type);
//             const user = TestDataFactory.generateAccountInformation();
//             await signInPage.signInToApplication(email, user.password);
//             expect(
//                 await signInPage.isInvalidEmailErrorMessageVisible()
//             ).toBe(true);
//         });
//     }

//     test(`Invalid Password1 - contains only spaces`, async () => {
//         const email = TestDataFactory.generateEmail();
//         const password = TestDataFactory.generateInvalidPassword('spaces_only');
//         await signInPage.signInToApplication(email, password);
//         expect(
//             await signInPage.isInvalidPasswordErrorMessageVisible()
//         ).toBe(true);
//     });

//     test(`Forgot your Password1`, async () => {
//         const email = TestDataFactory.generateEmail();
//         await signInPage.clickForgotPasswordLink();
//         await signInPage.enterEmail(email);
//         await signInPage.clickSendLinkButton();
//         expect(await signInPage.getForgetPasswordNotification()).toBe(SIGN_IN_PAGE_CONSTANTS.ForgotPasswordNotification);
//     });

//     test('Reset Password Screen1: "Sign In" link navigates user back to Auth login', async () => {
//         await signInPage.clickForgotPasswordLink();
//         await signInPage.clickSignInLink();
//         expect(
//             await signInPage.isUserOnSignInScreen()
//         ).toBe(true);
//     })

//     test('Toggle Show/Hide Password1', async () => {
//         const user = TestDataFactory.generateAccountInformation();
//         await signInPage.enterPassword(user.password);
//         await signInPage.toggleShowHidePassword();
//         expect(await signInPage.isPasswordVisible()).toBe(true);
//     })
// });
