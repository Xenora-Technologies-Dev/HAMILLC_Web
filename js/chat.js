/* ============================================
   HAMI Bot - Chat Widget Module
   Simulated AI Assistant for HAMI LLC
   Al Hamidiya General Trading LLC
   الحميدية للتجارة العامة ذ.م.م
   ============================================ */

(function () {
    'use strict';

    // ─── WhatsApp Config ───
    const WHATSAPP_NUMBER = '971501722409';
    const WHATSAPP_MSG = encodeURIComponent('Hello! I am interested in HAMI LLC services. Could you please provide more information?');
    const WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MSG;

    // ─── Conversation Flow Database ───
    const CONVERSATIONS = {
        greeting: {
            messages: [
                "Ahoy! ⚓ I'm <strong>HAMI Bot</strong> — your friendly assistant from Al Hamidiya General Trading LLC!",
                "I know all about <strong>Hotel And Marine Innovations</strong> — that's what HAMI stands for! 🏨🚢",
                "How can I help you today? Pick an option below or just say hello! 😊"
            ],
            quickActions: [
                { label: "🛒 View Shop", action: "shop" },
                { label: "🔧 Our Services", action: "services" },
                { label: "📦 Our Products", action: "products" },
                { label: "🏢 About HAMI", action: "about" },
                { label: "📞 Contact Us", action: "contact" },
                { label: "💬 WhatsApp", action: "whatsapp" }
            ]
        },
        shop: {
            userText: "Tell me about the Shop",
            messages: [
                "Great choice! 🛒 Our <strong>online shop</strong> features a curated selection of marine, engineering, and safety products.",
                "You can browse categories, add items to your cart, and send an enquiry directly to our sales team in Sharjah, UAE. <img src='https://flagcdn.com/w20/ae.png' alt='UAE' style='height:1em;vertical-align:middle;'>",
                "Ready to explore?"
            ],
            quickActions: [
                { label: "🛒 Go to Shop", action: "link:shop.html" },
                { label: "🔧 Our Services", action: "services" },
                { label: "💬 WhatsApp Us", action: "whatsapp" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        services: {
            userText: "What services do you offer?",
            messages: [
                "We offer a comprehensive range of services! ⚙️ Remember — HAMI = <strong>Hotel And Marine Innovations</strong>!",
                "<strong>🚢 Marine Solutions</strong> — Ship supply, maintenance & equipment<br><strong>🔧 Engineering Services</strong> — Industrial solutions & project management<br><strong>🏨 Hotel & Hospitality</strong> — Resort equipment & supplies<br><strong>📦 Trading & Procurement</strong> — Global sourcing & distribution<br><strong>🛡️ Safety & Compliance</strong> — HSE consulting & safety products",
                "Based in Sharjah <img src='https://flagcdn.com/w20/ae.png' alt='UAE' style='height:1em;vertical-align:middle;'>, we serve clients across the Middle East and beyond!"
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
                "<strong>⚓ Marine Equipment</strong> — Navigation, safety gear, deck hardware, engines & spares<br><strong>🔧 Engineering Tools</strong> — Industrial machinery, power tools, HVAC<br><strong>🛡️ Safety Products</strong> — PPE, fire safety, signage<br><strong>🏨 Hospitality Supplies</strong> — Kitchen equipment, pool systems, lighting",
                "Fun fact: Our product catalog covers everything from <em>anchor chains to air conditioners</em>! 😄"
            ],
            quickActions: [
                { label: "🛒 Go to Shop", action: "link:shop.html" },
                { label: "📄 View Products", action: "link:products.html" },
                { label: "💬 WhatsApp Order", action: "whatsapp" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        contact: {
            userText: "How can I contact you?",
            messages: [
                "We'd love to hear from you! 📞",
                "<strong>📧 Email:</strong> info@hamillc.com<br><strong>📱 Phone:</strong> +971 6 5484001<br><strong>💬 WhatsApp:</strong> +971 50 172 2409<br><strong>📍 Location:</strong> Sharjah, UAE <img src='https://flagcdn.com/w20/ae.png' alt='UAE' style='height:1em;vertical-align:middle;'>",
                "The fastest way to reach us? WhatsApp! Just tap the button below 👇"
            ],
            quickActions: [
                { label: "💬 WhatsApp Now", action: "whatsapp" },
                { label: "📝 Contact Page", action: "link:contact.html" },
                { label: "🛒 View Shop", action: "shop" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        about: {
            userText: "Tell me about HAMI LLC",
            messages: [
                "<strong>Al Hamidiya General Trading LLC</strong> — or as we like to call it, <strong>HAMI</strong>! 🏢",
                "HAMI stands for <strong>Hotel And Marine Innovations</strong>. We're incorporated under Sharjah Economic Department, UAE. <img src='https://flagcdn.com/w20/ae.png' alt='UAE' style='height:1em;vertical-align:middle;'>",
                "In Arabic, we're known as <strong>الحميدية للتجارة العامة ذ.م.م</strong>",
                "With 15+ years of experience, 500+ projects delivered, and partners in 30+ countries — we're your trusted global sourcing partner for marine, engineering, and hospitality sectors! 🌍"
            ],
            quickActions: [
                { label: "📄 About Us", action: "link:about.html" },
                { label: "🔧 Our Services", action: "services" },
                { label: "📖 Read Blog", action: "link:blog.html" },
                { label: "📞 Contact Us", action: "contact" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        marine: {
            userText: "Tell me about Marine services",
            messages: [
                "⚓ Our marine division is where it all started!",
                "We provide <strong>complete marine equipment and spare parts</strong> for:<br>• Vessels & Ships<br>• Offshore Platforms<br>• Ports & Shipyards<br>• Cruise Lines",
                "From <strong>engine spares to navigation systems</strong>, deck equipment to safety gear — if it floats, we've got it covered! 🚢",
                "All products meet international maritime standards including SOLAS, IMO, and class society approvals."
            ],
            quickActions: [
                { label: "📄 Marine Services", action: "link:services.html#marine" },
                { label: "🏨 Hotel Services", action: "hotel" },
                { label: "💬 WhatsApp Quote", action: "whatsapp" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        hotel: {
            userText: "Tell me about Hotel & Hospitality",
            messages: [
                "🏨 The 'H' in HAMI stands for <strong>Hotel</strong> — and we take it seriously!",
                "We supply everything 5-star hotels and resorts need:<br>• <strong>Commercial Kitchen</strong> equipment<br>• <strong>Pool Systems</strong> & maintenance<br>• <strong>HVAC & Refrigeration</strong><br>• <strong>Lighting & Fixtures</strong><br>• <strong>Fitness & Spa</strong> equipment<br>• <strong>Guest Amenities</strong>",
                "Working with top hospitality brands across UAE & GCC! 🌟"
            ],
            quickActions: [
                { label: "📄 Hotel Services", action: "link:services.html#hotel" },
                { label: "⚓ Marine Services", action: "marine" },
                { label: "💬 WhatsApp Us", action: "whatsapp" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        whatsapp: {
            userText: "I want to chat on WhatsApp",
            messages: [
                "Sure! 💬 WhatsApp is the fastest way to reach our team.",
                "Our WhatsApp number: <strong>+971 50 172 2409</strong>",
                "Click below to start a conversation instantly! 🚀"
            ],
            quickActions: [
                { label: "💬 Open WhatsApp", action: "link:https://wa.me/" + WHATSAPP_NUMBER + "?text=" + WHATSAPP_MSG },
                { label: "📝 Contact Page", action: "link:contact.html" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        quote: {
            userText: "I need a quote",
            messages: [
                "📋 Getting a quote is easy!",
                "You can:<br>1️⃣ Fill out our <strong>Contact Form</strong><br>2️⃣ <strong>WhatsApp</strong> us at +971 50 172 2409<br>3️⃣ Email us at <strong>info@hamillc.com</strong><br>4️⃣ Browse our <strong>Shop</strong> and add items to cart",
                "We typically respond within 24 hours for standard items! ⚡"
            ],
            quickActions: [
                { label: "💬 WhatsApp Quote", action: "whatsapp" },
                { label: "📝 Contact Form", action: "link:contact.html" },
                { label: "🛒 Browse Shop", action: "link:shop.html" },
                { label: "🏠 Back to Start", action: "restart" }
            ]
        },
        fallback: {
            messages: [
                "I appreciate your question! 🤔 For detailed inquiries, our team is available to help.",
                "You can reach us on <strong>WhatsApp: +971 50 172 2409</strong> for instant support, or check our Shop and Services for more info."
            ],
            quickActions: [
                { label: "💬 WhatsApp Us", action: "whatsapp" },
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
    let peekInterval = null;
    let mobileBubbleInterval = null;
    let mobileBubbleTimeout = null;

    // ─── DOM References (populated on init) ───
    let fab, tooltip, backdrop, modal, chatBody, closeBtn, mobileBubble;

    // ─── Initialization ───
    function init() {
        injectHTML();
        cacheDOM();
        bindEvents();
        scheduleTooltip();
        startPeekAnimation();
        startMobileBubble();
        document.body.classList.add('hamibot-active');
    }

    // ─── Inject Chat Widget HTML ───
    function injectHTML() {
        const wrapper = document.createElement('div');
        wrapper.id = 'hamibot-wrapper';
        wrapper.innerHTML = `
            <!-- Tooltip -->
            <div class="hamibot-tooltip" id="hamibotTooltip">
                <span class="tooltip-wave">👋</span> Hi, I am <strong>HAMI Bot</strong>!
            </div>

            <!-- Backdrop -->
            <div class="hamibot-backdrop" id="hamibotBackdrop"></div>

            <!-- Chat Modal -->
            <div class="hamibot-modal" id="hamibotModal">
                <div class="hamibot-header">
                    <div class="hamibot-avatar">
                        <div class="hami-robot-face">
                            <div class="robot-eyes">
                                <span class="robot-eye left"></span>
                                <span class="robot-eye right"></span>
                            </div>
                            <div class="robot-mouth"></div>
                        </div>
                    </div>
                    <div class="hamibot-header-info">
                        <h4>HAMI Bot</h4>
                        <span>Hotel And Marine Innovations</span>
                    </div>
                    <button class="hamibot-close" id="hamibotClose" aria-label="Close chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="hamibot-body" id="hamibotBody"></div>
                <div class="hamibot-footer">
                    <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="hamibot-wa-link">
                        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
                    </a>
                    <p>Powered by Al Hamidiya General Trading LLC</p>
                </div>
            </div>

            <!-- FAB Button — Animated Robot -->
            <button class="hamibot-fab" id="hamibotFab" aria-label="Open chat assistant">
                <span class="fab-icon">
                    <div class="fab-robot">
                        <div class="fab-robot-antenna"></div>
                        <div class="fab-robot-head">
                            <span class="fab-robot-eye left"></span>
                            <span class="fab-robot-eye right"></span>
                        </div>
                        <div class="fab-robot-body">
                            <span class="fab-robot-wave">👋</span>
                        </div>
                    </div>
                </span>
            </button>

            <!-- Mobile-only chat bubble -->
            <div class="hamibot-mobile-bubble" id="hamibotMobileBubble">
                👋 Hi, I am <strong>Hami Bot</strong>!
            </div>

            <!-- WhatsApp Floating Button -->
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="hamibot-whatsapp-float" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
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
        mobileBubble = document.getElementById('hamibotMobileBubble');
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

    // ─── Tooltip Scheduling (intermittent every 3-4 seconds) ───
    function scheduleTooltip() {
        // Show first tooltip after 2 seconds
        tooltipTimer = setTimeout(function () {
            if (!isOpen) {
                showTooltipBriefly();
            }
            // Then repeat every 4 seconds
            tooltipTimer = setInterval(function () {
                if (!isOpen) {
                    showTooltipBriefly();
                }
            }, 4000);
        }, 2000);
    }

    function showTooltipBriefly() {
        tooltip.classList.add('visible');
        setTimeout(function () {
            tooltip.classList.remove('visible');
        }, 2500);
    }

    // ─── Peek Animation (robot waves with tooltip) ───
    function startPeekAnimation() {
        peekInterval = setInterval(function () {
            if (!isOpen && fab) {
                fab.classList.add('peek');
                setTimeout(function () {
                    fab.classList.remove('peek');
                }, 1500);
            }
        }, 4000);
    }

    // ─── Mobile Bubble (intermittent "Hi I am Hami Bot" on small screens) ───
    function startMobileBubble() {
        // Show first bubble after 3 seconds
        mobileBubbleTimeout = setTimeout(function () {
            showMobileBubbleBriefly();
        }, 3000);
        // Then repeat every 4 seconds
        mobileBubbleInterval = setInterval(function () {
            if (!isOpen && mobileBubble) {
                showMobileBubbleBriefly();
            }
        }, 4000);
    }

    function showMobileBubbleBriefly() {
        if (!mobileBubble || isOpen) return;
        mobileBubble.classList.add('visible');
        setTimeout(function () {
            if (mobileBubble) mobileBubble.classList.remove('visible');
        }, 2500);
    }

    function stopMobileBubble() {
        clearTimeout(mobileBubbleTimeout);
        clearInterval(mobileBubbleInterval);
        if (mobileBubble) mobileBubble.classList.remove('visible');
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
        clearInterval(tooltipTimer);
        stopMobileBubble();

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

        // Restart tooltip and mobile bubble after closing
        scheduleTooltip();
        startMobileBubble();

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
                    // External links (WhatsApp) open in new tab
                    if (url.startsWith('http')) {
                        window.open(url, '_blank');
                    } else {
                        window.location.href = url;
                    }
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

        // WhatsApp action
        if (action === 'whatsapp') {
            addUserMessage("I want to chat on WhatsApp");
            setTimeout(function () {
                playConversation(CONVERSATIONS.whatsapp);
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
