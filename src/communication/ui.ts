import { EXTENSION_MESSAGES } from '../config';

export function sendDebuggingOutput(message: string) {
  browser.runtime.sendMessage({ action: EXTENSION_MESSAGES.OUTPUT, data: message });
}

export function sendNotification(message: string) {
  browser.runtime.sendMessage({ action: EXTENSION_MESSAGES.NOTIFCATION, data: message });
}