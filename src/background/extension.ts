import {
  IPywalColors,
  IColorscheme,
  IBrowserTheme,
  IExtensionTheme,
  IExtensionMessage,
  IColorschemeTemplate,
} from '../definitions';

import {
  generateColorscheme,
  generateBrowserTheme,
  generateExtensionTheme,
  generateDefaultExtensionTheme,
  generateDDGTheme,
} from './colorscheme';

import { State } from './state';
import { NativeApp } from './native-app';
import { MIN_REQUIRED_DAEMON_VERSION, EXTENSION_MESSAGES } from '../config';

import * as UI from '../communication/ui';
import * as DDG from '../communication/duckduckgo';

/**
 * Expose 'wrappedJSObject' from the 'window' namespace.
 *
 * @remarks
 * The object is used by the DuckDuckGo content script to interface
 * with the DuckDuckGo scripts. It allows us to get and set settings
 * using the built-in functions.
 */
declare global {
  interface Window {
    wrappedJSObject: { DDG: any; };
  }
}

export class Extension {
  private state: State;
  private nativeApp: NativeApp;

  constructor() {
    this.state = new State();
    this.nativeApp = new NativeApp({
      connected: this.nativeAppConnected.bind(this),
      updateNeeded: this.updateNeeded.bind(this),
      disconnected: this.nativeAppDisconnected.bind(this),
      version: this.validateVersion.bind(this),
      output: UI.sendDebuggingOutput,
      colorscheme: this.updateColorscheme.bind(this),
      cssToggleSuccess: this.cssToggleSuccess.bind(this),
      cssToggleFailed: this.cssToggleFailed.bind(this),
    });

    browser.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  /* Handles incoming messages from the UI and other content scripts. */
  private onMessage(message: IExtensionMessage) {
    switch (message.action) {
      case EXTENSION_MESSAGES.DDG_THEME_GET:
        const theme = this.state.getDuckDuckGoTheme();
        theme ? DDG.setTheme(theme) : DDG.resetTheme();
        break;
    }
  }

  private setTheme(browserTheme: IBrowserTheme, extensionTheme: IExtensionTheme) {
    browser.theme.update({ colors: browserTheme });
    // TODO: Send the updated extension colorscheme to the UI
    this.state.setApplied(true);
  }

  /**
   * Fetches the browser- and extension theme from state and applies it, if set.
   * This is used when launching the background script to increase the speed
   * at which the theme is applied.
   *
   * When colors are fetched or updated by the user, use 'applyUpdatedTheme'
   */
  private applySavedTheme() {
    const browserTheme = this.state.getBrowserTheme();
    const extensionTheme = this.state.getExtensionTheme();

    if (browserTheme) {
      this.setTheme(browserTheme, extensionTheme);
      // TODO: Send external message
    } else {
      this.state.setApplied(false);
    }
  }

  private applyUpdatedTheme(browserTheme: IBrowserTheme, extensionTheme: IExtensionTheme, refresh: boolean) {
    this.setTheme(browserTheme, extensionTheme);
    if (refresh) {
      // TODO: Refresh DuckDuckGo, etc
    }
  }

  private validateVersion(version: string) {
    const versionNumber = parseFloat(version);
    if (versionNumber < MIN_REQUIRED_DAEMON_VERSION) {
      this.updateNeeded();
    }

    this.state.setVersion(versionNumber);
  }

  private updateNeeded() {
    console.log('Update needed');
  }

  private nativeAppConnected() {
    if (!this.state.getApplied()) {
      this.nativeApp.requestColorscheme();
    }

    this.state.setConnected(true);
  }

  private nativeAppDisconnected() {
    console.error('Disconnected from native app');
    this.state.setConnected(false);
  }

  private updateColorscheme(pywalColors: IPywalColors) {
    // TODO: Generate colorscheme and browser- and extension theme

    /* this.applyUpdatedTheme(); */
  }

  private cssToggleSuccess(target: string, enabled: boolean) {
    this.state.setCssEnabled(target, enabled);
  }

  private cssToggleFailed(error: string) {
    UI.sendNotification(error);
  }

  public async start() {
    browser.storage.local.clear(); // debugging
    await this.state.load();

    this.applySavedTheme();
    this.nativeApp.connect();
  }
}
