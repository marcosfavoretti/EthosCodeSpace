export interface IWebAutomation {
  waitElement(selector: string, timeout?: number): Promise<any>;
  navigate(url: string): Promise<void>;
  closeAll(): Promise<void>;
  reloadPage(waitForSelector?: string): Promise<void>;
  waitElementDisappear(selector: string, timeout?: number): Promise<void>;
  type(element: any, text: string): Promise<void>;
  click(element: any): Promise<void>;
}

export const IWebAutomation = Symbol('IWebAutomation');
