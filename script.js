// Global State
let fetchedProducts = [];
let cartItems = [];
let cartTotal = 0;

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

// Fetch Products from Backend
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/products');
        fetchedProducts = await response.json();
        renderProducts(fetchedProducts);
    } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback to empty array if API fails
        fetchedProducts = [];
    }
}

// Render Products
function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(event, '${product.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(e, productId) {
    e.stopPropagation();
    const product = fetchedProducts.find(p => p.id === Number(productId));
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    
    cartTotal += product.price;
    updateCart();
    showToast(`${product.name} added to cart!`);
}

function updateCart() {
    // Update cart items list
    cartItemsEl.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItemsEl.appendChild(li);
    });
    
    // Update total
    cartTotalEl.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Update cart count
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Toggle cart
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

// Make functions available globally
window.addToCart = addToCart;