import * as Utils from './utils';

/**
 * Base class for dialogs.
 *
 * @param {string} dialogId - the id of the dialog element
 */
export abstract class Dialog {
  protected dialog: HTMLElement;
  protected target: HTMLElement;
  protected selected: HTMLElement;

  constructor(dialogId: string) {
    this.target = null;
    this.selected = null;
    this.dialog = document.getElementById(dialogId);
  }

  /**
   * Opens the dialog and selects/deselects opener elements.
   * Callback is available by implementing the 'onOpen' function.
   *
   * @param {HTMLElement} target - the dialog opener element
   */
  public open(target: HTMLElement) {
    Utils.open(this.dialog);
    Utils.select(target);

    if (this.target !== null){
      Utils.deselect(this.target);
    }

    this.onOpen !== undefined && this.onOpen(this.target, target);
    this.target = target;
  }

  public getTarget() {
    return this.target;
  }

  protected onOpen(currentTarget: HTMLElement, nextTarget: HTMLElement) {};
  protected onClose(currentTarget: HTMLElement) {};

  /**
   * Closes the dialog and unselects the opener element.
   * Callback is available by implementing the 'onClose' function.
   */
  public close() {
    Utils.close(this.dialog);
    Utils.deselect(this.target);

    this.onClose !== undefined && this.onClose(this.target);
    this.target = null;
  }
}
