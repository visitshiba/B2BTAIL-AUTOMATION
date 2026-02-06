import { Locator, Page, expect } from '@playwright/test';
import { IBrowserAction } from './browserActions';

export class PlaywrightBrowserAction implements IBrowserAction {
    constructor(private page: Page) { }
    async goBack(): Promise<void> {
        await this.page.goBack();
    }
    async goForward(): Promise<void> {
        await this.page.goForward();
    }
    async refreshPage(): Promise<void> {
        await this.page.reload();
    }
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('load');
    }
    async scrollToElement(selector: string): Promise<void> {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }
    async waitForElement(selector: string, timeout?: number): Promise<void> {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }
    async openUrl(url: string): Promise<void> {
        console.debug(`Navigating to URL: ${url}`);
        await this.page.goto(url);
    }
    // NEW unified locator resolver

    getLocator(selectorOrLocator: string | Locator): Locator {
        if (typeof selectorOrLocator === 'string') {
            return this.page.locator(selectorOrLocator);
        }
        return selectorOrLocator; // locator already
    }
    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    async type(selector: string, text: string): Promise<void> {
        await this.page.locator(selector).type(text);
    }

    async fill(selector: string, text: string): Promise<void> {
        await this.page.fill(selector, text);
    }

    async getText(selector: string): Promise<string> {
        return await this.page.locator(selector).innerText();
    }

    async waitForVisible(selector: string, timeout?: number): Promise<void> {
        await expect(this.page.locator(selector)).toBeVisible({ timeout });
    }

    async waitForHidden(selector: string, timeout?: number): Promise<void> {
        await expect(this.page.locator(selector)).toBeHidden({ timeout });
    }

    async selectDropdown(selector: string, value: string): Promise<void> {
        await this.page.selectOption(selector, value);
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async press(selector: string, key: string): Promise<void> {
        await this.page.locator(selector).press(key);
    }

    async getCount(selector: string): Promise<number> {
        return await this.page.locator(selector).count();
    }
}
