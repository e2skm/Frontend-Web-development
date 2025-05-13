// Import the cart variables from other modules
import {cart, removeFromCart, calculateCartQunatity, updateItemQuantity} from '../data/cart.js';
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
          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
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
    calculateCartQunatity();
  });
});
// Make all the update buttons interactive 
document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', function handleUpdateClick() {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityLabel = container.querySelector('.quantity-label');
    
    // Store the original HTML to restore later
    const originalHTML = link.innerHTML;
    
    // Replace the update link with an input field and save button
    link.innerHTML = `
      <input type="number" class="item-quantity" value="${quantityLabel.textContent}" min="1">
      <span class="save-quantity-link link-primary js-save-link" data-product-id="${productId}">
        Save
      </span>
    `;
    
    // Focus the input field
    const inputElement = container.querySelector('.item-quantity');
    inputElement.focus();
    
    // Add event listener for the new save button
    const saveLink = container.querySelector('.js-save-link');
    const saveHandler = () => {
      let newQuantity = parseInt(inputElement.value);
      
      // Validate the input
      if (!newQuantity) {
        newQuantity = parseInt(quantityLabel.textContent); // Keep original quantity if invalid
      }
      
      // Update the quantity
      updateItemQuantity(productId, newQuantity);
      quantityLabel.textContent = newQuantity;
      calculateCartQunatity();
      
      // Restore the original update link
      link.innerHTML = originalHTML;
      
      // Re-add the click event to the update link
      link.addEventListener('click', handleUpdateClick);
    };
    
    saveLink.addEventListener('click', saveHandler);
    
    // Handle pressing Enter key in the input field
    inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveHandler();
      }
    });
    
    // Optional: Handle clicking outside to cancel
    const clickOutsideHandler = (e) => {
      if (!link.contains(e.target)) {
        // Restore the original update link
        link.innerHTML = originalHTML;
        link.addEventListener('click', handleUpdateClick);
        document.removeEventListener('click', clickOutsideHandler);
      }
    };
    
    // Add the outside click handler after a small delay to avoid immediate triggering
    setTimeout(() => {
      document.addEventListener('click', clickOutsideHandler);
    }, 10);
  });  
});

// Invoke function to display cart quantity 
setInterval(()=>{
  calculateCartQunatity();
});



