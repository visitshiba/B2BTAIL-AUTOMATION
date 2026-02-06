import { IBrowserAction } from "../lib/uiAction/IBrowserAction";

/**
 * BasePage class implementing common page functionality
 * Following POM pattern and testing automation standards
 */
export class BasePage {
    constructor(public browser: IBrowserAction) {
    }

    /**
     * Navigate to the application base URL
     * @returns Promise<void>
     */
    async openApplication(): Promise<void> {
        await this.browser.openUrl(process.env.BASE_URL || '');
    }

    async closeApplication(): Promise<void> {
        await this.browser.closeContext();
    }

}