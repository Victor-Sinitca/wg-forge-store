/**
 * @module Popup
 */

import { TPopupInputs, TLinkHandler } from '@type/popup';

/**
 * Popup Class
 */
class Popup {
  /** element triggered popup creation */
  #target: HTMLElement;

  /** input data array to fill the form */
  readonly #inputs: TPopupInputs;

  /** restore password link callback */
  #linkHandler: TLinkHandler | undefined;

  /** flag to specify if a restore password should be created*/
  readonly #hasLink: boolean;

  #onSubmit: ((event: any) => void);

  constructor(
    target: HTMLElement,
    inputs: TPopupInputs,
    hasLink: boolean,
    onSubmit: (event: any) => void,
    linkHandler?: TLinkHandler,
  ) {
    this.#target = target;
    this.#inputs = inputs;
    this.#hasLink = hasLink;
    this.#linkHandler = linkHandler;
    this.#onSubmit = onSubmit;
  }

  /**
   * Method to create form title
   */
  createHeader(): HTMLHeadingElement {
    const title = this.#target.id.split('-').join(' ');
    const $header = document.createElement('h2');
    $header.innerText = title;
    return $header;
  }

  /**
   * Method to create a form
   * @param linkHandler restore password link callback
   */
  createForm(linkHandler?: TLinkHandler): HTMLFormElement {
    const $form = document.createElement('form');
    $form.classList.add('popup-form');
    if (this.#inputs.length) {
      for (let i = 0; i < this.#inputs.length; i += 1) {
        $form.innerHTML += `<label>${this.#inputs[i][0]} <input type='${
          this.#inputs[i][1]
        }' placeholder='Enter your ${this.#inputs[i][0]}'></label>`;
      }
    }

    $form.appendChild(Popup.createButton(this.#onSubmit));

    if (this.#hasLink) {
      $form.appendChild(
        Popup.createLink(
          'forget your password?',
          'reset-password',
          linkHandler!,
        ),
      );

      if (window.screen.width <= 720) {
        $form.appendChild(
          Popup.createLink('Create account', 'create-account', linkHandler!),
        );
      }
    }

    $form.onsubmit = function(event) {
      console.log('onsubmit');
      console.log(event);
      event.preventDefault();
    };

    return $form;
  }

  /**
   * Method to create submit button
   */
  static createButton(onSubmit: (event: any) => void): HTMLButtonElement {
    // единственный адекватный метод без черни
    const $btn = document.createElement('button');
    //$btn.type = 'submit';
    $btn.type = 'button';
    $btn.innerText = 'OK';
    $btn.addEventListener('click', (event) => {
      onSubmit(event);
    });
    return $btn;
  }

  /**
   * Method to create a link
   * @param str link content
   * @param id link id
   * @param handler link callback
   */
  static createLink(
    str: string,
    id: string,
    handler: TLinkHandler,
  ): HTMLAnchorElement {
    const $link = document.createElement('a');
    $link.id = id;
    $link.href = '#';
    $link.classList.add('popup-form-link');
    $link.innerText = str;
    // не знаю, как по-другому повесить листенер, думала через нодлист как-то, он ведь должен обновляться сам, по идее
    // но у меня не вышло
    $link.addEventListener('click', (event) => {
      handler(event);
    });
    return $link;
  }

  /**
   * Method to create close popup cross
   */
  static createSpan(): HTMLSpanElement {
    // это крестик
    // можно по- идее сразу на него повесить лисенер на закрытие, как на линках, сейчас он вешается в функции closePopup,
    // но там диким образом вытягиваю элемент

    const $cross = document.createElement('span');
    $cross.innerText = 'X';
    return $cross;
  }

  /**
   * Method to create popup container
   */
  renderHTML(): HTMLDivElement {
    const $container = document.createElement('div');
    $container.classList.add('pop-up-container');

    $container.append(
      this.createHeader(),
      Popup.createSpan(),
      this.#linkHandler
        ? this.createForm(this.#linkHandler)
        : this.createForm(),
    );
    return $container;
  }
}

export default Popup;
