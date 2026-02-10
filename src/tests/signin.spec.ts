import test, { expect } from "@playwright/test";
import { TestDataFactory } from "../utils/testDataFactory";
import { VALID_USER } from "../testdata/signIn.data";
import { SIGN_IN_PAGE_CONSTANTS } from "../constants/signInPage.const";
import { PlaywrightBrowserAction } from "../lib/uiAction/PlaywrightBrowserAction";
import { SignInPage } from "../pages/signIn.page";

test.describe('Verify Sign In functionality', () => {
    let signInPage: SignInPage;

    test.beforeEach(async ({ page }) => {
        const browserAction = new PlaywrightBrowserAction(page);
        signInPage = new SignInPage(browserAction);
        await signInPage.openApplication();
    });

    test.afterEach(async () => {
        await signInPage.closeApplication();
    });

    test('Valid User', async ({ page }) => {
        // 1. Setup: Start a timer for performance validation
        const startTime = Date.now();

        // 3. Set up the listener BEFORE the action that triggers the API call
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/v1/auth/login/') && response.request().method() === 'POST'
        );

        // 3. Perform the UI action
        await signInPage.signInToApplication(VALID_USER.email, VALID_USER.password);

        // 4. Wait for the response
        const response = await responsePromise;
        const responseBody = await response.json();
        const duration = Date.now() - startTime;

        // --- ADVANCED VALIDATIONS ---

        // A. Performance Validation (Ensure login takes < 2 seconds)
        expect(duration).toBeLessThan(3000); // Adjust threshold as needed

        // B. Request Payload Validation (Verify what the UI sent to the server)
        const requestData = response.request().postDataJSON();
        expect(requestData.email).toBe(VALID_USER.email);

        // C. Security & Header Validation
        const headers = response.headers();
        expect(headers['content-type']).toContain('application/json');
        // Example: Ensure a token is present in the response if your app uses one
        // expect(headers['set-cookie'] || responseBody.token).toBeTruthy();

        // D. Data Integrity (Your original property checks)
        expect(responseBody).toMatchObject({
            employee_id: expect.anything(),
            organization_id: expect.anything(),
            username: expect.anything()
        });

        // Assertions
        expect(responseBody).toHaveProperty('employee_id');
        expect(responseBody).toHaveProperty('organization_id');
        expect(responseBody).toHaveProperty('username');
        // E. Final UI check
        expect(await signInPage.getCompanyLable()).toBe(SIGN_IN_PAGE_CONSTANTS.CompanyLable);

    });

    test('Invalid User', async () => {
        const user = TestDataFactory.generateAccountInformation();
        const email = TestDataFactory.generateEmail();
        await signInPage.signInToApplication(email, user.password);
        expect(await signInPage.isInvalidCredentialErrorMessageVisible()).toBe(true);
    });

    const invalidEmailCases = [
        { type: 'no_at', description: 'missing @ symbol' },
        { type: 'no_domain', description: 'missing domain' },
        { type: 'missing_tld', description: 'missing top-level domain' },
        { type: 'double_at', description: 'double @ symbols' },
        { type: 'leading_dot', description: 'leading dot in local part' },
        { type: 'trailing_dot', description: 'trailing dot in local part' },
        { type: 'special_chars', description: 'invalid characters in domain' },
    ] as const;

    for (const { type, description } of invalidEmailCases) {
        test(`Invalid Email - ${description}`, async () => {
            const email = TestDataFactory.generateInvalidEmail(type);
            const user = TestDataFactory.generateAccountInformation();
            await signInPage.signInToApplication(email, user.password);
            expect(
                await signInPage.isInvalidEmailErrorMessageVisible()
            ).toBe(true);
        });
    }

    test(`Invalid Password - contains only spaces`, async () => {
        const email = TestDataFactory.generateEmail();
        const password = TestDataFactory.generateInvalidPassword('spaces_only');
        await signInPage.signInToApplication(email, password);
        expect(
            await signInPage.isInvalidPasswordErrorMessageVisible()
        ).toBe(true);
    });

    test(`Forgot your Password`, async () => {
        const email = TestDataFactory.generateEmail();
        await signInPage.clickForgotPasswordLink();
        await signInPage.enterEmail(email);
        await signInPage.clickSendLinkButton();
        expect(await signInPage.getForgetPasswordNotification()).toBe(SIGN_IN_PAGE_CONSTANTS.ForgotPasswordNotification);
    });

    test('Reset Password Screen: "Sign In" link navigates user back to Auth login', async () => {
        await signInPage.clickForgotPasswordLink();
        await signInPage.clickSignInLink();
        expect(
            await signInPage.isUserOnSignInScreen()
        ).toBe(true);
    })

    test('Toggle Show/Hide Password', async () => {
        const user = TestDataFactory.generateAccountInformation();
        await signInPage.enterPassword(user.password);
        await signInPage.toggleShowHidePassword();
        expect(await signInPage.isPasswordVisible()).toBe(true);
    })
});
