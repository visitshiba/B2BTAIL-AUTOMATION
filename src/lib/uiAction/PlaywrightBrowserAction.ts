import { Page, Locator, expect } from '@playwright/test';
import { IBrowserAction } from './IBrowserAction';
import { BrowserLocator } from './BrowserLocator';

export class PlaywrightBrowserAction implements IBrowserAction {
    constructor(private readonly page: Page) { }

    // 🔑 internal cast (only here!)
    private resolve(target: string | BrowserLocator): Locator {
        if (typeof target === 'string') {
            return this.page.locator(target);
        }
        return target as Locator;
    }

    // -------- locator factories --------

    locator(selector: string, options?: unknown): BrowserLocator {
        return this.page.locator(selector, options as any);
    }

    getByText(text: string, options?: unknown): BrowserLocator {
        return this.page.getByText(text, options as any);
    }

    getByRole(role: string, options?: unknown): BrowserLocator {
        return this.page.getByRole(role as any, options as any);
    }

    getByLabel(label: string, options?: unknown): BrowserLocator {
        return this.page.getByLabel(label as any, options as any);
    }


    cssContainsClass(className: string): BrowserLocator {
        return this.page.locator(`[class*="${className}"]`);
    }

    // -------- actions --------

    async click(target: string | BrowserLocator): Promise<void> {
        await this.resolve(target).click();
    }

    async fill(target: string | BrowserLocator, text: string): Promise<void> {
        await this.resolve(target).fill(text);
    }

    async type(target: string | BrowserLocator, text: string): Promise<void> {
        await this.resolve(target).type(text);
    }

    async press(target: string | BrowserLocator, key: string): Promise<void> {
        await this.resolve(target).press(key);
    }

    // -------- waits --------

    async waitForVisible(target: string | BrowserLocator, timeout?: number): Promise<void> {
        await expect(this.resolve(target)).toBeVisible({ timeout });
    }

    async waitForHidden(target: string | BrowserLocator, timeout?: number): Promise<void> {
        await expect(this.resolve(target)).toBeHidden({ timeout });
    }

    async waitForElement(target: string | BrowserLocator, timeout?: number): Promise<void> {
        await this.resolve(target).waitFor({ state: 'visible', timeout });
    }

    // -------- getters --------

    async getText(target: string | BrowserLocator): Promise<string> {
        return await this.resolve(target).innerText();
    }

    async getCount(target: string | BrowserLocator): Promise<number> {
        return await this.resolve(target).count();
    }

    async getAttribute(
        target: string | BrowserLocator,
        name: string
    ): Promise<string | null> {
        return await this.resolve(target).getAttribute(name);
    }

    // -------- page ops --------

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async openUrl(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async refreshPage(): Promise<void> {
        await this.page.reload();
    }

    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    async goForward(): Promise<void> {
        await this.page.goForward();
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('load');
    }

    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }

    async scrollToElement(target: string | BrowserLocator): Promise<void> {
        await this.resolve(target).scrollIntoViewIfNeeded();
    }


    // -------- close ops --------

    /** Closes the current page */
    async closePage(): Promise<void> {
        await this.page.close();
    }

    /** Closes the current browser context (and all pages within it) */
    async closeContext(): Promise<void> {
        await this.page.context().close();
    }

    /** Closes the entire browser instance */
    async closeBrowser(): Promise<void> {
        await this.page.context().browser()?.close();
    }
}
