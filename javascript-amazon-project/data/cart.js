// Data Structure to store cart
export let cart = JSON.parse(localStorage.getItem('cart'));
 if (!cart){
  cart = [
    {
      id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2
    },
    {
      id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1
    },
    {
      id: 'bc2847e9-5323-403f-b7cf-57fde044a955',
      quantity: 3
    }
  ];
}

// Function to save cart to localStorage
export function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}


// Function  Add item(s) to cart 
export function addToCart(productId,quantity){
  // Variable to see in item already exist in the cart
  let matchingItem;
  // Iterate through each item in the cart to check if it already exists
  cart.forEach((cartItem) => {
    if(productId === cartItem.id){
      matchingItem = cartItem;
    }
  });
  if (matchingItem) matchingItem.quantity ++;
  else{
    cart.push({
      id: productId,
      quantity
    });
  }
  // Invoke function to save cart to local storage
  saveToStorage();
}
// Function to remove  a product from cart
export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.id !== productId){
      newCart.push(cartItem);
    }
  });
  // Replace cart with new cart 
  cart = newCart;
  // Invoke function to save cart to local storage
  saveToStorage();
}
// Function to update Item quantity
// Function to update Item quantity
export function updateItemQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.id === productId) {
      if (newQuantity !== undefined && newQuantity > 0) {
        cartItem.quantity = newQuantity;
      }
    }
  });
  saveToStorage();
}
// Function to display cart quantity 
export function calculateCartQunatity(){
  // Variable to store the number of items in our cart
  let cartQuantity = 0; 
  // Function to update the quantity of items in our cart
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  // Display cart quantity on our web page
  document.querySelector('.js-cart-quantity').innerText = JSON.parse(localStorage.getItem('cartQuantity'));

  // Save to localStorage
  localStorage.setItem('cartQuantity', cartQuantity);
}