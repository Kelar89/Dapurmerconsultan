/* script.js - Dapur Mercon Sultan Revamp v3.0 */
/* Konsep: "Etalase Modern & Bersih" */

document.addEventListener('DOMContentLoaded', () => {

    const WHATSAPP_NUMBER = '6285894448143';
    const LOCALSTORAGE_KEY = 'dapurMerconCart_v3';

    const products = [
        { id: 1, name: 'Cumi Mercon', price: 45000, images: ['images/cumi-mercon.png'], category: 'seafood', isBestSeller: true, stock: 4, rating: 4.9, reviews: 230, description: 'Potongan cumi segar yang menari dalam ledakan sambal mercon otentik, diracik khusus untuk para Sultan.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }] },
        { id: 2, name: 'Udang Mercon', price: 50000, images: ['images/udang-mercon-1.png'], category: 'seafood', isBestSeller: true, stock: 12, rating: 4.7, reviews: 90, description: 'Udang segar pilihan, berpadu sempurna dengan sambal mercon khas kerajaan yang menggugah selera.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }] },
        { id: 3, name: 'Dendeng Bakar', price: 45000, images: ['images/dendeng.png'], category: 'non-pedas', isBestSeller: true, stock: 8, rating: 4.6, reviews: 40, description: 'Dendeng sapi premium yang dibumbui rempah kaya rasa, lalu dibakar perlahan hingga empuk dan berkaramel.', variants: [{ title: 'Level Pedas', options: ['Tidak Pedas', 'Sedang', 'Pedas'] }] },
        { id: 4, name: 'Tongkol Suwir', price: 35000, images: ['images/tongkol-suwir.png'], category: 'non-pedas', isBestSeller: false, stock: 15, rating: 4.5, reviews: 30, description: 'Suwiran ikan tongkol pilihan yang dimasak perlahan dengan bumbu rahasia hingga meresap sempurna.', variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas'] }] }
    ];

    const testimonials = [
        { name: 'Andi P.', text: 'Rasanya benar-benar premium! Cumi Mercon-nya juara, pedasnya berkelas dan bikin nagih.', img: 'images/author1.png', rating: 5 },
        { name: 'Susi W.', text: 'Sudah langganan di sini. Kualitasnya tidak pernah turun. Pengiriman juga selalu tepat waktu. Recommended!', img: 'images/author2.png', rating: 5 },
        { name: 'Budi Santoso', text: 'Packaging-nya rapi dan aman. Rasanya otentik, beda dari yang lain. Dendengnya empuk banget!', img: 'images/author3.png', rating: 4.5 }
    ];

    const shippingOptions = { '-- Pilih Area --': 0, 'Jakarta Pusat': 15000, 'Jakarta Selatan': 18000, 'Jakarta Barat': 17000, 'Jakarta Timur': 17000, 'Jakarta Utara': 20000, 'Bekasi': 23000, 'Tangerang': 22000, 'Depok': 25000 };
    const promoCodes = { 'SULTAN10': { type: 'percent', value: 10 }, 'MERCONGRATIS': { type: 'fixed', value: 15000 } };

    const navbar = document.getElementById('mainNavbar'), bestSellerList = document.getElementById('best-seller-list'), productList = document.getElementById('product-list'), testimonialSwiperWrapper = document.getElementById('testimonial-swiper-wrapper'), floatingCartBtn = document.getElementById('floating-cart-btn'), miniCart = document.getElementById('mini-cart'), closeCartBtn = document.getElementById('close-cart'), cartOverlay = document.getElementById('cart-overlay'), cartItemsContainer = document.getElementById('cart-items'), cartCountBadge = document.getElementById('cart-count'), cartSubtotalEl = document.getElementById('cart-subtotal'), cartShippingEl = document.getElementById('cart-shipping-cost'), cartDiscountEl = document.getElementById('cart-discount-amount'), shippingSelect = document.getElementById('shipping-options'), promoInput = document.getElementById('promo-code'), applyPromoBtn = document.getElementById('apply-promo-btn'), promoMessage = document.getElementById('promo-message'), discountRow = document.getElementById('discount-row'), checkoutBtn = document.getElementById('checkout-btn'), productModalEl = document.getElementById('productDetailModal'), productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null, modalImage = document.getElementById('modal-product-image'), modalTitle = document.getElementById('modal-product-title'), modalDescription = document.getElementById('modal-product-description'), modalVariantsContainer = document.getElementById('modal-variants-container'), modalNote = document.getElementById('modal-product-note'), modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn'), customerDataModalEl = document.getElementById('customerDataModal'), customerDataModal = customerDataModalEl ? new bootstrap.Modal(customerDataModalEl) : null, sendWhatsappBtn = document.getElementById('send-whatsapp-btn'), customerForm = document.getElementById('customer-form');
    
    let cart = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [], currentShippingCost = 0, currentPromo = { code: null, amount: 0 };
    const formatCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const isDesktop = () => !/Mobi|Android/i.test(navigator.userAgent);
    
    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <img class="product-image" src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fs-5 fw-bold">${formatCurrency(product.price)}</span>
                        <button class="btn btn-primary btn-sm open-product-modal-btn" data-id="${product.id}">Pesan</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderProducts() { if (!productList) return; productList.innerHTML = products.map(p => `<div class="col-lg-4 col-md-6" data-aos="fade-up">${createProductCard(p)}</div>`).join(''); }
    function renderBestSellers() { if (!bestSellerList) return; bestSellerList.innerHTML = products.filter(p => p.isBestSeller).map(p => `<div class="swiper-slide h-100">${createProductCard(p)}</div>`).join(''); }
    function renderTestimonials() { if (!testimonialSwiperWrapper) return; testimonialSwiperWrapper.innerHTML = testimonials.map(t => { const stars = '★'.repeat(Math.floor(t.rating)) + (t.rating % 1 !== 0 ? '☆' : ''); return `<div class="swiper-slide h-100"><div class="testimonial-card"><img src="${t.img}" alt="${t.name}"><div class="name">${t.name}</div><div class="rating">${stars}</div><p class="text">"${t.text}"</p></div></div>`; }).join(''); }
    
    function saveCart() { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cart)); }
    function calculateTotal() { const subtotal = cart.reduce((sum, it) => sum + (products.find(p => p.id === it.id).price * it.quantity), 0); let promoAmount = 0; const promo = currentPromo.code ? promoCodes[currentPromo.code] : null; if (promo) { promoAmount = promo.type === 'percent' ? Math.round((subtotal * promo.value) / 100) : promo.value; } return { subtotal, promoAmount, total: subtotal + currentShippingCost - promoAmount }; }
    function updateCartDisplay() { if (!cartItemsContainer) return; if (cart.length === 0) { cartItemsContainer.innerHTML = '<p class="text-center text-muted">Keranjang masih kosong.</p>'; } else { cartItemsContainer.innerHTML = cart.map(i => { const prod = products.find(p => p.id === i.id); return ` <div class="cart-item"> <img src="${prod.images[0]}" alt="${prod.name}"> <div class="cart-item-details"> <strong>${prod.name}</strong> <div class="small text-muted">${Object.entries(i.variants || {}).map(([k,v])=>`${k}: ${v}`).join(', ')}</div> <div class="small mt-1">${formatCurrency(prod.price * i.quantity)}</div> </div> <div class="cart-item-controls"> <div class="d-flex align-items-center mb-1"> <button class="quantity-btn" data-cartid="${i.cartId}" data-action="decrease">-</button> <span class="mx-2">${i.quantity}</span> <button class="quantity-btn" data-cartid="${i.cartId}" data-action="increase">+</button> </div> <button class="remove-item-btn btn btn-link btn-sm text-danger p-0" data-cartid="${i.cartId}">Hapus</button> </div> </div> `; }).join(''); } const { subtotal, promoAmount } = calculateTotal(); if (discountRow) { discountRow.style.display = promoAmount > 0 ? 'flex' : 'none'; } if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal); if (cartShippingEl) cartShippingEl.textContent = formatCurrency(currentShippingCost); if (cartDiscountEl) cartDiscountEl.textContent = `- ${formatCurrency(promoAmount)}`; currentPromo.amount = promoAmount; const totalItems = cart.reduce((s, it) => s + it.quantity, 0); if (cartCountBadge) { cartCountBadge.textContent = totalItems; cartCountBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none'; } saveCart(); }
    function addToCart(productId, quantity = 1, variants = {}, note = '', triggerButton) { const product = products.find(p => p.id === productId); if (!product) return; const existingQty = cart.filter(c => c.id === productId).reduce((s, it) => s + it.quantity, 0); if (product.stock && (existingQty + quantity) > product.stock) { alert('Stok tidak mencukupi.'); return; } const cartId = Date.now().toString(); cart.push({ cartId, id: productId, quantity, variants, note }); updateCartDisplay(); if (triggerButton) { const originalText = triggerButton.querySelector('span').textContent; triggerButton.querySelector('span').textContent = 'Ditambahkan ✓'; triggerButton.disabled = true; setTimeout(() => { triggerButton.querySelector('span').textContent = originalText; triggerButton.disabled = false; }, 1500); if (floatingCartBtn) { floatingCartBtn.classList.remove('pulse'); void floatingCartBtn.offsetWidth; floatingCartBtn.classList.add('pulse'); } } }
    function changeCartQuantity(cartId, action) { const item = cart.find(i => i.cartId === cartId); if (!item) return; if (action === 'increase') item.quantity++; if (action === 'decrease') item.quantity--; if (item.quantity <= 0) { cart = cart.filter(i => i.cartId !== cartId); } updateCartDisplay(); }
    function removeFromCart(cartId) { cart = cart.filter(i => i.cartId !== cartId); updateCartDisplay(); }
    function populateShippingOptions() { if (!shippingSelect) return; shippingSelect.innerHTML = ''; Object.keys(shippingOptions).forEach(k => { const opt = document.createElement('option'); opt.value = shippingOptions[k]; opt.text = k; shippingSelect.appendChild(opt); }); shippingSelect.addEventListener('change', (e) => { currentShippingCost = parseInt(e.target.value) || 0; updateCartDisplay(); }); }
    function openProductModal(productId) {
        const p = products.find(x => x.id === productId); if (!p || !productModal) return;
        if (modalImage) { modalImage.src = p.images[0]; modalImage.alt = p.name; }
        if (modalTitle) modalTitle.textContent = p.name;
        if (modalDescription) modalDescription.textContent = p.description;
        if (modalVariantsContainer) modalVariantsContainer.innerHTML = '';
        if (modalNote) modalNote.value = '';
        if (p.variants && p.variants.length > 0) {
            p.variants.forEach((v) => {
                const group = document.createElement('div');
                group.className = 'variant-group mb-3';
                const title = document.createElement('h6');
                title.className = 'variant-title fw-bold small';
                title.textContent = v.title;
                const btnGroup = document.createElement('div');
                btnGroup.className = 'btn-group flex-wrap';
                btnGroup.setAttribute('role', 'group');
                v.options.forEach((opt, idx) => {
                    const id = `opt_${productId}_${v.title.replace(/\s+/g, '_')}_${idx}`;
                    const radio = `<input type="radio" class="btn-check" name="variant_${v.title.replace(/\s+/g, '_')}" id="${id}" value="${opt}" autocomplete="off" ${idx === 0 ? 'checked' : ''}> <label class="btn btn-outline-dark variant-option" for="${id}">${opt}</label>`;
                    btnGroup.insertAdjacentHTML('beforeend', radio);
                });
                group.appendChild(title);
                group.appendChild(btnGroup);
                modalVariantsContainer.appendChild(group);
            });
        }
        if (modalAddToCartBtn) modalAddToCartBtn.dataset.productId = productId;
        productModal.show();
    }
    function getCustomerData() { return { name: document.getElementById('customer-name')?.value, phone: document.getElementById('customer-phone')?.value, street: document.getElementById('customer-address-street')?.value, rt: document.getElementById('customer-rt')?.value, rw: document.getElementById('customer-rw')?.value, kelurahan: document.getElementById('customer-kelurahan')?.value, kecamatan: document.getElementById('customer-kecamatan')?.value, city: document.getElementById('customer-city')?.value, postalCode: document.getElementById('customer-postal-code')?.value, locationLink: document.getElementById('customer-location-link')?.value }; }
    function buildWhatsAppMessage(customerData) { if (cart.length === 0) { return null; } const { subtotal, promoAmount, total } = calculateTotal(); const orderId = new Date().getTime().toString().slice(-6); let message = `*Pesan Baru dari Website Dapur Mercon Sultan*
-----------------------------------

*Berikut adalah detail pelanggan:*
  • *Nama:* ${customerData.name}
  • *No. HP:* ${customerData.phone}
  • *Alamat:* ${customerData.street}, RT ${customerData.rt}/RW ${customerData.rw}, Kel. ${customerData.kelurahan}, Kec. ${customerData.kecamatan}, ${customerData.city} ${customerData.postalCode}
  • *Pinpoint Lokasi:* ${customerData.locationLink || 'Tidak dibagikan'}

-----------------------------------
*Detail Pesanan (Order ID: ${orderId}):*
`; cart.forEach(it => { const p = products.find(x => x.id === it.id); const variants = Object.entries(it.variants || {}).map(([k, v]) => `    - ${k}: ${v}`).join('\n'); message += `
*${p.name}*
  - Jumlah: ${it.quantity} x ${formatCurrency(p.price)}
${variants ? variants + '\n' : ''}${it.note ? `  - Catatan: ${it.note}\n` : ''}`; }); message += `
-----------------------------------
*Rincian Pembayaran:*
  • *Subtotal:* ${formatCurrency(subtotal)}
  • *Ongkir:* ${formatCurrency(currentShippingCost)}
${promoAmount > 0 ? `  • *Diskon (${currentPromo.code}):* -${formatCurrency(promoAmount)}` : ''}
  • *TOTAL:* *${formatCurrency(total > 0 ? total : 0)}*
-----------------------------------

Mohon segera diproses. Terima kasih.`; return message; }
    
    function initSwipers() { try { new Swiper('.best-sellers-swiper', { slidesPerView: 1, spaceBetween: 20, grabCursor: true, breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3, spaceBetween: 30 } } }); new Swiper('.testimonials-swiper', { slidesPerView: 1, spaceBetween: 20, loop: false, autoplay: { delay: 5000 }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 992: { slidesPerView: 3, spaceBetween: 30 } } }); } catch (err) { console.warn('Swiper init error.', err); } }
    
    // --- EVENT LISTENERS ---
    if (floatingCartBtn) floatingCartBtn.addEventListener('click', () => { miniCart.classList.toggle('open'); cartOverlay.classList.toggle('open'); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => { miniCart.classList.remove('open'); cartOverlay.classList.remove('open'); });
    if (cartOverlay) cartOverlay.addEventListener('click', () => { miniCart.classList.remove('open'); cartOverlay.classList.remove('open'); });
    document.body.addEventListener('click', (e) => { const t = e.target; if (t.closest('.open-product-modal-btn')) { openProductModal(parseInt(t.closest('.open-product-modal-btn').dataset.id)); } if (t.closest('.quantity-btn')) { changeCartQuantity(t.closest('.quantity-btn').dataset.cartid, t.closest('.quantity-btn').dataset.action); } if (t.closest('.remove-item-btn')) { removeFromCart(t.closest('.remove-item-btn').dataset.cartid); } });
    if (modalAddToCartBtn) { modalAddToCartBtn.addEventListener('click', function () { const productId = parseInt(this.dataset.productId); const selectedVariants = {}; if (modalVariantsContainer) { modalVariantsContainer.querySelectorAll('.variant-group').forEach(group => { const title = group.querySelector('.variant-title').textContent; const checked = group.querySelector('input[type="radio"]:checked'); if (checked) selectedVariants[title] = checked.value; }); } addToCart(productId, 1, selectedVariants, modalNote ? modalNote.value.trim() : '', this); if (productModal) productModal.hide(); }); }
    if (checkoutBtn) { checkoutBtn.addEventListener('click', () => { if (cart.length === 0) { alert('Keranjang kosong.'); return; } customerDataModal.show(); }); }
    if (sendWhatsappBtn) { sendWhatsappBtn.addEventListener('click', () => { if (!customerForm.checkValidity()) { customerForm.classList.add('was-validated'); return; } const rawMessage = buildWhatsAppMessage(getCustomerData()); if (rawMessage) { const baseUrl = isDesktop() ? 'https://web.whatsapp.com/send' : 'https://api.whatsapp.com/send'; window.open(`${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(rawMessage)}`, '_blank'); customerDataModal.hide(); } }); }
    
    // --- INISIALISASI ---
    function init() {
        if (document.getElementById('loading-screen')) document.getElementById('loading-screen').classList.add('hidden');
        if (window.AOS) AOS.init({ once: true, duration: 800, offset: 50 });
        renderProducts();
        renderBestSellers();
        renderTestimonials();
        populateShippingOptions();
        updateCartDisplay();
        initSwipers();
        if (navbar) { window.addEventListener('scroll', () => { if(window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled'); }); }
    }

    init();
});