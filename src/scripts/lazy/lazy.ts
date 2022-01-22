/**
 * @module Lazy Loading
 */

import { IUser } from '@type/user';
import { IProduct } from '@type/product';

import ItemDOM from '@dom/ItemDOM';

/**
 * Function for lazy loading of products on the main page
 * @param amount number of products to download
 * @param margin target margin (allows to start loading new products earlier)
 * @param user current user
 * @param products products to display on the page
 */
function lazy(
  amount: number,
  margin: number,
  user: IUser | null,
  products: IProduct[],
) {
  const $productsContainer = document.querySelector('.main-container-content');

  if ($productsContainer) {
    // find the last product
    const $lastProduct = $productsContainer.lastElementChild;

    if ($lastProduct) {
      const observerOptions = {
        root: null,
        rootMargin: `${margin}px`,
        threshold: 0,
      };

      const observerCb: IntersectionObserverCallback = function observerCb(
        entries,
        observer,
      ) {
        // find the number of displayed products
        const showedProductsAmount = $productsContainer.children.length;

        entries.forEach((entry) => {
          // tracked element has reached the line of sight
          if (entry.isIntersecting) {
            // add a specified number of products if we do not reach the end of the list
            for (
              let i = showedProductsAmount;
              i < showedProductsAmount + amount;
              i += 1
            ) {
              if (i < products.length) {
                $productsContainer.appendChild(
                  ItemDOM.createItem(products[i], user /* , router */),
                );
              } else {
                break;
              }
            }
            // remove tracking from the product
            observer.unobserve(entry.target);

            // find the number of displayed products (after the loading of new products has been triggered)
            const newShowedProductsAmount = $productsContainer.children.length;
            // have not yet reached the end of the product list
            if (newShowedProductsAmount < products.length) {
              // find the last product (after the loading of new products has been triggered)
              const $newLastProduct = $productsContainer.lastElementChild;
              if ($newLastProduct) {
                // add tracking from the product
                observer.observe($newLastProduct);
              }
            }
          }
        });
      };

      const observer = new IntersectionObserver(observerCb, observerOptions);
      // add tracking from the product
      observer.observe($lastProduct);
    }
  }
}

export default lazy;
