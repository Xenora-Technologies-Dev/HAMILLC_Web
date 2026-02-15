/* ============================================
   AL HAMIDIYAH GEN TR LLC (HAMI) - Shop Module
   E-Commerce Showcase: Product Grid, Cart & Enquiry
   ============================================ */

/**
 * TABLE OF CONTENTS
 * 1. Product Catalogue Data
 * 2. Cart State Management
 * 3. Product Grid Rendering & Filtering
 * 4. Cart Operations (Add / Remove / Update Qty)
 * 5. Cart Sidebar UI Rendering
 * 6. Send Enquiry via mailto
 * 7. Toast Notifications
 * 8. Initialisation
 */

(function () {
    'use strict';

    // ============================================
    // 1. Product Catalogue Data
    // ============================================
    // Placeholder product data — replace images/prices with real values as needed.
    const PRODUCTS = [
        {
            id: 1,
            name: 'Marine-Grade Electrical Cable',
            category: 'marine',
            price: 125.00,
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
            description: 'High-quality marine electrical cables rated for shipboard and offshore use.'
        },
        {
            id: 2,
            name: 'Centrifugal Pump Assembly',
            category: 'marine',
            price: 890.00,
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
            description: 'Heavy-duty centrifugal pump for bilge, ballast and general marine service.'
        },
        {
            id: 3,
            name: 'Navigation Radar System',
            category: 'marine',
            price: 3450.00,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
            description: 'X-band marine radar with chart overlay for commercial vessels.'
        },
        {
            id: 4,
            name: 'Industrial HVAC Unit',
            category: 'engineering',
            price: 2750.00,
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
            description: 'Packaged air-conditioning unit for industrial plants and marine engine rooms.'
        },
        {
            id: 5,
            name: 'Steel Gate Valve (DN150)',
            category: 'engineering',
            price: 320.00,
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
            description: 'Flanged gate valve, carbon steel body, for high-pressure piping systems.'
        },
        {
            id: 6,
            name: 'PLC Control Panel',
            category: 'engineering',
            price: 4100.00,
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
            description: 'Pre-wired PLC panel with HMI display for automation and monitoring.'
        },
        {
            id: 7,
            name: 'Commercial Kitchen Oven',
            category: 'hospitality',
            price: 1850.00,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            description: 'Convection oven with steam function for hotels and commercial kitchens.'
        },
        {
            id: 8,
            name: 'Pool Filtration System',
            category: 'hospitality',
            price: 1200.00,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            description: 'Sand filter and pump package for resort and hotel swimming pools.'
        },
        {
            id: 9,
            name: 'LED Hotel Lighting Kit',
            category: 'hospitality',
            price: 475.00,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            description: 'Energy-efficient LED downlight and decorative lighting package for guest rooms.'
        },
        {
            id: 10,
            name: 'SOLAS Life Jacket (Pack of 10)',
            category: 'safety',
            price: 350.00,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
            description: 'IMO / SOLAS approved life jackets with reflective tape and whistle.'
        },
        {
            id: 11,
            name: 'Fire Extinguisher Set',
            category: 'safety',
            price: 280.00,
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
            description: 'Dry powder and CO₂ fire extinguishers, marine-type approved.'
        },
        {
            id: 12,
            name: 'Breathing Apparatus (SCBA)',
            category: 'safety',
            price: 1650.00,
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
            description: 'Self-contained breathing apparatus for confined space and fire-fighting.'
        }
    ];

    // ============================================
    // 2. Cart State Management
    // ============================================
    // Cart is an array of { product, quantity }.
    // Persisted to sessionStorage so it survives page reloads.

    const CART_KEY = 'hami_cart';

    /**
     * Load cart from sessionStorage
     * @returns {Array} cart items
     */
    function loadCart() {
        try {
            const data = sessionStorage.getItem(CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Save cart to sessionStorage
     * @param {Array} cart
     */
    function saveCart(cart) {
        sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // Active cart array
    let cart = loadCart();

    // ============================================
    // 3. Product Grid Rendering & Filtering
    // ============================================

    const shopGrid = document.getElementById('shopGrid');
    const shopEmpty = document.getElementById('shopEmpty');
    let activeCategory = 'all';

    /**
     * Render product cards into the grid.
     * @param {string} category - category filter key or 'all'
     */
    function renderProducts(category) {
        if (!shopGrid) return;

        activeCategory = category;
        const filtered = category === 'all'
            ? PRODUCTS
            : PRODUCTS.filter(p => p.category === category);

        if (filtered.length === 0) {
            shopGrid.innerHTML = '';
            if (shopEmpty) shopEmpty.style.display = 'block';
            return;
        }

        if (shopEmpty) shopEmpty.style.display = 'none';

        shopGrid.innerHTML = filtered.map(product => `
            <div class="shop-product-card animate-on-scroll" data-id="${product.id}">
                <div class="shop-card-img">
                    <span class="shop-badge">${product.category}</span>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="shop-card-body">
                    <h5>${product.name}</h5>
                    <p class="shop-card-desc">${product.description}</p>
                    <div class="shop-card-price">$${product.price.toFixed(2)}</div>
                    <button class="shop-add-btn" onclick="HAMI_Cart.addToCart(${product.id})" id="addBtn-${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        // Re-trigger scroll animations for newly rendered cards
        triggerScrollAnimations();
    }

    /**
     * Trigger IntersectionObserver or fallback animation check
     * for dynamically inserted .animate-on-scroll elements.
     */
    function triggerScrollAnimations() {
        const els = document.querySelectorAll('.shop-product-card.animate-on-scroll:not(.animated)');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            els.forEach(el => observer.observe(el));
        } else {
            els.forEach(el => el.classList.add('animated'));
        }
    }

    /**
     * Bind category filter buttons
     */
    function initFilters() {
        const filtersContainer = document.getElementById('shopFilters');
        if (!filtersContainer) return;

        filtersContainer.addEventListener('click', function (e) {
            const btn = e.target.closest('.shop-filter-btn');
            if (!btn) return;

            // Update active state
            filtersContainer.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            renderProducts(btn.dataset.category);
        });
    }

    // ============================================
    // 4. Cart Operations (Add / Remove / Update)
    // ============================================

    /**
     * Add a product to the cart
     * @param {number} productId
     */
    function addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existing = cart.find(item => item.product.id === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }

        saveCart(cart);
        updateCartUI();

        // Brief "Added" feedback on the button
        const addBtn = document.getElementById('addBtn-' + productId);
        if (addBtn) {
            addBtn.classList.add('added');
            addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                addBtn.classList.remove('added');
                addBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 1200);
        }

        showToast(`${product.name} added to cart`);
    }

    /**
     * Remove a product from the cart entirely
     * @param {number} productId
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.product.id !== productId);
        saveCart(cart);
        updateCartUI();
        renderCartSidebar();
    }

    /**
     * Update quantity for a cart item
     * @param {number} productId
     * @param {number} delta - +1 or -1
     */
    function updateQty(productId, delta) {
        const item = cart.find(i => i.product.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart(cart);
        updateCartUI();
        renderCartSidebar();
    }

    /**
     * Clear all items from the cart
     */
    function clearCart() {
        cart = [];
        saveCart(cart);
        updateCartUI();
        renderCartSidebar();
        showToast('Cart cleared');
    }

    // ============================================
    // 5. Cart Sidebar UI Rendering
    // ============================================

    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartSidebarBody = document.getElementById('cartSidebarBody');
    const cartSidebarFooter = document.getElementById('cartSidebarFooter');
    const cartEmptyMsg = document.getElementById('cartEmptyMsg');
    const cartSubtotalEl = document.getElementById('cartSubtotal');

    /**
     * Open the cart sidebar
     */
    function openSidebar() {
        renderCartSidebar();
        if (cartOverlay) cartOverlay.classList.add('open');
        if (cartSidebar) cartSidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the cart sidebar
     */
    function closeSidebar() {
        if (cartOverlay) cartOverlay.classList.remove('open');
        if (cartSidebar) cartSidebar.classList.remove('open');
        document.body.style.overflow = '';
    }

    /**
     * Render the sidebar contents based on current cart state
     */
    function renderCartSidebar() {
        if (!cartSidebarBody) return;

        if (cart.length === 0) {
            // Show empty state
            if (cartEmptyMsg) cartEmptyMsg.style.display = 'block';
            if (cartSidebarFooter) cartSidebarFooter.style.display = 'none';
            // Remove any rendered items
            const existingItems = cartSidebarBody.querySelectorAll('.cart-item');
            existingItems.forEach(el => el.remove());
            return;
        }

        if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';
        if (cartSidebarFooter) cartSidebarFooter.style.display = 'block';

        // Build items HTML
        const itemsHTML = cart.map(item => {
            const lineTotal = item.product.price * item.quantity;
            return `
                <div class="cart-item" data-id="${item.product.id}">
                    <div class="cart-item-img">
                        <img src="${item.product.image}" alt="${item.product.name}">
                    </div>
                    <div class="cart-item-info">
                        <h6>${item.product.name}</h6>
                        <span class="cart-item-price">$${item.product.price.toFixed(2)}</span>
                        <div class="cart-qty-controls">
                            <button onclick="HAMI_Cart.updateQty(${item.product.id}, -1)" aria-label="Decrease quantity">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button onclick="HAMI_Cart.updateQty(${item.product.id}, 1)" aria-label="Increase quantity">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">Line total: $${lineTotal.toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="HAMI_Cart.removeFromCart(${item.product.id})" aria-label="Remove item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }).join('');

        // Replace only the cart items area (keep empty msg element)
        const existingItems = cartSidebarBody.querySelectorAll('.cart-item');
        existingItems.forEach(el => el.remove());
        cartSidebarBody.insertAdjacentHTML('beforeend', itemsHTML);

        // Update subtotal
        const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
    }

    /**
     * Update all cart count badges on the page
     */
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Desktop toolbar badge
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) cartCountEl.textContent = totalItems;

        // Mobile FAB badge
        const cartFabBadge = document.getElementById('cartFabBadge');
        if (cartFabBadge) cartFabBadge.textContent = totalItems;
    }

    // ============================================
    // 6. Send Enquiry via mailto
    // ============================================

    /** Email address to receive enquiries */
    const ENQUIRY_EMAIL = 'sales@hamillc.com';

    /**
     * Compose a mailto: link with the cart details and open it.
     * Format:
     *   Subject: Product Enquiry from HAMI LLC Shop
     *   Body:    table of product name, qty, unit price, line total
     */
    function sendEnquiry() {
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }

        const subject = encodeURIComponent('Product Enquiry from HAMI LLC Shop');

        // Build a readable text body
        let body = 'Hello,\n\n';
        body += 'I would like to enquire about the following products:\n\n';
        body += '-----------------------------------------------\n';

        let grandTotal = 0;
        cart.forEach((item, index) => {
            const lineTotal = item.product.price * item.quantity;
            grandTotal += lineTotal;
            body += `${index + 1}. ${item.product.name}\n`;
            body += `   Qty: ${item.quantity}  |  Unit Price: $${item.product.price.toFixed(2)}  |  Subtotal: $${lineTotal.toFixed(2)}\n`;
            body += '-----------------------------------------------\n';
        });

        body += `\nGrand Total: $${grandTotal.toFixed(2)}\n\n`;
        body += 'Please provide a formal quotation for the above items.\n\n';
        body += 'Thank you.\n';

        const mailtoLink = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;

        // Open the user's email client
        window.location.href = mailtoLink;

        showToast('Opening your email client…');
    }

    // ============================================
    // 7. Toast Notifications
    // ============================================

    let toastTimeout = null;

    /**
     * Show a brief toast notification at the bottom of the screen.
     * @param {string} message
     */
    function showToast(message) {
        // Reuse or create toast element
        let toast = document.getElementById('shopToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'shopToast';
            toast.className = 'shop-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');

        // Clear previous timeout
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ============================================
    // 8. Initialisation
    // ============================================

    document.addEventListener('DOMContentLoaded', function () {
        // Only run on pages that have the shop grid
        if (!shopGrid) return;

        // Render initial product grid
        renderProducts('all');

        // Set up category filter buttons
        initFilters();

        // Sync cart badge counts on load
        updateCartUI();
    });

    // ============================================
    // Expose public API on the global HAMI_Cart object
    // so onclick handlers in HTML can call these methods.
    // ============================================
    window.HAMI_Cart = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateQty: updateQty,
        clearCart: clearCart,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar,
        sendEnquiry: sendEnquiry
    };

})();
