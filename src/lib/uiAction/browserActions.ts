export interface IBrowserAction {
    click(selector: string): Promise<void>;
    type(selector: string, text: string): Promise<void>;
    fill(selector: string, text: string): Promise<void>;
    getText(selector: string): Promise<string>;
    waitForVisible(selector: string, timeout?: number): Promise<void>;
    waitForHidden(selector: string, timeout?: number): Promise<void>;
    selectDropdown(selector: string, value: string): Promise<void>;
    navigate(url: string): Promise<void>;
    press(selector: string, key: string): Promise<void>;
    getCount(selector: string): Promise<number>;
    scrollToElement(selector: string): Promise<void>;
    takeScreenshot(name: string): Promise<void>;
    waitForElement(selector: string, timeout?: number): Promise<void>;
    openUrl(url: string): Promise<void>;
    waitForPageLoad(): Promise<void>;
    getPageTitle(): Promise<string>;
    getCurrentUrl(): Promise<string>;
    refreshPage(): Promise<void>;
    goBack(): Promise<void>;
    goForward(): Promise<void>;
}