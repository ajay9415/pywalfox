import { RESPONSE_TIMEOUT, NATIVE_MESSAGES } from '../config/native';

import {
  IPywalColors,
  INativeAppMessage,
  INativeAppRequest,
  INativeAppMessageCallbacks
} from '../definitions';

/**
 * Implements the communcation with the native messaging host.
 *
 * @remarks
 * Based on the native messaging protocol, allowing extensions to communicate with
 * user's computer and share resources that are otherwise inaccessible by the browser.
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging
 */
export class NativeApp {
  private isConnected: boolean;
  private port: browser.runtime.Port;
  private callbacks: INativeAppMessageCallbacks;

  private versionCheckTimeout: number;
  private connectedCheckTimeout: number;

  constructor(callbacks: INativeAppMessageCallbacks) {
    this.callbacks = callbacks;
  }

  private logError(error: string) {
    this.callbacks.output(error, true);
  }

  private getData(message: INativeAppMessage) {
    if (message.hasOwnProperty('data')) {
      return message.data;
    }

    this.logError(`Recieved invalid message from native app. The 'data' field is undefined.`);
    return null;
  }

  private async onMessage(message: INativeAppMessage) {
    console.debug(message);
    switch(message.action) {
      case NATIVE_MESSAGES.VERSION:
        this.onVersionResponse(message);
        break;
      case NATIVE_MESSAGES.OUTPUT:
        this.onDebuggingOutput(message);
        break;
      case NATIVE_MESSAGES.PYWAL_COLORS:
        this.onPywalColorsResponse(message);
        break;
      case NATIVE_MESSAGES.CSS_ENABLE: /* fallthrough */
      case NATIVE_MESSAGES.CSS_DISABLE:
        this.onCssToggleResponse(message);
        break;
      case NATIVE_MESSAGES.CSS_FONT_SIZE:
        this.onCssFontSizeResponse(message);
        break;
      case NATIVE_MESSAGES.INVALID_ACTION:
        this.logError(`Native app recieved unhandled message action: ${message.action}`);
        break;
      default:
        this.logError(`Received unhandled message action: ${message.action}`);
        break;
    }
  }

  private onVersionResponse(message: INativeAppMessage) {
    const version = this.getData(message);
    if (version) {
      this.callbacks.version(version);
    } else {
      this.callbacks.updateNeeded();
    }

    clearTimeout(this.versionCheckTimeout);
  }

  private onPywalColorsResponse(message: INativeAppMessage) {
    if (message.success) {
      const colors: IPywalColors = this.getData(message);

      if (!colors) {
        this.logError('Pywal colors were read successfully, but no colors were received');
        return;
      }

      this.callbacks.pywalColorsFetchSuccess(colors);
    } else {
      this.callbacks.pywalColorsFetchFailed(message.error);
    }
  }

  private onCssToggleResponse(message: INativeAppMessage) {
    const target = this.getData(message);

    if (message.success) {
      if (!target) {
        this.logError('Custom CSS was applied successfully, but the target was not specified');
        return;
      }

      this.callbacks.cssToggleSuccess(target);
    } else {
      this.callbacks.cssToggleFailed(target, message.error);
    }
  }

  private onCssFontSizeResponse(message: INativeAppMessage) {
    if (message.success) {
      const updatedFontSize = this.getData(message);

      if (!updatedFontSize) {
        this.logError(`Font size was updated successfully, but the updated font size was not specified`);
        return;
      }

      this.callbacks.cssFontSizeSetSuccess(parseInt(updatedFontSize));
    } else {
      this.callbacks.cssFontSizeSetFailed(message.error);
    }
  }

  private onDebuggingOutput(message: INativeAppMessage) {
    const output: string = this.getData(message);
    output && this.callbacks.output(output);
  }

  private async onDisconnect(port: browser.runtime.Port) {
    if (port.error) {
      clearTimeout(this.versionCheckTimeout);
      clearTimeout(this.connectedCheckTimeout);
      this.callbacks.disconnected();
      console.log('Disconnected from native messaging host');
    }
  }

  private setupListeners() {
    this.port.onMessage.addListener(this.onMessage.bind(this));
    this.port.onDisconnect.addListener(this.onDisconnect.bind(this));
  }

  public connect() {
    this.port = browser.runtime.connectNative('pywalfox');
    this.isConnected = true;
    this.versionCheckTimeout = window.setTimeout(this.callbacks.updateNeeded, RESPONSE_TIMEOUT);
    this.connectedCheckTimeout = window.setTimeout(this.callbacks.connected, RESPONSE_TIMEOUT);
    this.setupListeners();
    this.requestVersion();
  }

  private sendMessage(message: INativeAppRequest) {
    this.port.postMessage(message);
  }

  public requestVersion() {
    this.sendMessage({ action: NATIVE_MESSAGES.VERSION });
  }

  public requestPywalColors() {
    this.sendMessage({ action: NATIVE_MESSAGES.PYWAL_COLORS });
  }

  public requestCssEnabled(target: string, enabled: boolean) {
    this.sendMessage({ action: enabled ? NATIVE_MESSAGES.CSS_ENABLE : NATIVE_MESSAGES.CSS_DISABLE, target });
  }

  public requestFontSizeSet(target: string, size: number) {
    this.sendMessage({ action: NATIVE_MESSAGES.CSS_FONT_SIZE, target, size });
  }
}
