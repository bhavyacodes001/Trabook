// Shopping Cart functionality for Trabook

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to book a trip immediately
function bookNow(id, name, price, duration) {
    // Show booking modal or redirect to booking page
    // For now, we'll just show a toast notification
    const message = `Booking ${name} for ${price}${duration ? ' - ' + duration : ''}`;
    showToast(message, 'success');
    
    // In a real application, this would redirect to a booking form or open a modal
    // You could also add the item to cart and redirect to checkout
    addToCart(id, name, price, getImageForId(id), getLocationForId(id), duration);
    
    // Optional: Open the cart to show the added item
    setTimeout(() => {
        toggleCart();
    }, 1000);
}

// Helper function to get image path based on id
function getImageForId(id) {
    const imageMap = {
        'deal1': 'madrid.jpg',
        'deal2': 'italy.jpg',
        'deal3': 'paris.jpg',
        'deal4': 'luke.jpg',
        'vac1': 'rome.jpg',
        'vac2': 'eng.jpg',
        'vac3': 'osaka.jpg'
    };
    return imageMap[id] || '';
}

// Helper function to get location based on id
function getLocationForId(id) {
    const locationMap = {
        'deal1': 'Spain',
        'deal2': 'Italy',
        'deal3': 'France',
        'deal4': 'UK',
        'vac1': 'Italy',
        'vac2': 'UK',
        'vac3': 'Japan'
    };
    return locationMap[id] || '';
}

// Function to add item to cart
function addToCart(id, name, price, image, location, duration) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        cart[existingItemIndex].quantity += 1;
        showToast(`Added another ${name} to your cart`, 'success');
    } else {
        // Add new item to cart
        cart.push({
            id,
            name,
            price,
            image,
            location,
            quantity: 1,
            duration: duration || null
        });
        showToast(`${name} added to your cart`, 'success');
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count
    updateCartCount();
}

// Function to remove item from cart
function removeFromCart(id) {
    // Find item index
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        const removedItem = cart[itemIndex];
        
        // Remove item from cart
        cart.splice(itemIndex, 1);
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart UI
        updateCartCount();
        updateCartDisplay();
        
        showToast(`${removedItem.name} removed from your cart`, 'info');
    }
}

// Function to update item quantity
function updateQuantity(id, change) {
    // Find item index
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart UI
        updateCartDisplay();
    }
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update cart count in UI
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    
    // Show/hide cart count based on items
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// Function to calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => {
        // Remove $ and convert to number
        const price = parseFloat(item.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0);
}

// Function to toggle cart display
function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.classList.toggle('show-cart');
    
    if (cartContainer.classList.contains('show-cart')) {
        updateCartDisplay();
    }
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Clear current items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        // Cart is empty
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '$0';
    } else {
        // Add each item to cart display
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            // Remove $ and convert to number
            const price = parseFloat(item.price.replace('$', ''));
            const itemTotal = price * item.quantity;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.location}</p>
                    ${item.duration ? `<p>${item.duration}</p>` : ''}
                    <p class="cart-item-price">${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">🗑️</button>
                </div>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // Update total
        const total = calculateCartTotal();
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Add event listener for cart button
    document.getElementById('cart-button').addEventListener('click', toggleCart);
    
    // Add event listener for close cart button
    document.getElementById('close-cart').addEventListener('click', toggleCart);
    
    // Add event listener for checkout button
    document.getElementById('checkout-button').addEventListener('click', function() {
        if (cart.length > 0) {
            showToast('Proceeding to checkout...', 'info');
            // In a real app, this would redirect to a checkout page
        } else {
            showToast('Your cart is empty', 'error');
        }
    });
}); 