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
    // 1. Product Catalogue Data (HAMI_PRODUCTS)
    // ============================================
    const PRODUCTS = [
        {
            id: 1,
            name: 'Self Tapping Screw (Countersunk Head) DIN7982 SS304',
            brand: 'Taiwan',
            category: 'engineering',
            price: 65.00,
            unit: '/Box',
            image: 'images/Product_Images/Self_tapping_Screws_1.jpeg',
            images: [
                'images/Product_Images/Self_tapping_Screws_1.jpeg',
                'images/Product_Images/Self_tapping_Screws_2.jpeg',
                'images/Product_Images/Self_tapping_Screws_3.jpeg'
            ],
            description: 'DIN7982 stainless steel countersunk head self tapping screws used for marine, engineering and fabrication installations. Sold per box of 100 pcs.',
            material: 'SS304 Stainless Steel',
            origin: 'Taiwan',
            sizes: [
                { size: '#12 x 4 inch',   price: 65.00, unit: '/Box' },
                { size: '#12 x 3 inch',   price: 50.00, unit: '/Box' },
                { size: '#12 x 2.5 inch', price: 35.00, unit: '/Box' }
            ]
        },
        {
            id: 5,
            name: 'Bicycle Basket',
            brand: 'Electra',
            category: 'hospitality',
            price: 230.00,
            image: 'images/Product_Images/Bicycle_Basket.jpeg',
            description: '34cm L x 25.5cm W x 25cm H. Durable steel mesh bicycle basket with powder coated finish. Includes mounting plate and handle.',
            material: 'Steel Mesh',
            color: 'Orange',
            origin: 'Import'
        },
        {
            id: 6,
            name: 'Handsfree Speaker Phone With Dialer E-30-EWP',
            brand: 'Viking Electronics',
            category: 'safety',
            price: 850.00,
            image: 'images/Product_Images/Hands_Free_Speaker_Phone.jpeg',
            description: 'Vandal resistant handsfree speaker phone with dialer designed for emergency communication. Features automatic noise canceling and stainless steel faceplate.\n\n• Automatic Noise Canceling (ANC)\n• 14 gauge 316 stainless steel faceplate\n• Heavy duty metal call button\n• Speaker and microphone protection screen\n• Security mounting screws',
            material: '316 Stainless Steel',
            origin: 'Viking Electronics'
        }
    ];

    // Expose as global HAMI_PRODUCTS
    window.HAMI_PRODUCTS = PRODUCTS;

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
            const data = localStorage.getItem(CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Save cart to localStorage
     * @param {Array} cart
     */
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
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

        shopGrid.innerHTML = filtered.map(product => {
            // Build description HTML — convert newlines and bullet points
            const descHTML = product.description
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n•/g, '<br>•');

            const isVariable = product.sizes && product.sizes.length > 0;

            // --- Image area: slider if multiple images, single image otherwise ---
            let imageHTML;
            if (product.images && product.images.length > 1) {
                const slides = product.images.map((src, i) =>
                    `<img src="${src}" alt="${product.name}" class="shop-slide${i === 0 ? ' active' : ''}" loading="lazy">`
                ).join('');
                const dots = product.images.map((_, i) =>
                    `<span class="shop-slide-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`
                ).join('');
                imageHTML = `
                    <div class="shop-product-slider" data-product="${product.id}">
                        <span class="shop-badge">${product.category}</span>
                        ${slides}
                        <button class="shop-slide-arrow shop-slide-prev" data-dir="-1" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                        <button class="shop-slide-arrow shop-slide-next" data-dir="1" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
                        <div class="shop-slide-dots">${dots}</div>
                    </div>`;
            } else {
                imageHTML = `
                    <div class="shop-product-img">
                        <span class="shop-badge">${product.category}</span>
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>`;
            }

            // --- Size selector (radio buttons) for variable products ---
            let sizeHTML = '';
            if (isVariable) {
                const radios = product.sizes.map((s, i) => `
                    <label class="shop-size-option${i === 0 ? ' selected' : ''}">
                        <input type="radio" name="size-${product.id}" value="${i}" ${i === 0 ? 'checked' : ''}>
                        <span class="shop-size-label">${s.size}</span>
                        <span class="shop-size-price">AED ${s.price.toFixed(2)}${s.unit || ''}</span>
                    </label>
                `).join('');
                sizeHTML = `<div class="shop-product-size" data-product="${product.id}">${radios}</div>`;
            }

            // --- Price display ---
            const displayPrice = isVariable ? product.sizes[0].price : product.price;
            const displayUnit  = isVariable ? (product.sizes[0].unit || '') : (product.unit || '');

            return `
            <div class="shop-product-card animate-on-scroll" data-id="${product.id}">
                ${imageHTML}
                <div class="shop-product-body">
                    <h5 class="shop-product-title">${product.name}</h5>
                    <div class="shop-product-brand">
                        <i class="fas fa-industry"></i> Brand: ${product.brand}
                    </div>
                    <p class="shop-product-desc">${descHTML}</p>
                    ${sizeHTML}
                    <div class="shop-product-price" id="price-${product.id}">AED ${displayPrice.toFixed(2)}${displayUnit}</div>
                    <div class="shop-product-actions">
                        <button class="shop-add-btn" onclick="HAMI_Cart.addToCart(${product.id})" id="addBtn-${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `}).join('');

        // Bind slider arrow & dot navigation
        initSliders();

        // Bind size-selector change events
        initSizeSelectors();

        // Re-trigger scroll animations for newly rendered cards
        triggerScrollAnimations();
    }

    // ============================================
    // 3b. Image Slider Controls
    // ============================================

    function initSliders() {
        document.querySelectorAll('.shop-product-slider').forEach(slider => {
            const slides = slider.querySelectorAll('.shop-slide');
            const dots   = slider.querySelectorAll('.shop-slide-dot');
            if (slides.length < 2) return;

            function goTo(idx) {
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                slides[idx].classList.add('active');
                dots[idx].classList.add('active');
                slider.dataset.current = idx;
            }

            slider.dataset.current = 0;

            slider.querySelectorAll('.shop-slide-arrow').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var cur = parseInt(slider.dataset.current, 10) || 0;
                    var dir = parseInt(this.dataset.dir, 10);
                    var next = (cur + dir + slides.length) % slides.length;
                    goTo(next);
                    resetAutoSlide();
                });
            });

            dots.forEach(dot => {
                dot.addEventListener('click', function (e) {
                    e.stopPropagation();
                    goTo(parseInt(this.dataset.idx, 10));
                    resetAutoSlide();
                });
            });

            // Auto-slideshow: advance every 3 seconds
            var autoInterval = null;
            function startAutoSlide() {
                autoInterval = setInterval(function () {
                    var cur = parseInt(slider.dataset.current, 10) || 0;
                    goTo((cur + 1) % slides.length);
                }, 3000);
            }
            function resetAutoSlide() {
                if (autoInterval) clearInterval(autoInterval);
                startAutoSlide();
            }
            startAutoSlide();
        });
    }

    // ============================================
    // 3c. Size Selector — dynamic price update
    // ============================================

    function initSizeSelectors() {
        document.querySelectorAll('.shop-product-size').forEach(container => {
            var productId = parseInt(container.dataset.product, 10);
            container.addEventListener('change', function (e) {
                if (e.target.type !== 'radio') return;
                var product = PRODUCTS.find(function (p) { return p.id === productId; });
                if (!product || !product.sizes) return;
                var idx = parseInt(e.target.value, 10);
                var selected = product.sizes[idx];
                // Update displayed price
                var priceEl = document.getElementById('price-' + productId);
                if (priceEl) priceEl.textContent = 'AED ' + selected.price.toFixed(2) + (selected.unit || '');
                // Highlight selected option
                container.querySelectorAll('.shop-size-option').forEach(function (opt) {
                    opt.classList.remove('selected');
                });
                e.target.closest('.shop-size-option').classList.add('selected');
            });
        });
    }

    /**
     * Trigger IntersectionObserver or fallback animation check
     * for dynamically inserted .animate-on-scroll elements.
     */
    let shopScrollObserver = null;
    function triggerScrollAnimations() {
        const els = document.querySelectorAll('.shop-product-card.animate-on-scroll:not(.animated)');
        if ('IntersectionObserver' in window) {
            if (shopScrollObserver) shopScrollObserver.disconnect();
            shopScrollObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            els.forEach(el => shopScrollObserver.observe(el));
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

        // Resolve price and name for variable products (size selector)
        let cartPrice = product.price;
        let cartName  = product.name;
        let cartId    = productId;

        if (product.sizes && product.sizes.length > 0) {
            const sizeContainer = document.querySelector('.shop-product-size[data-product="' + productId + '"]');
            let selectedIdx = 0;
            if (sizeContainer) {
                const checked = sizeContainer.querySelector('input[type="radio"]:checked');
                if (checked) selectedIdx = parseInt(checked.value, 10) || 0;
            }
            const variant = product.sizes[selectedIdx];
            cartPrice = variant.price;
            cartName  = product.name + ' (' + variant.size + ')';
            // Use a unique cart id per variant so different sizes are separate items
            cartId = productId * 100 + selectedIdx;
        }

        // Build the cart product object (keeps image for sidebar)
        const cartProduct = {
            id: cartId,
            name: cartName,
            price: cartPrice,
            image: product.image
        };

        const existing = cart.find(item => item.product.id === cartId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ product: cartProduct, quantity: 1 });
        }

        saveCart(cart);
        updateCartUI();

        // Bounce the FAB + toolbar button to draw attention
        var cartFab = document.getElementById('cartFab');
        if (cartFab) {
            cartFab.classList.remove('cart-bounce');
            void cartFab.offsetWidth;  // reflow to restart animation
            cartFab.classList.add('cart-bounce');
        }
        var cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.classList.remove('cart-bounce');
            void cartBtn.offsetWidth;
            cartBtn.classList.add('cart-bounce');
        }

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

        showToast(`${cartName} added to cart`);
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
                        <span class="cart-item-price">AED ${item.product.price.toFixed(2)}</span>
                        <div class="cart-qty-controls">
                            <button onclick="HAMI_Cart.updateQty(${item.product.id}, -1)" aria-label="Decrease quantity">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button onclick="HAMI_Cart.updateQty(${item.product.id}, 1)" aria-label="Increase quantity">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">Line total: AED ${lineTotal.toFixed(2)}</div>
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
        if (cartSubtotalEl) cartSubtotalEl.textContent = 'AED ' + subtotal.toFixed(2);
    }

    /**
     * Update all cart count badges and the sticky cart bar.
     */
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal   = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        // Desktop toolbar badge
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) cartCountEl.textContent = totalItems;

        // Mobile FAB badge
        const cartFabBadge = document.getElementById('cartFabBadge');
        if (cartFabBadge) cartFabBadge.textContent = totalItems;

        // Show / hide FAB based on cart contents
        const cartFab = document.getElementById('cartFab');
        if (cartFab) {
            if (totalItems > 0) {
                cartFab.classList.add('has-items');
            } else {
                cartFab.classList.remove('has-items');
            }
        }

        // Toolbar cart button highlight
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            if (totalItems > 0) {
                cartBtn.classList.add('has-items');
            } else {
                cartBtn.classList.remove('has-items');
            }
        }

        // Sticky cart bar at bottom
        const cartBar     = document.getElementById('cartBar');
        const cartBarText = document.getElementById('cartBarText');
        if (cartBar) {
            if (totalItems > 0 && shopSectionVisible) {
                cartBar.classList.add('visible');
                if (cartBarText) {
                    cartBarText.textContent = totalItems + (totalItems === 1 ? ' item' : ' items') + ' — AED ' + subtotal.toFixed(2);
                }
            } else {
                cartBar.classList.remove('visible');
            }
        }
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
            body += `   Qty: ${item.quantity}  |  Unit Price: AED ${item.product.price.toFixed(2)}  |  Subtotal: AED ${lineTotal.toFixed(2)}\n`;
            body += '-----------------------------------------------\n';
        });

        body += `\nGrand Total: AED ${grandTotal.toFixed(2)}\n\n`;
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
     * Show a brief toast notification at the bottom of the screen
     * with a "View Cart" action.
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

        toast.innerHTML = '<span class="shop-toast-msg">' + message + '</span>'
            + '<button class="shop-toast-action" onclick="HAMI_Cart.openSidebar()">View Cart <i class="fas fa-arrow-right"></i></button>';
        toast.classList.add('show');

        // Clear previous timeout
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ============================================
    // 8. Cart-bar viewport scoping
    // ============================================

    /** True while the shop section is in (or near) the viewport */
    var shopSectionVisible = true;

    /**
     * Use IntersectionObserver to track whether the shop products
     * section is on-screen.  When the user scrolls past it (into
     * the CTA banner / footer) the sticky cart bar is hidden so it
     * doesn't overlap unrelated content.
     */
    function initCartBarVisibility() {
        var shopSection = document.getElementById('shopProducts');
        if (!shopSection || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            shopSectionVisible = entries[0].isIntersecting;
            var cartBar = document.getElementById('cartBar');
            if (cartBar) {
                if (!shopSectionVisible) {
                    cartBar.classList.remove('visible');
                } else {
                    // Re-show only if cart actually has items
                    var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
                    if (totalItems > 0) cartBar.classList.add('visible');
                }
            }
        }, { threshold: 0 });

        observer.observe(shopSection);
    }

    // ============================================
    // 9. Initialisation
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

        // Hide sticky cart bar when user scrolls past the shop section
        initCartBarVisibility();
    });

    // ============================================
    // Expose public API on the global HAMI_Cart object
    // so onclick handlers in HTML can call these methods.
    // ============================================
    window.HAMI_Cart = {
        addToCart: addToCart,
        addItem: addToCart,       // alias requested by spec
        removeFromCart: removeFromCart,
        updateQty: updateQty,
        clearCart: clearCart,
        openSidebar: openSidebar,
        closeSidebar: closeSidebar,
        sendEnquiry: sendEnquiry
    };



})();
