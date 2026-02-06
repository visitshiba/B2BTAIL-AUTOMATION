import { BrowserLocator } from './BrowserLocator';

export interface IBrowserAction {
    // actions
    click(target: string | BrowserLocator): Promise<void>;
    type(target: string | BrowserLocator, text: string): Promise<void>;
    fill(target: string | BrowserLocator, text: string): Promise<void>;
    press(target: string | BrowserLocator, key: string): Promise<void>;

    // waits
    waitForVisible(target: string | BrowserLocator, timeout?: number): Promise<void>;
    waitForHidden(target: string | BrowserLocator, timeout?: number): Promise<void>;
    waitForElement(target: string | BrowserLocator, timeout?: number): Promise<void>;

    // getters
    getText(target: string | BrowserLocator): Promise<string>;
    getCount(target: string | BrowserLocator): Promise<number>;
    getAttribute(target: string | BrowserLocator, attributeName: string): Promise<string | null>;

    // page actions
    navigate(url: string): Promise<void>;
    openUrl(url: string): Promise<void>;
    refreshPage(): Promise<void>;
    goBack(): Promise<void>;
    goForward(): Promise<void>;
    waitForPageLoad(): Promise<void>;
    getPageTitle(): Promise<string>;
    getCurrentUrl(): Promise<string>;
    takeScreenshot(name: string): Promise<void>;
    scrollToElement(target: string | BrowserLocator): Promise<void>;

    // locator factories (framework-neutral)
    locator(selector: string, options?: unknown): BrowserLocator;
    getByText(text: string, options?: unknown): BrowserLocator;
    getByRole(role: string, options?: unknown): BrowserLocator;
    getByLabel(label: string, options?: unknown): BrowserLocator;
    cssContainsClass(className: string): BrowserLocator;

    // browser close operations
    /** Closes the current page */
    closePage(): Promise<void>;
    /** Closes the current browser context (and all pages within it) */
    closeContext(): Promise<void>;
    /** Closes the entire browser instance */
    closeBrowser(): Promise<void>;
}
