/* app.js - Dapur Mercon Sultan v11.0 (Final Polish) */

document.addEventListener('DOMContentLoaded', () => {

    const WHATSAPP_NUMBER = '6285894448143';
    const LOCALSTORAGE_KEY = 'dapurMerconCart_v9';

    // --- BAGIAN 1: FUNGSI GLOBAL & MANAJEMEN KERANJANG ---
    const formatCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars += '<i class="bi bi-star-fill"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="bi bi-star-half"></i>';
            else stars += '<i class="bi bi-star"></i>';
        }
        return stars;
    };
    const getCart = () => JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
    const saveCart = (cart) => localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cart));
    
    function updateCartCountBadge() {
        try {
            const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
            const badge = document.getElementById('cart-count-badge');
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error("Error updating cart count badge:", error);
        }
    }

    function addToCart(productId, quantity, variants, note = '') {
        try {
            const cart = getCart();
            const product = products.find(p => p.id === productId);
            if (!product) return false;

            const existingQty = cart.filter(i => i.id === productId).reduce((s, i) => s + i.quantity, 0);
            if (product.stock < (existingQty + quantity)) {
                alert(`Stok tidak mencukupi! Sisa stok untuk ${product.name} hanya ${product.stock}.`);
                return false;
            }

            cart.push({ cartId: Date.now().toString(), id: productId, quantity, variants, note });
            saveCart(cart);
            updateCartCountBadge();
            const floatingCartBtn = document.getElementById('floating-cart-btn');
            if (floatingCartBtn) {
                 floatingCartBtn.classList.remove('pulse');
                 void floatingCartBtn.offsetWidth;
                 floatingCartBtn.classList.add('pulse');
            }
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    }

    function updateCartItemNote(cartId, note) {
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.cartId === cartId);
        if (itemIndex > -1) {
            cart[itemIndex].note = note;
        }
        saveCart(cart);
    }
    
    // --- BAGIAN 2: LOGIKA GLOBAL (BERJALAN DI SEMUA HALAMAN) ---
    try {
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
            });
        }

        const miniCartEl = document.getElementById('mini-cart');
        const cartOverlayEl = document.getElementById('cart-overlay');
        const customerDataModal = new bootstrap.Modal(document.getElementById('customerDataModal'));
        let currentShippingCost = 0;
        
        function toggleMiniCart(forceOpen) {
            if (!miniCartEl || !cartOverlayEl) return;
            const shouldOpen = forceOpen === true || !miniCartEl.classList.contains('open');
            
            if (shouldOpen) {
                renderMiniCart();
                miniCartEl.classList.add('open');
                cartOverlayEl.classList.add('open');
            } else {
                miniCartEl.classList.remove('open');
                cartOverlayEl.classList.remove('open');
            }
        }

        function renderMiniCart() {
            const cart = getCart();
            const body = document.getElementById('mini-cart-body');
            const subtotalEl = document.getElementById('mini-cart-subtotal');
            if (!body || !subtotalEl) return;

            if (cart.length === 0) {
                body.innerHTML = '<p class="text-center text-muted p-5">Keranjang kosong.</p>';
                subtotalEl.textContent = formatCurrency(0);
                return;
            }

            let subtotal = 0;
            body.innerHTML = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return '';
                subtotal += product.price * item.quantity;
                return `
                    <div class="cart-item">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <div class="flex-grow-1">
                            <strong>${product.name}</strong>
                            <div class="small text-muted">${Object.values(item.variants).join(', ')}</div>
                            <div class="mt-2 d-flex justify-content-between align-items-center">
                                <div class="quantity-selector">
                                    <button class="btn btn-sm btn-outline-secondary rounded-circle" data-action="decrease" data-cartid="${item.cartId}">-</button>
                                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                    <button class="btn btn-sm btn-outline-secondary rounded-circle" data-action="increase" data-cartid="${item.cartId}">+</button>
                                </div>
                                <strong>${formatCurrency(product.price * item.quantity)}</strong>
                            </div>
                            <div class="mt-2">
                                <a href="#" class="text-primary small cart-item-note-toggle" data-action="toggle-note" data-cartid="${item.cartId}">+ Tambah Catatan</a>
                                <textarea class="form-control form-control-sm mt-1 cart-item-note-input" data-cartid="${item.cartId}" placeholder="Contoh: jangan pakai bawang goreng">${item.note || ''}</textarea>
                            </div>
                        </div>
                    </div>`;
            }).join('');
            subtotalEl.textContent = formatCurrency(subtotal);
        }
        
        document.getElementById('floating-cart-btn')?.addEventListener('click', () => toggleMiniCart(true));
        document.getElementById('cart-overlay')?.addEventListener('click', () => toggleMiniCart(false));
        document.getElementById('close-cart')?.addEventListener('click', () => toggleMiniCart(false));
        document.getElementById('mini-cart-checkout-btn')?.addEventListener('click', () => {
            if (getCart().length === 0) return alert('Keranjang kosong!');
            toggleMiniCart(false);
            customerDataModal.show();
        });
        
        const miniCartBody = document.getElementById('mini-cart-body');
        if(miniCartBody){
            miniCartBody.addEventListener('click', e => {
                const { action, cartid } = e.target.dataset;
                if (!action || !cartid) return;

                if (action === 'toggle-note') {
                    e.preventDefault();
                    const input = miniCartBody.querySelector(`.cart-item-note-input[data-cartid="${cartid}"]`);
                    if(input) {
                        const isHidden = input.style.display === 'none' || input.style.display === '';
                        input.style.display = isHidden ? 'block' : 'none';
                        if(isHidden) input.focus();
                    }
                    return;
                }

                let cart = getCart();
                const itemIndex = cart.findIndex(i => i.cartId === cartid);
                if (itemIndex === -1) return;

                if (action === 'increase') cart[itemIndex].quantity++;
                if (action === 'decrease') cart[itemIndex].quantity--;
                
                if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
                
                saveCart(cart);
                renderMiniCart();
                updateCartCountBadge();

                if (window.renderCartPage) window.renderCartPage();
            });

            miniCartBody.addEventListener('input', e => {
                 if (e.target.matches('.cart-item-note-input')) {
                    updateCartItemNote(e.target.dataset.cartid, e.target.value.trim());
                }
            });
        }

        const shippingSelect = document.getElementById('shipping-options');
        function populateShippingOptions() {
            if (!shippingSelect) return;
            shippingSelect.innerHTML = '<option value="">-- Pilih Area --</option>';
            for (const area in shippingOptions) {
                const option = document.createElement('option');
                option.value = shippingOptions[area];
                option.text = area;
                shippingSelect.appendChild(option);
            }
        }
        populateShippingOptions();

        function calculateFinalTotal() {
            const subtotal = getCart().reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0);
            currentShippingCost = parseInt(shippingSelect.value) || 0;
            let discountInfo = JSON.parse(localStorage.getItem('dapurMerconDiscount')) || { amount: 0 };
            const total = subtotal - discountInfo.amount + currentShippingCost;
            
            document.getElementById('shipping-cost-display').textContent = formatCurrency(currentShippingCost);
            document.getElementById('final-total-display').textContent = formatCurrency(total > 0 ? total : 0);
        }
        shippingSelect?.addEventListener('change', calculateFinalTotal);
        document.getElementById('customerDataModal')?.addEventListener('show.bs.modal', calculateFinalTotal);

        document.getElementById('send-whatsapp-btn')?.addEventListener('click', () => {
            const form = document.getElementById('customer-form');
            if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
            
            let message = `*Pesanan Baru Dapur Mercon Sultan* 🔥\n\n`;
            message += `*Nama:* ${document.getElementById('customer-name').value}\n`;
            message += `*No. HP:* ${document.getElementById('customer-phone').value}\n`;
            message += `*Alamat:* ${document.getElementById('customer-address-street').value}\n`;
            message += `*Area Kirim:* ${shippingSelect.options[shippingSelect.selectedIndex].text}\n\n`;
            message += `-----------------------------------\n*DETAIL PESANAN:*\n`;

            let subtotal = 0;
            getCart().forEach(item => {
                const product = products.find(p => p.id === item.id);
                subtotal += item.quantity * product.price;
                message += `\n*${item.quantity}x ${product.name}* (${formatCurrency(product.price * item.quantity)})\n`;
                if (Object.keys(item.variants).length > 0) message += `  - _Varian: ${Object.values(item.variants).join(', ')}_\n`;
                if (item.note) message += `  - _Catatan: ${item.note}_\n`;
            });

            let discountInfo = JSON.parse(localStorage.getItem('dapurMerconDiscount')) || { code: null, amount: 0 };
            const total = subtotal - discountInfo.amount + currentShippingCost;

            message += `-----------------------------------\n`;
            message += `*Subtotal:* ${formatCurrency(subtotal)}\n`;
            if (discountInfo.amount > 0) message += `*Diskon (${discountInfo.code}):* -${formatCurrency(discountInfo.amount)}\n`;
            message += `*Ongkir:* ${formatCurrency(currentShippingCost)}\n`;
            message += `*TOTAL BAYAR:* *${formatCurrency(total > 0 ? total : 0)}*\n\nTerima kasih! 🙏`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            saveCart([]);
            localStorage.removeItem('dapurMerconDiscount');
            updateCartCountBadge();
            customerDataModal.hide();
        });

        const notificationEl = document.getElementById('dummy-notification');
        if (notificationEl) {
            setInterval(() => {
                const random = dummyNotifications[Math.floor(Math.random() * dummyNotifications.length)];
                notificationEl.innerHTML = `<img src="images/logo.png" width="30" height="30" class="rounded-circle"><div><strong>${random.name}</strong> baru saja memesan ${random.item}</div>`;
                notificationEl.classList.add('show');
                setTimeout(() => {
                    notificationEl.classList.add('hide');
                    setTimeout(() => notificationEl.classList.remove('show', 'hide'), 500);
                }, 5000);
            }, Math.round(Math.random() * (15000 - 8000)) + 8000);
        }
        
        updateCartCountBadge();
        
    } catch (error) {
        console.error("Global script error:", error);
    }

    // --- BAGIAN 3: LOGIKA SPESIFIK PER HALAMAN ---
    
    // HALAMAN UTAMA (index.html)
    if (document.getElementById('home-page-marker')) {
        try {
            AOS.init({ once: true, duration: 800, offset: 50 });
            const applyFiltersAndSort = () => {
                let filtered = [...products];
                const urlParams = new URLSearchParams(window.location.search);
                const query = (urlParams.get('q') || document.querySelector('#search-form input').value || '').toLowerCase();
                const category = document.querySelector('.filter-btn.active').dataset.category;
                const sortBy = document.getElementById('sort-by').value;

                if (category !== 'all') filtered = filtered.filter(p => p.category === category);
                if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query));

                if (sortBy === 'price-asc') filtered.sort((a,b) => a.price - b.price);
                if (sortBy === 'price-desc') filtered.sort((a,b) => b.price - a.price);
                if (sortBy === 'popular') filtered.sort((a,b) => b.reviews - a.reviews);
                
                const listEl = document.getElementById('product-list');
                listEl.innerHTML = filtered.length ? filtered.map(p => `
                    <div class="col-lg-4 col-md-6" data-aos="fade-up">
                        <a href="product-detail.html?id=${p.id}" class="product-card">
                            <div class="product-image-wrapper">
                                ${p.isBestSeller ? `<div class="product-label">Best Seller</div>` : p.stock < 5 ? `<div class="product-label" style="background-color: var(--secondary-color, #FFC107); color: var(--dark-color);">Sisa ${p.stock}!</div>` : ''}
                                <img class="product-image" src="${p.images[0]}" alt="${p.name}">
                            </div>
                            <div class="product-info">
                                <div class="star-rating">${renderStars(p.rating)} <span class="small text-muted">(${p.reviews})</span></div>
                                <h5 class="mt-2 text-truncate">${p.name}</h5>
                                <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                                    <span class="fs-5 fw-bold">${formatCurrency(p.price)}</span>
                                    <span class="btn btn-primary btn-sm">Lihat Detail</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `).join('') : `<p class="text-center text-muted col-12">Menu tidak ditemukan.</p>`;
                AOS.refresh();
            };

            document.querySelectorAll('.filter-btn').forEach(b => b.onclick = (e) => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                e.currentTarget.classList.add('active');
                applyFiltersAndSort();
            });
            document.getElementById('sort-by').onchange = applyFiltersAndSort;
            const searchForm = document.getElementById('search-form');
            if(searchForm){
                const searchInput = searchForm.querySelector('input');
                searchForm.onsubmit = (e) => { e.preventDefault(); applyFiltersAndSort(); };
                if (searchInput) {
                    const urlQuery = new URLSearchParams(window.location.search).get('q');
                    if(urlQuery) searchInput.value = urlQuery;
                    searchInput.oninput = applyFiltersAndSort;
                }
            }
            
            applyFiltersAndSort();
            
            const bestSellerList = document.getElementById('best-seller-list');
            if (bestSellerList) {
                bestSellerList.innerHTML = products.filter(p => p.isBestSeller).map(p => {
                    return `<div class="swiper-slide h-100">
                        <a href="product-detail.html?id=${p.id}" class="product-card">
                            <div class="product-image-wrapper"><div class="product-label">Best Seller</div><img class="product-image" src="${p.images[0]}" alt="${p.name}"></div>
                            <div class="product-info"><div class="star-rating">${renderStars(p.rating)}</div><h5 class="mt-2 text-truncate">${p.name}</h5><div class="d-flex justify-content-between align-items-center mt-auto pt-3"><span class="fs-5 fw-bold">${formatCurrency(p.price)}</span><span class="btn btn-primary btn-sm">Lihat Detail</span></div></div>
                        </a></div>`;
                }).join('');
            }
            
            const testimonials = [ { name: 'Andi P.', text: 'Cumi Mercon-nya juara, pedasnya berkelas!', img: 'images/author1.png', rating: 5 }, { name: 'Susi W.', text: 'Pengiriman selalu tepat waktu. Recommended!', img: 'images/author2.png', rating: 5 }, { name: 'Budi S.', text: 'Dendengnya empuk banget, bumbunya meresap.', img: 'images/author3.png', rating: 4.5 } ];
            const testimonialWrapper = document.getElementById('testimonial-swiper-wrapper');
            if (testimonialWrapper) {
                 testimonialWrapper.innerHTML = testimonials.map(t => `<div class="swiper-slide h-100"><div class="card h-100 p-3"><div class="card-body text-center"><img src="${t.img}" class="rounded-circle mb-2" width="60" height="60" alt="${t.name}" style="object-fit: cover;"><h6 class="card-title">${t.name}</h6><div class="star-rating">${renderStars(t.rating)}</div><p class="card-text text-muted mt-2 fst-italic">"${t.text}"</p></div></div></div>`).join('');
            }
            
            // [FIX RESPONSIVE] Mengubah slidesPerView untuk HP
            new Swiper('.best-sellers-swiper', { slidesPerView: 1.2, spaceBetween: 15, grabCursor: true, breakpoints: { 768: { slidesPerView: 3, spaceBetween: 30 } } });
            new Swiper('.testimonials-swiper', { slidesPerView: 1.2, spaceBetween: 15, grabCursor: true, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 992: { slidesPerView: 3, spaceBetween: 30 } } });
        } catch (error) { console.error("Error on Home Page:", error); }
    }

    // HALAMAN DETAIL PRODUK (product-detail.html)
    if (document.getElementById('product-detail-page-marker')) {
        try {
            AOS.init({ once: true, duration: 800, offset: 50 });
            const product = products.find(p => p.id === parseInt(new URLSearchParams(window.location.search).get('id')));
            
            if (product) {
                document.title = `${product.name} - Dapur Mercon Sultan`;
                document.getElementById('main-product-image').src = product.images[0];
                document.getElementById('product-title').textContent = product.name;
                document.getElementById('product-rating').innerHTML = renderStars(product.rating);
                document.getElementById('product-reviews-count').textContent = product.reviews;
                document.getElementById('product-price').textContent = formatCurrency(product.price);
                document.getElementById('product-description').textContent = product.description;

                const thumbnailsContainer = document.getElementById('product-thumbnails');
                thumbnailsContainer.innerHTML = product.images.map((img, i) => `<img src="${img}" class="thumbnail-img ${i === 0 ? 'active' : ''}">`).join('');
                thumbnailsContainer.onclick = (e) => { if(e.target.classList.contains('thumbnail-img')) { document.querySelector('.thumbnail-img.active').classList.remove('active'); e.target.classList.add('active'); document.getElementById('main-product-image').src = e.target.src; } };
                
                const variantsContainer = document.getElementById('product-variants-container');
                if (product.variants && product.variants.length > 0) {
                     variantsContainer.innerHTML = product.variants.map(v => `<div class="variant-group mb-3"><h6 class="fw-bold">${v.title}</h6><div class="btn-group flex-wrap" role="group">${v.options.map((opt, idx) => `<input type="radio" class="btn-check" name="variant_${v.title.replace(/\s+/g, '_')}" id="opt_${idx}" value="${opt}" autocomplete="off" ${idx === 0 ? 'checked' : ''}><label class="btn btn-outline-dark" for="opt_${idx}">${opt}</label>`).join('')}</div></div>`).join('');
                }

                const reviewsContainer = document.getElementById('nav-reviews');
                reviewsContainer.innerHTML = product.specificReviews && product.specificReviews.length ? product.specificReviews.map(r => `<div class="py-3 border-bottom"><div class="d-flex justify-content-between align-items-center"><h6 class="fw-bold mb-0">${r.author}</h6><div class="star-rating">${renderStars(r.rating)}</div></div><p class="text-muted mb-0 mt-1 fst-italic">"${r.text}"</p></div>`).join('') : `<p class="text-muted">Belum ada ulasan untuk produk ini.</p>`;

                if (product.stock < 5) document.getElementById('stock-info').textContent = `Segera pesan, sisa ${product.stock} porsi!`;

                const qtyInput = document.getElementById('quantity-input');
                document.getElementById('increase-qty').onclick = () => { if(parseInt(qtyInput.value) < product.stock) qtyInput.value++; };
                document.getElementById('decrease-qty').onclick = () => { if(parseInt(qtyInput.value) > 1) qtyInput.value--; };
                
                document.getElementById('add-to-cart-btn').onclick = (e) => {
                    const variants = {};
                    document.querySelectorAll('.variant-group input:checked').forEach(i => variants[i.closest('.variant-group').querySelector('h6').textContent] = i.value);
                    if (addToCart(product.id, parseInt(qtyInput.value), variants)) {
                        const btnSpan = e.currentTarget.querySelector('span');
                        btnSpan.textContent = 'Berhasil Ditambahkan!';
                        e.currentTarget.classList.add('btn-success');
                        e.currentTarget.classList.remove('btn-primary');
                        setTimeout(() => {
                           btnSpan.textContent = 'Tambah ke Keranjang';
                           e.currentTarget.classList.remove('btn-success');
                           e.currentTarget.classList.add('btn-primary');
                        }, 2000);
                    }
                };
                 document.getElementById('product-detail-container').style.opacity = 1;
            } else {
                 document.querySelector('main').innerHTML = `<div class="container text-center vh-100 d-flex flex-column justify-content-center"><h1>404: Produk Tidak Ditemukan</h1><p class="lead">Maaf, menu yang Anda cari tidak ada atau link salah.</p><a href="index.html" class="btn btn-primary mt-3">Kembali ke Home</a></div>`;
            }
        } catch (error) { console.error("Error on Detail Page:", error); }
    }

    // HALAMAN KERANJANG (keranjang.html)
    if (document.getElementById('cart-page-marker')) {
        try {
            let currentPromo = { code: null, type: null, value: 0 };
            window.renderCartPage = () => {
                const cart = getCart();
                const container = document.getElementById('cart-items-container');
                const summary = document.getElementById('summary-card-container');
                if (!container) return;
                if (cart.length === 0) {
                    const cartPageContainer = document.getElementById('cart-page-container');
                    if (cartPageContainer) cartPageContainer.innerHTML = `<div class="col-12 text-center bg-white p-5 rounded-4 shadow-sm"><i class="bi bi-cart-x fs-1 text-muted"></i><h4 class="mt-3">Keranjang Anda kosong</h4><p class="text-muted">Ayo, isi dengan hidangan lezat!</p><a href="index.html#menu" class="btn btn-primary mt-3">Mulai Belanja</a></div>`;
                    if (summary) summary.style.display = 'none';
                    return;
                }
                if (summary) summary.style.display = 'block';
                container.innerHTML = cart.map(item => {
                    const product = products.find(p => p.id === item.id);
                    return `
                    <div class="cart-item-row">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <div class="flex-grow-1">
                            <h5>${product.name}</h5>
                            <p class="small text-muted mb-2">${Object.values(item.variants).join(', ')}</p>
                            <div class="quantity-selector" style="justify-content: flex-start;">
                                <button class="btn btn-outline-secondary btn-sm rounded-circle" data-action="decrease" data-cartid="${item.cartId}">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="btn btn-outline-secondary btn-sm rounded-circle" data-action="increase" data-cartid="${item.cartId}">+</button>
                            </div>
                            <div class="mt-2">
                                <a href="#" class="text-primary small cart-item-note-toggle" data-action="toggle-note" data-cartid="${item.cartId}">+ Tambah Catatan</a>
                                <textarea class="form-control form-control-sm mt-1 cart-item-note-input" data-cartid="${item.cartId}" placeholder="Contoh: jangan pakai bawang goreng">${item.note || ''}</textarea>
                            </div>
                        </div>
                        <div class="text-end">
                            <p class="fs-5 fw-bold">${formatCurrency(product.price * item.quantity)}</p>
                            <button class="btn btn-link text-danger" data-action="remove" data-cartid="${item.cartId}">Hapus</button>
                        </div>
                    </div>`;
                }).join('');
                renderCartTotals();
            };

            const renderCartTotals = () => {
                const subtotal = getCart().reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.quantity, 0);
                let discountAmount = 0;
                if (currentPromo.code) {
                    discountAmount = currentPromo.type === 'percent' ? (subtotal * currentPromo.value) / 100 : currentPromo.value;
                }
                document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
                document.getElementById('cart-discount').textContent = `- ${formatCurrency(discountAmount)}`;
                document.getElementById('cart-total').textContent = formatCurrency(Math.max(0, subtotal - discountAmount));
                localStorage.setItem('dapurMerconDiscount', JSON.stringify({ code: currentPromo.code, amount: discountAmount }));
            };

            document.getElementById('cart-items-container').addEventListener('click', e => {
                const { action, cartid } = e.target.dataset;
                if (!action || !cartid) return;
                let cart = getCart();
                const itemIndex = cart.findIndex(i => i.cartId === cartid);
                if (itemIndex === -1) return;
                if (action === 'increase') cart[itemIndex].quantity++;
                if (action === 'decrease') cart[itemIndex].quantity--;
                if (action === 'remove' && confirm('Hapus item ini?')) cart.splice(itemIndex, 1);
                if (action === 'toggle-note') {
                    e.preventDefault();
                    const input = document.querySelector(`.cart-item-note-input[data-cartid="${cartid}"]`);
                    input.style.display = input.style.display === 'block' ? 'none' : 'block';
                    if (input.style.display === 'block') input.focus();
                }
                if (cart[itemIndex] && cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
                saveCart(cart);
                renderCartPage();
                updateCartCountBadge();
            });
            
            document.getElementById('cart-items-container').addEventListener('input', e => {
                const { cartid } = e.target.dataset;
                if (cartid && e.target.matches('.cart-item-note-input')) {
                    let cart = getCart();
                    const itemIndex = cart.findIndex(i => i.cartId === cartid);
                    if(itemIndex > -1) cart[itemIndex].note = e.target.value.trim();
                    saveCart(cart);
                }
            });

            document.getElementById('apply-promo-btn').onclick = () => {
                const code = document.getElementById('promo-code-input').value.toUpperCase();
                const msgEl = document.getElementById('promo-message');
                if (promoCodes[code]) {
                    currentPromo = { code, ...promoCodes[code] };
                    msgEl.textContent = `Promo "${code}" berhasil!`;
                    msgEl.className = 'd-block mt-1 text-success small';
                } else {
                    currentPromo = { code: null, type: null, value: 0 };
                    msgEl.textContent = 'Kode promo tidak valid.';
                    msgEl.className = 'd-block mt-1 text-danger small';
                }
                renderCartTotals();
            };

            document.getElementById('checkout-btn').onclick = () => {
                if (getCart().length === 0) return alert('Keranjang kosong!');
                customerDataModal.show();
            };
            renderCartPage();
        } catch(error) { console.error("Error on Cart Page:", error); }
    }
    
    document.getElementById('loading-screen')?.classList.add('d-none');
});