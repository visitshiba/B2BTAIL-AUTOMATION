import { IBrowserAction } from "../lib/uiAction/IBrowserAction";
import { BasePage } from "./basePage";

/**
 * SignInPage class representing the sign-in page of the application
 * Implements page-specific actions and locators following POM pattern
 */
export class SignInPage extends BasePage {

    private readonly emailInput: string = '#email';
    private readonly passwordInput: string = '#password';
    private readonly loginButton: string = 'button[type="submit"]';
    private readonly landingPageCompanyLable: string = '.border-sidebar-border h1';
    private readonly invalidCredentialErrorMessageLocator;
    private readonly invalidEmailErrorMessageLocator;
    private readonly invalidPasswordErrorMessageLocator;
    private readonly forgotPasswordLink = 'a[href="/forgot-password"]';
    private readonly sendLinkButton = 'button:has-text("Send Link")';
    private readonly resetEmailNotification;
    private readonly signInLink = `a[href='/login']`;
    private readonly showPasswordToggle = 'svg.lucide-eye';





    constructor(browser: IBrowserAction) {
        super(browser);
        this.invalidCredentialErrorMessageLocator = this.browser.getByText('Invalid email or password');
        this.invalidEmailErrorMessageLocator = this.browser.getByText('Please enter a valid email address');
        this.invalidPasswordErrorMessageLocator = this.browser.getByText('Password is required');
        this.resetEmailNotification = this.browser.getByText('if an account with this email exists, password reset instructions have been sent.');
    }

    public async isUserOnSignInScreen(): Promise<boolean> {
        try {
            await this.browser.waitForVisible(this.forgotPasswordLink, 5000);
            return true;
        } catch (error) {
            console.error('Error: User is not on sign in screen:', error);
            return false;
        }
    }

    public async enterEmail(email: string): Promise<void> {
        console.log(`Entering email: ${email}`);
        await this.browser.fill(this.emailInput, email);
    }

    public async enterPassword(password: string): Promise<void> {
        console.log(`Entering password: [REDACTED]`);
        await this.browser.fill(this.passwordInput, password);
    }

    public async clickLoginBtn(): Promise<void> {
        console.log(`Clicking login button`);
        await this.browser.click(this.loginButton);
    }

    public async clickForgotPasswordLink(): Promise<void> {
        console.log(`Clicking forgot password link`);
        await this.browser.click(this.forgotPasswordLink);
        await this.browser.waitForVisible(this.sendLinkButton);

    }

    public async clickSendLinkButton(): Promise<void> {
        console.log(`Clicking send link button`);
        await this.browser.click(this.sendLinkButton);
    }

    public async clickSignInLink(): Promise<void> {
        console.log(`Clicking sign in link`);
        await this.browser.click(this.signInLink);
    }

    public async toggleShowHidePassword(): Promise<void> {
        console.log(`Clicking show/hide password toggle`);
        await this.browser.click(this.showPasswordToggle);
    }

    public async isPasswordVisible(): Promise<boolean> {
        const type = await this.browser.getAttribute(this.passwordInput, 'type');
        return type === 'text';
    }



    /**
    * Sign in to the application with given email and password
    * @param email - The email address to sign in with
    * @param password - The password to sign in with
    * @returns Promise<void>
    */
    async signInToApplication(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }

    /**
     * Check if invalid credential error message is visible
     * @returns Promise<boolean>
     */
    async isInvalidCredentialErrorMessageVisible(): Promise<boolean> {
        try {
            await this.browser.waitForVisible(this.invalidCredentialErrorMessageLocator);
        }
        catch (error) {
            console.error('Error: "invalid credential error message" not visible:', error);
            return false;
        }
        return true;
    }

    /**
    * Check if invalid credential error message is visible
    * @returns Promise<boolean>
    */
    async isInvalidEmailErrorMessageVisible(): Promise<boolean> {
        try {
            await this.browser.waitForVisible(this.invalidEmailErrorMessageLocator);
        }
        catch (error) {
            console.error('Error: "invalid email error message" not visible:', error);
            return false;
        }
        return true;
    }

    /**
 * Check if invalid credential error message is visible
 * @returns Promise<boolean>
 */
    async isInvalidPasswordErrorMessageVisible(): Promise<boolean> {
        try {
            await this.browser.waitForVisible(this.invalidPasswordErrorMessageLocator);
        }
        catch (error) {
            console.error('Error: "invalid password error message" not visible:', error);
            return false;
        }
        return true;
    }


    /**
     * Verify company label is visible on landing page after successful login
     * @returns Promise<string>
     */
    async getCompanyLable(): Promise<string> {
        await this.browser.waitForVisible(this.landingPageCompanyLable);
        const companyLable = await this.browser.getText(this.landingPageCompanyLable);
        return companyLable.toLowerCase();
    }

    async getForgetPasswordNotification(): Promise<string> {
        await this.browser.waitForVisible(this.resetEmailNotification, 5000);
        const notificationText = await this.browser.getText(this.resetEmailNotification);
        return notificationText.toLowerCase();
    }


}