// Import the cart variables from other modules
import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
// Variable to store the generated html
let cartSummaryHTML = '';
// Iterate over all the items in the cart
cart.forEach((cartItem) => {
  // Variable save the product ID for each product in the cart (To search for products inside the products array)
  const productId = cartItem.id;
  
  // Variable to save matching products
  let matchingProduct;

  // Iterate through the products array to get details of the product in the cart 
  products.forEach((product) => {
    // Check if the product at checkout matches a product in the products array
    if(product.id === productId){
      // Save product (info) inside matching product variable
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          ${formatCurrency(matchingProduct.priceInCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> `;
});
// Place the generated html on the webpage
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
// Make all the delete buttons interactive 
document.querySelectorAll('.js-delete-link').forEach((link) => {
  // Add event listeners to delete buttons
  link.addEventListener('click', () => {
    // Get the product id 
    const productId = link.dataset.productId;  
    // Invoke function t remove the deleted product from the cart (webpage)
    removeFromCart(productId);
    // Update the html
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    // Invoke function to display cart quantity
    updateCartQuantity();
  });
});
// Function to display cart quantity 
function updateCartQuantity(){
  let cartQuantity = 0;
  cart.forEach(cartItem => cartQuantity += cartItem.quantity);
  document.querySelector('.js-cart-quantity').innerText = `${cartQuantity} items`;
}
// Invoke function to display cart quantity
updateCartQuantity();



