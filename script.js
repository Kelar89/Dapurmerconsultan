/* script.js - Dapur Mercon Sultan Revamp v4.2 */
/* Konsep: "Etalase Modern & Interaktif" */

document.addEventListener('DOMContentLoaded', () => {

    // --- KONFIGURASI & DATA ---
    const WHATSAPP_NUMBER = '6285894448143';
    const LOCALSTORAGE_KEY = 'dapurMerconCart_v4';

    const products = [
        { id: 1, name: 'Cumi Mercon', price: 45000, salePrice: 38000, saleEndDate: '2025-12-31T23:59:59', images: ['images/cumi-mercon.png', 'images/cumi-mercon-2.png'], category: 'seafood', isBestSeller: true, stock: 4, rating: 4.9, reviews: 230, description: 'Potongan cumi segar yang menari dalam ledakan sambal mercon otentik, diracik khusus untuk para Sultan.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }] },
        { id: 2, name: 'Udang Mercon', price: 50000, images: ['images/udang-mercon-1.png', 'images/udang-mercon (2).png'], category: 'seafood', isBestSeller: true, stock: 12, rating: 4.7, reviews: 90, description: 'Udang segar pilihan, berpadu sempurna dengan sambal mercon khas kerajaan yang menggugah selera.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }] },
        { id: 3, name: 'Dendeng Bakar', price: 45000, images: ['images/dendeng.png'], category: 'non-pedas', isBestSeller: true, stock: 8, rating: 4.6, reviews: 40, description: 'Dendeng sapi premium yang dibumbui rempah kaya rasa, lalu dibakar perlahan hingga empuk dan berkaramel.', variants: [{ title: 'Level Pedas', options: ['Tidak Pedas', 'Sedang', 'Pedas'] }] },
        { id: 4, name: 'Tongkol Suwir', price: 35000, images: ['images/tongkol-suwir.png'], category: 'non-pedas', isBestSeller: false, stock: 0, rating: 4.5, reviews: 30, description: 'Suwiran ikan tongkol pilihan yang dimasak perlahan dengan bumbu rahasia hingga meresap sempurna.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas'] }] },
        { id: 5, name: 'Paket Sultan Berdua', price: 80000, images: ['images/hero-image.png'], category: 'paket', isBestSeller: false, stock: 10, description: 'Lebih hemat! Paket berisi 1x Cumi Mercon (level sedang) dan 1x Dendeng Bakar (tidak pedas) untuk makan berdua.' }
    ];

    const testimonials = [
        { name: 'Andi P.', text: 'Rasanya benar-benar premium! Cumi Mercon-nya juara, pedasnya berkelas dan bikin nagih.', img: 'images/author1.png', rating: 5 },
        { name: 'Susi W.', text: 'Sudah langganan di sini. Kualitasnya tidak pernah turun. Pengiriman juga selalu tepat waktu. Recommended!', img: 'images/author2.png', rating: 5 },
        { name: 'Budi Santoso', text: 'Packaging-nya rapi dan aman. Rasanya otentik, beda dari yang lain. Dendengnya empuk banget!', img: 'images/author3.png', rating: 4.5 }
    ];
    
    const shippingOptions = [
        { name: '-- Pilih Area --', cost: 0, eta: '' },
        { name: 'Jakarta Pusat', cost: 15000, eta: '45-60 Menit' },
        { name: 'Jakarta Selatan', cost: 18000, eta: '50-70 Menit' },
        { name: 'Jakarta Barat', cost: 17000, eta: '50-70 Menit' },
        { name: 'Jakarta Timur', cost: 17000, eta: '50-70 Menit' },
        { name: 'Jakarta Utara', cost: 20000, eta: '60-90 Menit' },
        { name: 'Bekasi', cost: 23000, eta: '60-90 Menit' },
        { name: 'Tangerang', cost: 22000, eta: '60-90 Menit' },
        { name: 'Depok', cost: 25000, eta: '60-90 Menit' }
    ];
    const promoCodes = { 'SULTAN10': { type: 'percent', value: 10 }, 'MERCONGRATIS': { type: 'fixed', value: 15000 } };

    // --- ELEMEN DOM ---
    const backToTopBtn = document.getElementById('back-to-top-btn');
    const productList = document.getElementById('product-list');
    const bestSellerList = document.getElementById('best-seller-list');
    const testimonialSwiperWrapper = document.getElementById('testimonial-swiper-wrapper');
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    const miniCart = document.getElementById('mini-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartShippingEl = document.getElementById('cart-shipping-cost');
    const cartTotalEl = document.getElementById('cart-total');
    const cartDiscountEl = document.getElementById('cart-discount-amount');
    const discountRow = document.getElementById('discount-row');
    const shippingSelect = document.getElementById('shipping-options');
    const shippingEtaRow = document.getElementById('shipping-eta-row');
    const shippingEtaEl = document.getElementById('shipping-eta');
    const promoInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoMessage = document.getElementById('promo-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const customerDataModalEl = document.getElementById('customerDataModal');
    const customerDataModal = customerDataModalEl ? new bootstrap.Modal(customerDataModalEl) : null;
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const customerForm = document.getElementById('customer-form');
    const getLocationBtn = document.getElementById('get-location-btn');
    const orderImageModalEl = document.getElementById('orderImageModal');
    const orderImageModal = orderImageModalEl ? new bootstrap.Modal(orderImageModalEl) : null;
    const invoiceContainer = document.getElementById('invoice-container');
    const productModalEl = document.getElementById('productDetailModal');
    const productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null;
    const modalProductImages = document.getElementById('modal-product-images');
    const modalTitle = document.getElementById('modal-product-title');
    const modalDescription = document.getElementById('modal-product-description');
    const modalVariantsContainer = document.getElementById('modal-variants-container');
    const modalNote = document.getElementById('modal-product-note');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    
    // --- STATE APLIKASI ---
    let cart = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
    let currentShippingCost = 0;
    let currentPromo = { code: null, amount: 0, type: null, value: 0 };
    let countdownInterval;
    let modalSwiper;

    // --- FUNGSI UTILITAS ---
    const formatCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const getProductPrice = (product) => {
        const now = new Date();
        const saleEnd = product.saleEndDate ? new Date(product.saleEndDate) : null;
        return saleEnd && now < saleEnd && product.salePrice ? product.salePrice : product.price;
    };

    // --- FUNGSI RENDER ---
    function createProductCard(product) {
        const isOutOfStock = product.stock === 0;
        const now = new Date();
        const saleEnd = product.saleEndDate ? new Date(product.saleEndDate) : null;
        const isOnSale = saleEnd && now < saleEnd && product.salePrice;
        const currentPrice = isOnSale ? product.salePrice : product.price;

        return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <img class="product-image" src="${product.images[0]}" alt="${product.name}" loading="lazy">
                    ${isOutOfStock ? '<div class="out-of-stock-badge">Stok Habis</div>' : ''}
                    ${isOnSale ? `<div class="flash-sale-timer" id="timer-${product.id}"></div>` : ''}
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="price-container">
                           <span class="fs-5 fw-bold">${formatCurrency(currentPrice)}</span>
                           ${isOnSale ? `<del class="original-price">${formatCurrency(product.price)}</del>` : ''}
                        </div>
                        ${isOutOfStock 
                            ? `<button class="btn btn-secondary btn-sm notify-stock-btn" data-name="${product.name}">Beri Tahu Saya</button>`
                            : `<button class="btn btn-primary btn-sm open-product-modal-btn" data-id="${product.id}">Pesan</button>`
                        }
                    </div>
                </div>
            </div>`;
    }

    function renderProducts(filter = 'all') {
        const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);
        productList.innerHTML = filteredProducts.map(p => `<div class="col-lg-4 col-md-6 mb-4">${createProductCard(p)}</div>`).join('');
        updateCountdownTimers();
    }
    
    function renderBestSellers() { if (bestSellerList) { bestSellerList.innerHTML = products.filter(p => p.isBestSeller).map(p => `<div class="swiper-slide h-100">${createProductCard(p)}</div>`).join(''); } }
    function renderTestimonials() { if (testimonialSwiperWrapper) { testimonialSwiperWrapper.innerHTML = testimonials.map(t => `<div class="swiper-slide h-100"><div class="testimonial-card"><img src="${t.img}" alt="${t.name}"><div><strong>${t.name}</strong></div><p class="text">"${t.text}"</p></div></div>`).join(''); } }

    // --- FUNGSI KERANJANG (CART) ---
    function saveCart() { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cart)); }
    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => { const product = products.find(p => p.id === item.id); return sum + (getProductPrice(product) * item.quantity); }, 0);
        let promoAmount = 0;
        if (currentPromo.code) { promoAmount = currentPromo.type === 'percent' ? Math.round((subtotal * currentPromo.value) / 100) : currentPromo.value; }
        currentPromo.amount = promoAmount;
        const total = subtotal + currentShippingCost - promoAmount;
        return { subtotal, promoAmount, total: total > 0 ? total : 0 };
    }
    function updateCartDisplay() {
        if (cartItemsContainer) {
            if (cart.length === 0) { cartItemsContainer.innerHTML = '<p class="text-center text-muted">Keranjang masih kosong.</p>'; } 
            else {
                cartItemsContainer.innerHTML = cart.map(item => { const product = products.find(p => p.id === item.id);
                    return `
                        <div class="cart-item">
                            <img src="${product.images[0]}" alt="${product.name}">
                            <div class="cart-item-details">
                                <strong>${product.name}</strong>
                                <div class="small text-muted">${Object.values(item.variants || {}).join(', ')}</div>
                                ${item.note ? `<div class="small text-info fst-italic mt-1">"${item.note}"</div>` : ''}
                                <div class="small mt-1">${item.quantity} x ${formatCurrency(getProductPrice(product))}</div>
                            </div>
                            <div class="cart-item-controls">
                                <div class="d-flex align-items-center mb-1">
                                    <button class="quantity-btn" data-cartid="${item.cartId}" data-action="decrease">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="quantity-btn" data-cartid="${item.cartId}" data-action="increase">+</button>
                                </div>
                                <button class="remove-item-btn btn btn-link btn-sm text-danger p-0" data-cartid="${item.cartId}">Hapus</button>
                            </div>
                        </div>`; }).join('');
            }
        }
        const { subtotal, promoAmount, total } = calculateTotal();
        if(discountRow) discountRow.style.display = promoAmount > 0 ? 'flex' : 'none';
        if(cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal);
        if(cartShippingEl) cartShippingEl.textContent = formatCurrency(currentShippingCost);
        if(cartDiscountEl) cartDiscountEl.textContent = `- ${formatCurrency(promoAmount)}`;
        if(cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        saveCart();
    }
    function addToCart(productId, quantity = 1, variants = {}, note = '', triggerButton) {
        const product = products.find(p => p.id === productId); if (!product) return;
        const existingQty = cart.filter(c => c.id === productId).reduce((s, it) => s + it.quantity, 0);
        if (product.stock && (existingQty + quantity) > product.stock) { alert('Stok tidak mencukupi.'); return; }
        const cartId = Date.now().toString(); cart.push({ cartId, id: productId, quantity, variants, note });
        updateCartDisplay();
        if (triggerButton) {
            const originalText = triggerButton.querySelector('span').textContent;
            triggerButton.querySelector('span').textContent = 'Ditambahkan ✓';
            triggerButton.disabled = true;
            setTimeout(() => { triggerButton.querySelector('span').textContent = originalText; triggerButton.disabled = false; }, 1500);
            if (floatingCartBtn) { floatingCartBtn.classList.remove('pulse'); void floatingCartBtn.offsetWidth; floatingCartBtn.classList.add('pulse'); }
        }
    }
    function changeCartQuantity(cartId, action) {
        const item = cart.find(i => i.cartId === cartId); if (!item) return;
        if (action === 'increase') item.quantity++; if (action === 'decrease') item.quantity--;
        if (item.quantity <= 0) { cart = cart.filter(i => i.cartId !== cartId); }
        updateCartDisplay();
    }
    function removeFromCart(cartId) { cart = cart.filter(i => i.cartId !== cartId); updateCartDisplay(); }

    // --- FUNGSI MODAL & INTERAKSI ---
    function openProductModal(productId) {
        const p = products.find(x => x.id === productId); if (!p || !productModal) return;
        if(modalProductImages) modalProductImages.innerHTML = p.images.map(img => `<div class="swiper-slide"><img src="${img}" alt="${p.name}"></div>`).join('');
        if(modalTitle) modalTitle.textContent = p.name;
        if(modalDescription) modalDescription.textContent = p.description;
        if(modalVariantsContainer) modalVariantsContainer.innerHTML = '';
        if(modalNote) modalNote.value = '';
        if (p.variants && p.variants.length > 0) {
            p.variants.forEach((v) => {
                const group = document.createElement('div'); group.className = 'variant-group mb-3';
                const title = document.createElement('h6'); title.className = 'variant-title fw-bold small'; title.textContent = v.title;
                const btnGroup = document.createElement('div'); btnGroup.className = 'btn-group flex-wrap'; btnGroup.setAttribute('role', 'group');
                v.options.forEach((opt, idx) => {
                    const id = `opt_${productId}_${v.title.replace(/\s+/g, '_')}_${idx}`;
                    const radio = `<input type="radio" class="btn-check" name="variant_${v.title.replace(/\s+/g, '_')}" id="${id}" value="${opt}" autocomplete="off" ${idx === 0 ? 'checked' : ''}> <label class="btn btn-outline-dark variant-option" for="${id}">${opt}</label>`;
                    btnGroup.insertAdjacentHTML('beforeend', radio);
                });
                group.appendChild(title); group.appendChild(btnGroup); modalVariantsContainer.appendChild(group);
            });
        }
        if(modalAddToCartBtn) modalAddToCartBtn.dataset.productId = productId;
        productModal.show();
    }
    
    // --- FUNGSI LAINNYA ---
    function populateShippingOptions() { if(shippingSelect) { shippingSelect.innerHTML = shippingOptions.map(opt => `<option value="${opt.cost}" data-eta="${opt.eta}">${opt.name}</option>`).join(''); } }
    function updateCountdownTimers() {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => { products.forEach(product => {
                const saleEnd = product.saleEndDate ? new Date(product.saleEndDate) : null;
                if (saleEnd && new Date() < saleEnd) { const timerEl = document.getElementById(`timer-${product.id}`);
                    if (timerEl) {
                        const now = new Date().getTime(); const distance = saleEnd.getTime() - now;
                        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
                        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const s = Math.floor((distance % (1000 * 60)) / 1000);
                        timerEl.innerHTML = `Sisa: ${d}h ${h}j ${m}m ${s}d`;
                    }}}); }, 1000);
    }
    
    // --- EVENT LISTENERS ---
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button'); // More robust
        if (!target) return;

        if (target.classList.contains('open-product-modal-btn')) { openProductModal(parseInt(target.dataset.id)); }
        if (target.classList.contains('quantity-btn')) { changeCartQuantity(target.dataset.cartid, target.dataset.action); }
        if (target.classList.contains('remove-item-btn')) { removeFromCart(target.dataset.cartid); }
        if (target.classList.contains('notify-stock-btn')) {
            const productName = target.dataset.name;
            const message = `Halo Dapur Mercon Sultan, tolong beri tahu saya jika produk "${productName}" sudah tersedia lagi ya. Terima kasih!`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        }
    });
    
    if(modalAddToCartBtn) modalAddToCartBtn.addEventListener('click', function () {
        const productId = parseInt(this.dataset.productId); const selectedVariants = {};
        if(modalVariantsContainer) modalVariantsContainer.querySelectorAll('.variant-group').forEach(group => {
            const title = group.querySelector('.variant-title').textContent;
            const checked = group.querySelector('input[type="radio"]:checked');
            if (checked) selectedVariants[title] = checked.value;
        });
        addToCart(productId, 1, selectedVariants, modalNote ? modalNote.value.trim() : '', this);
        productModal.hide();
    });
    
    if(productModalEl) productModalEl.addEventListener('shown.bs.modal', function () {
        if (modalSwiper) modalSwiper.destroy(true, true);
        modalSwiper = new Swiper('.modal-image-swiper', {
            pagination: { el: '.swiper-pagination', clickable: true },
        });
    });

    // --- INISIALISASI ---
    function init() {
        if(document.getElementById('loading-screen')) document.getElementById('loading-screen').classList.add('hidden');
        if(window.AOS) AOS.init({ once: true, duration: 800, offset: 50 });
        renderProducts(); renderBestSellers(); renderTestimonials();
        populateShippingOptions(); updateCartDisplay(); initSwipers();
        
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('mainNavbar');
            if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
            if (backToTopBtn) {
                if (window.scrollY > 300) { backToTopBtn.classList.add('visible'); } 
                else { backToTopBtn.classList.remove('visible'); }
            }
        });

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        }
        
        const filters = document.getElementById('product-filters');
        if (filters) filters.addEventListener('click', e => {
            if (e.target.classList.contains('filter-btn')) {
                filters.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                renderProducts(e.target.dataset.filter);
            }
        });

        // Other listeners
        if(floatingCartBtn) floatingCartBtn.addEventListener('click', () => { miniCart.classList.toggle('open'); cartOverlay.classList.toggle('open'); });
        if(closeCartBtn) closeCartBtn.addEventListener('click', () => { miniCart.classList.remove('open'); cartOverlay.classList.remove('open'); });
        if(cartOverlay) cartOverlay.addEventListener('click', () => { miniCart.classList.remove('open'); cartOverlay.classList.remove('open'); });
        if(checkoutBtn) checkoutBtn.addEventListener('click', () => { if (cart.length === 0) { alert('Keranjang kosong.'); return; } customerDataModal.show(); });
    }
    
    function initSwipers() {
       try {
           new Swiper('.best-sellers-swiper', { slidesPerView: 1, spaceBetween: 20, grabCursor: true, breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3, spaceBetween: 30 } } });
           new Swiper('.testimonials-swiper', { slidesPerView: 1, spaceBetween: 20, loop: false, autoplay: { delay: 5000 }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } } });
       } catch (e) { console.error('Swiper init failed', e); }
    }

    init();
});