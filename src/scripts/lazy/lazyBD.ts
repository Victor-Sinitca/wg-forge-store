/**
 * @module Lazy Loading
 */

import { IUser } from '@type/user';

import Item from '@classes/Item';
import ProductAPI from '@api/ProductAPI';
import LocalStorage from '@classes/LocalStorage';
import ItemDOM from '@dom/ItemDOM';


/**
 * Function for create Observer options
 * @param margin margin-bottom to trigger download
 */
const createObserverOptions = (margin: number) => {
  return {
    root: null,
    rootMargin: `${margin}px`,
    threshold: 0,
  };
};

/**
 * Function for lazy loading of products from database on the main page
 * @param amount number of products to download
 * @param margin target padding (allows to start loading new products earlier)
 * @param user current user
 */

function lazyBD(
  amount: number,
  margin: number,
  user: IUser | null,
) {
  const $productsContainer = document.querySelector('.main-container-content');
  if (!$productsContainer) return;
  // find the last product
  const $lastProduct = $productsContainer.lastElementChild;
  if (!$lastProduct) return null;
  const observerOptions = createObserverOptions(margin);
  const observerCb: IntersectionObserverCallback = async function (
    entries,
    observer,
  ) {
    // find the number of displayed products
    const showedProductsAmount = $productsContainer.children.length;

    entries.forEach((entry) => {
      // tracked element has reached the line of sight
      if (!entry.isIntersecting) return;
      // add a specified number of products if we do not reach the end of the list
      const page = +showedProductsAmount / +amount + 1;
      ProductAPI.getAllProductsByLazy(
        page,
        +amount,
        LocalStorage.getCurrency(),
      ).then((value) => {
        if (!value || !value.products) return;
        value.products.forEach((val) =>
          $productsContainer.appendChild(ItemDOM.createItem(val, user)),
        );

        observer.unobserve(entry.target);

        // find the number of displayed products (after the loading of new products has been triggered)
        const newShowedProductsAmount = $productsContainer.children.length;
        // have not yet reached the end of the product list
        if (newShowedProductsAmount < value.countProducts) {
          // find the last product (after the loading of new products has been triggered)
          const $newLastProduct = $productsContainer.lastElementChild;
          if ($newLastProduct) {
            // add tracking from the product
            observer.observe($newLastProduct);
          }
        }
      });
    });
  };
  const observer = new IntersectionObserver(observerCb, observerOptions);
  // add tracking from the product
  observer.observe($lastProduct);
}

export default lazyBD;
