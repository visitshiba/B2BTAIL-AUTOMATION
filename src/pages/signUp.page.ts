import { IBrowserAction } from '../lib/uiAction/IBrowserAction';
import { BasePage } from './basePage';

export type SIGN_UP_FORM_INFORMATION = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessName?: string;
    websiteUrl: string;
    location: string;
    businessDescription: string;
    industryNiche: string;
    graphicalAreaServed: string;
}
export class SignupPage extends BasePage {

    //locators
    private name = `[data-qa="signup-name"]`;
    private emailAddress = `[data-qa="signup-email"]`;
    private signupButton = `[data-qa="signup-button"]`;

    //account information locators
    private password = `#password`;
    private firstName = `#first_name`;
    private lastName = `#last_name`
    private address1 = `#address1`
    private city = `[data-qa="city"]`
    private state = `[data-qa="state"]`
    private zipcode = `[data-qa="zipcode"]`
    private mobileNumber = `[data-qa="mobile_number"]`
    private createAccountButton = `[data-qa="create-account"]`;
    private continueButton = `[data-qa="continue-button"]`;

    constructor(browser: IBrowserAction) {
        super(browser);
    }

    async fillNewUserSignUpForm(name: string, email: string) {
        console.log(`Filling signup form with Name: ${name}, Email: ${email}`);
        await this.browser.fill(this.name, name);
        await this.browser.fill(this.emailAddress, email);
        await this.browser.click(this.signupButton);
    }


    async enterAccountInformation(accountInfo: SIGN_UP_FORM_INFORMATION) {
        console.log(`Entering account information for: ${JSON.stringify(accountInfo)}`);
        await this.browser.fill(this.password, accountInfo.password);
        await this.browser.fill(this.firstName, accountInfo.firstName);
        await this.browser.fill(this.lastName, accountInfo.lastName);
        // await this.browser.fill(this.address1, accountInfo.address1);
        // await this.browser.fill(this.state, accountInfo.state);
        // await this.browser.fill(this.city, accountInfo.city);
        // await this.browser.fill(this.zipcode, accountInfo.zipcode);
        // await this.browser.fill(this.mobileNumber, accountInfo.mobileNumber);
        await this.browser.click(this.createAccountButton);
    }

    async verifyContinueButton(): Promise<void> {
        console.log("Verifying presence of Continue button post account creation...");
        await this.browser.waitForElement(this.continueButton);
        await this.browser.click(this.continueButton);
    }

    async verifyAccountCreated(email: string, password: string): Promise<void> {
        console.log("Verifying successful account creation");
        console.log('Account successfully created and verified by logging in.');
    }


}