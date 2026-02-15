/* ============================================
   HAMI Bot - Chat Widget Module
   Simulated AI Assistant for HAMI LLC
   ============================================ */

(function () {
    'use strict';

    // ─── Conversation Flow Database ───
    const CONVERSATIONS = {
        greeting: {
            messages: [
                "Hello! 👋 I'm <strong>HAMI Bot</strong>, your virtual assistant.",
                "I can help you learn about our services, products, and how to get in touch. What would you like to know?"
            ],
            quickActions: [
                { label: "🛒 View Shop", action: "shop" },
                { label: "🔧 Our Services", action: "services" },
                { label: "📦 Our Products", action: "products" },
                { label: "📞 Contact Us", action: "contact" }
            ]
        },
        shop: {
            userText: "Tell me about the Shop",
            messages: [
                "Great choice! 🛒 Our <strong>online shop</strong> features a curated selection of marine, engineering, and safety products.",
                "You can browse categories, add items to your cart, and send an enquiry directly to our sales team.",
                "Ready to explore?"
            ],
            quickActions: [
                { label: "🛒 Go to Shop", action: "link:shop.html" },
                { label: "🔧 Our Services", action: "services" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        services: {
            userText: "What services do you offer?",
            messages: [
                "We offer a comprehensive range of services! ⚙️",
                "<strong>• Marine Solutions</strong> — Ship supply, maintenance & equipment<br><strong>• Engineering Services</strong> — Industrial solutions & project management<br><strong>• Trading & Procurement</strong> — Global sourcing & distribution<br><strong>• Safety & Compliance</strong> — HSE consulting & safety products",
                "Want to learn more about a specific service?"
            ],
            quickActions: [
                { label: "📄 View Services", action: "link:services.html" },
                { label: "📦 Our Products", action: "products" },
                { label: "📞 Contact Us", action: "contact" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        products: {
            userText: "Show me your products",
            messages: [
                "We supply a wide range of products across key industries! 📦",
                "<strong>Marine Equipment</strong> — Navigation, safety gear, deck hardware<br><strong>Engineering Tools</strong> — Industrial machinery, power tools<br><strong>Safety Products</strong> — PPE, fire safety, signage<br><strong>Hospitality Supplies</strong> — Kitchen, housekeeping, F&B",
                "You can browse and order in our online shop!"
            ],
            quickActions: [
                { label: "🛒 Go to Shop", action: "link:shop.html" },
                { label: "📄 View Products", action: "link:products.html" },
                { label: "📞 Contact Us", action: "contact" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        contact: {
            userText: "How can I contact you?",
            messages: [
                "We'd love to hear from you! 📞",
                "<strong>📧 Email:</strong> sales@hamillc.com<br><strong>📱 Phone:</strong> +971 XX XXX XXXX<br><strong>📍 Location:</strong> Dubai, UAE",
                "You can also fill out the contact form on our Contact page."
            ],
            quickActions: [
                { label: "📝 Contact Page", action: "link:contact.html" },
                { label: "🛒 View Shop", action: "shop" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        about: {
            userText: "Tell me about HAMI LLC",
            messages: [
                "AL HAMIDIYAH GEN TR LLC (HAMI) is a trusted partner in engineering, marine, and industrial solutions. 🏢",
                "Based in <strong>Dubai, UAE</strong>, we serve clients across the Middle East with quality products, reliable services, and deep industry expertise.",
                "Our commitment to excellence drives everything we do!"
            ],
            quickActions: [
                { label: "📄 About Us", action: "link:about.html" },
                { label: "🔧 Our Services", action: "services" },
                { label: "📞 Contact Us", action: "contact" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        fallback: {
            messages: [
                "I appreciate your question! 🤔 For detailed inquiries, our team is available to help.",
                "You can reach out via the Contact page or check our Shop and Services for more info."
            ],
            quickActions: [
                { label: "📞 Contact Us", action: "contact" },
                { label: "🛒 View Shop", action: "shop" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        }
    };

    // ─── State ───
    let isOpen = false;
    let isAnimating = false;
    let tooltipTimer = null;
    let hasShownTooltip = false;

    // ─── DOM References (populated on init) ───
    let fab, tooltip, backdrop, modal, chatBody, closeBtn;

    // ─── Initialization ───
    function init() {
        injectHTML();
        cacheDOM();
        bindEvents();
        scheduleTooltip();
        document.body.classList.add('hamibot-active');
    }

    // ─── Inject Chat Widget HTML ───
    function injectHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = 'hamibot-wrapper';
        wrapper.innerHTML = `
            <!-- Tooltip -->
            <div class="hamibot-tooltip" id="hamibotTooltip">Ask HAMI Bot 🤖</div>

            <!-- Backdrop -->
            <div class="hamibot-backdrop" id="hamibotBackdrop"></div>

            <!-- Chat Modal -->
            <div class="hamibot-modal" id="hamibotModal">
                <div class="hamibot-header">
                    <div class="hamibot-avatar">🤖</div>
                    <div class="hamibot-header-info">
                        <h4>HAMI Bot</h4>
                        <span>Always here to help</span>
                    </div>
                    <button class="hamibot-close" id="hamibotClose" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="hamibot-body" id="hamibotBody"></div>
                <div class="hamibot-footer">
                    <p>Powered by HAMI LLC &bull; Automated Assistant</p>
                </div>
            </div>

            <!-- FAB Button -->
            <button class="hamibot-fab" id="hamibotFab" aria-label="Open chat assistant">
                <span class="fab-icon"><i class="fas fa-comment-dots"></i></span>
            </button>
        `;
        document.body.appendChild(wrapper);
    }

    // ─── Cache DOM Elements ───
    function cacheDOM() {
        fab = document.getElementById('hamibotFab');
        tooltip = document.getElementById('hamibotTooltip');
        backdrop = document.getElementById('hamibotBackdrop');
        modal = document.getElementById('hamibotModal');
        chatBody = document.getElementById('hamibotBody');
        closeBtn = document.getElementById('hamibotClose');
    }

    // ─── Bind Events ───
    function bindEvents() {
        fab.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', closeChat);
        backdrop.addEventListener('click', closeChat);

        // Keyboard: Escape to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) closeChat();
        });
    }

    // ─── Tooltip Scheduling ───
    function scheduleTooltip() {
        if (hasShownTooltip) return;
        tooltipTimer = setTimeout(function () {
            if (!isOpen) {
                tooltip.classList.add('visible');
                hasShownTooltip = true;
                // Auto-hide after 5 seconds
                setTimeout(function () {
                    tooltip.classList.remove('visible');
                }, 5000);
            }
        }, 3000);
    }

    // ─── Toggle Chat ───
    function toggleChat() {
        if (isAnimating) return;
        isOpen ? closeChat() : openChat();
    }

    // ─── Open Chat ───
    function openChat() {
        isAnimating = true;
        isOpen = true;
        tooltip.classList.remove('visible');
        clearTimeout(tooltipTimer);

        fab.classList.add('open');
        backdrop.classList.add('open');
        modal.classList.add('open');

        // Start conversation if chat body is empty
        if (!chatBody.children.length) {
            startConversation();
        }

        setTimeout(function () { isAnimating = false; }, 350);
    }

    // ─── Close Chat ───
    function closeChat() {
        isAnimating = true;
        isOpen = false;

        fab.classList.remove('open');
        backdrop.classList.remove('open');
        modal.classList.remove('open');

        setTimeout(function () { isAnimating = false; }, 350);
    }

    // ─── Start Conversation (Greeting) ───
    function startConversation() {
        chatBody.innerHTML = '';
        playConversation(CONVERSATIONS.greeting);
    }

    // ─── Play a Conversation Flow ───
    function playConversation(flow) {
        // Show typing indicator
        showTyping();

        let delay = 600;
        const messages = flow.messages;

        messages.forEach(function (msg, idx) {
            setTimeout(function () {
                removeTyping();
                addBotMessage(msg);

                // Show typing for next message
                if (idx < messages.length - 1) {
                    showTyping();
                }

                // After last message, show quick actions
                if (idx === messages.length - 1 && flow.quickActions) {
                    setTimeout(function () {
                        addQuickActions(flow.quickActions);
                        scrollToBottom();
                    }, 300);
                }

                scrollToBottom();
            }, delay * (idx + 1));
        });
    }

    // ─── Add Bot Message Bubble ───
    function addBotMessage(html) {
        const div = document.createElement('div');
        div.className = 'hamibot-msg bot';
        div.innerHTML = html;
        chatBody.appendChild(div);
    }

    // ─── Add User Message Bubble ───
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'hamibot-msg user';
        div.textContent = text;
        chatBody.appendChild(div);
        scrollToBottom();
    }

    // ─── Add Quick Action Buttons ───
    function addQuickActions(actions) {
        const container = document.createElement('div');
        container.className = 'hamibot-quick-actions';

        actions.forEach(function (item) {
            const btn = document.createElement('button');
            btn.className = 'hamibot-quick-btn';
            btn.textContent = item.label;
            btn.addEventListener('click', function () {
                handleAction(item, container);
            });
            container.appendChild(btn);
        });

        chatBody.appendChild(container);
        scrollToBottom();
    }

    // ─── Handle Quick Action Click ───
    function handleAction(item, actionsContainer) {
        // Disable all quick action buttons
        var buttons = actionsContainer.querySelectorAll('.hamibot-quick-btn');
        buttons.forEach(function (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
        });

        var action = item.action;

        // Link actions → navigate
        if (action.startsWith('link:')) {
            var url = action.replace('link:', '');
            addUserMessage(item.label.replace(/[^\w\s]/g, '').trim());
            setTimeout(function () {
                addBotMessage("Taking you there now! 🚀");
                setTimeout(function () {
                    window.location.href = url;
                }, 800);
            }, 400);
            return;
        }

        // Restart
        if (action === 'restart') {
            addUserMessage("Start over");
            setTimeout(function () {
                startConversation();
            }, 500);
            return;
        }

        // Conversation flows
        var flow = CONVERSATIONS[action];
        if (flow) {
            addUserMessage(flow.userText || item.label.replace(/[^\w\s]/g, '').trim());
            setTimeout(function () {
                playConversation(flow);
            }, 500);
        } else {
            addUserMessage(item.label);
            setTimeout(function () {
                playConversation(CONVERSATIONS.fallback);
            }, 500);
        }
    }

    // ─── Typing Indicator ───
    function showTyping() {
        var existing = chatBody.querySelector('.hamibot-typing');
        if (existing) return;

        var div = document.createElement('div');
        div.className = 'hamibot-typing';
        div.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(div);
        scrollToBottom();
    }

    function removeTyping() {
        var typingEl = chatBody.querySelector('.hamibot-typing');
        if (typingEl) typingEl.remove();
    }

    // ─── Scroll Chat to Bottom ───
    function scrollToBottom() {
        requestAnimationFrame(function () {
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    // ─── Boot on DOM Ready ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
