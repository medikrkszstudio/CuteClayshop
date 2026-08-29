const STORAGE_KEYS = { 
    products: "cuteclay_products", 
    cart: "cuteclay_cart", 
    favorites: "cuteclay_favorites", 
    orders: "cuteclay_orders", 
    coupons: "cuteclay_coupons", 
 
    /* YENİ: Satıcı giriş bilgileri */ 
    sellerUsername: "cuteclay_seller_username", 
    sellerPassword: "cuteclay_seller_password" 
}; 
 
const defaultProducts = [ 
    { 
        id: 1, 
        name: "Sevimli Kurbağa Anahtarlık", 
        category: "Anahtarlık", 
        description: "El yapımı, sevimli ve minik kurbağa tasarımı.", 
        price: 180, 
        discount: 0, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 2, 
        name: "Çilekli Mini Charm", 
        category: "Charm", 
        description: "Tatlı çilek detaylı çanta ve telefon charmı.", 
        price: 140, 
        discount: 10, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 3, 
        name: "Mantar Küpe", 
        category: "Küpe", 
        description: "Sevimli mantar temalı el yapımı küpeler.", 
        price: 220, 
        discount: 0, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 4, 
        name: "Kurbağa Kolye", 
        category: "Kolye", 
        description: "Minik kurbağa figürlü özel tasarım kolye.", 
        price: 260, 
        discount: 15, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 5, 
        name: "Mini Kalp Charm", 
        category: "Charm", 
        description: "Tatlı kalp detaylı el yapımı charm.", 
        price: 120, 
        discount: 0, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 6, 
        name: "Çiçekli Anahtarlık", 
        category: "Anahtarlık", 
        description: "Renkli çiçeklerle süslenmiş sevimli anahtarlık.", 
        price: 190, 
        discount: 5, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 7, 
        name: "Bulut Küpe", 
        category: "Küpe", 
        description: "Yumuşacık görünüşlü sevimli bulut küpeler.", 
        price: 200, 
        discount: 0, 
        image: "", 
        images: [] 
    }, 
    { 
        id: 8, 
        name: "Tatlı Sürpriz Kutu", 
        category: "Diğer", 
        description: "İçeriği sürpriz olan sevimli CuteClayShop kutusu.", 
        price: 300, 
        discount: 10, 
        image: "", 
        images: [] 
    } 
]; 
 
let products = loadData( 
    STORAGE_KEYS.products, 
    defaultProducts 
); 
 
let cart = loadData( 
    STORAGE_KEYS.cart, 
    [] 
); 
 
let favorites = loadData( 
    STORAGE_KEYS.favorites, 
    [] 
); 
 
let orders = loadData( 
    STORAGE_KEYS.orders, 
    [] 
); 
 
let coupons = loadData( 
    STORAGE_KEYS.coupons, 
    [ 
        { 
            code: "CUTE10", 
            percent: 10 
        } 
    ] 
); 
 
let currentCategory = "all"; 
let activeCoupon = null; 
 
let editingImage = ""; 
let editingImages = []; 
 
let currentDetailProductId = null; 
let currentDetailImageIndex = 0; 
 
 
/* ========================================================= 
   HELPERS 
========================================================= */ 
 
function loadData(key, fallback) { 
    try { 
        const data = localStorage.getItem(key); 
 
        if (data) { 
            return JSON.parse(data); 
        } 
    } catch (error) { 
        console.error(error); 
    } 
 
    return JSON.parse( 
        JSON.stringify(fallback) 
    ); 
} 
 
function saveData(key, data) { 
    localStorage.setItem( 
        key, 
        JSON.stringify(data) 
    ); 
} 
 
function formatPrice(price) { 
    return `${Number(price).toLocaleString("tr-TR")} TL`; 
} 
 
function getDiscountedPrice(product) { 
    const discount = Number( 
        product.discount || 0 
    ); 
 
    return Math.round( 
        Number(product.price) * 
        (1 - discount / 100) 
    ); 
} 
 
function escapeHTML(value) { 
    return String(value || "") 
        .replace(/&/g, "&amp;") 
        .replace(/</g, "&lt;") 
        .replace(/>/g, "&gt;") 
        .replace(/"/g, "&quot;"); 
} 
 
 
/* ========================================================= 
   FOTOĞRAF YAPISI 
========================================================= */ 
 
function getProductImages(product) { 
 
    let images = []; 
 
    if ( 
        Array.isArray(product.images) && 
        product.images.length > 0 
    ) { 
        images = product.images.filter(Boolean); 
    } 
 
    if ( 
        images.length === 0 && 
        product.image 
    ) { 
        images = [product.image]; 
    } 
 
    return images.slice(0, 5); 
} 
 
 
function getEmojiForCategory(category) { 
 
    const emojis = { 
        Anahtarlık: "🔑", 
        Charm: "🧸", 
        Küpe: "✨", 
        Kolye: "💚", 
        Diğer: "🎀" 
    }; 
 
    return emojis[category] || "🐸"; 
} 
 
 
function getProductImageHTML( 
    product, 
    className = "" 
) { 
 
    const images = getProductImages(product); 
 
    if (images.length > 0) { 
 
        return ` 
            <img 
                src="${images[0]}" 
                alt="${escapeHTML(product.name)}" 
                class="${className}" 
            > 
        `; 
    } 
 
    return ` 
        <div class="product-image-placeholder ${className}"> 
            ${getEmojiForCategory(product.category)} 
        </div> 
    `; 
} 
 
 
function showToast( 
    message, 
    icon = "🐸" 
) { 
 
    const toast = 
        document.getElementById("toast"); 
 
    const toastText = 
        document.getElementById("toastText"); 
 
    const toastIcon = 
        document.getElementById("toastIcon"); 
 
    if ( 
        !toast || 
        !toastText || 
        !toastIcon 
    ) { 
        return; 
    } 
 
    toastText.textContent = message; 
    toastIcon.textContent = icon; 
 
    toast.classList.add("show"); 
 
    clearTimeout(showToast.timeout); 
 
    showToast.timeout = setTimeout(() => { 
        toast.classList.remove("show"); 
    }, 3000); 
} 
 
 
/* ========================================================= 
   MODALS 
========================================================= */ 
 
function openModal(id) { 
 
    const modal = 
        document.getElementById(id); 
 
    if (!modal) { 
        return; 
    } 
 
    modal.classList.add("active"); 
 
    document.body.classList.add( 
        "modal-open" 
    ); 
} 
 
 
function closeModal(id) { 
 
    const modal = 
        document.getElementById(id); 
 
    if (!modal) { 
        return; 
    } 
 
    modal.classList.remove("active"); 
 
    const activeModals = 
        document.querySelectorAll( 
            ".modal.active" 
        ); 
 
    if ( 
        activeModals.length === 0 
    ) { 
        document.body.classList.remove( 
            "modal-open" 
        ); 
    } 
} 
 
 
document 
    .querySelectorAll(".modal-close") 
    .forEach(button => { 
 
        button.addEventListener( 
            "click", 
            () => { 
 
                closeModal( 
                    button.dataset.close 
                ); 
 
            } 
        ); 
 
    }); 
 
 
document 
    .querySelectorAll(".modal") 
    .forEach(modal => { 
 
        modal.addEventListener( 
            "click", 
            event => { 
 
                if ( 
                    event.target === modal 
                ) { 
                    closeModal(modal.id); 
                } 
 
            } 
        ); 
 
    }); 
 
 
/* ========================================================= 
   PRODUCTS 
========================================================= */ 
 
function renderProducts() { 
 
    const grid = 
        document.getElementById( 
            "productGrid" 
        ); 
 
    const empty = 
        document.getElementById( 
            "emptyProducts" 
        ); 
 
    if (!grid) { 
        return; 
    } 
 
    let filteredProducts = 
        [...products]; 
 
    if ( 
        currentCategory !== "all" 
    ) { 
 
        filteredProducts = 
            filteredProducts.filter( 
                product => 
                    product.category === 
                    currentCategory 
            ); 
    } 
 
    const sortValue = 
        document.getElementById( 
            "sortSelect" 
        )?.value; 
 
    if (sortValue === "low") { 
 
        filteredProducts.sort( 
            (a, b) => 
                getDiscountedPrice(a) - 
                getDiscountedPrice(b) 
        ); 
    } 
 
    if (sortValue === "high") { 
 
        filteredProducts.sort( 
            (a, b) => 
                getDiscountedPrice(b) - 
                getDiscountedPrice(a) 
        ); 
    } 
 
    if (sortValue === "new") { 
 
        filteredProducts.sort( 
            (a, b) => 
                b.id - a.id 
        ); 
    } 
 
    grid.innerHTML = ""; 
 
    if ( 
        filteredProducts.length === 0 
    ) { 
 
        empty?.classList.remove( 
            "hidden" 
        ); 
 
        return; 
    } 
 
    empty?.classList.add( 
        "hidden" 
    ); 
 
    filteredProducts.forEach( 
        product => { 
 
            const isFavorite = 
                favorites.includes( 
                    product.id 
                ); 
 
            const finalPrice = 
                getDiscountedPrice( 
                    product 
                ); 
 
            const oldPriceHTML = 
                Number( 
                    product.discount || 0 
                ) > 0 
                    ? ` 
                        <span class="old-price"> 
                            ${formatPrice( 
                                product.price 
                            )} 
                        </span> 
                    ` 
                    : ""; 
 
            const discountHTML = 
                Number( 
                    product.discount || 0 
                ) > 0 
                    ? ` 
                        <span class="product-discount"> 
                            -%${product.discount} 
                        </span> 
                    ` 
                    : ""; 
 
            grid.insertAdjacentHTML( 
                "beforeend", 
                ` 
                    <article 
                        class="product-card" 
                    > 
 
                        <div 
                            class="product-image" 
                            data-product-detail="${product.id}" 
                            style="cursor:pointer" 
                        > 
 
                            ${getProductImageHTML( 
                                product 
                            )} 
 
                            ${discountHTML} 
 
                            <button 
                                class="favorite-product-button ${ 
                                    isFavorite 
                                        ? "active" 
                                        : "" 
                                }" 
                                data-favorite="${product.id}" 
                                type="button" 
                                aria-label="Favorilere ekle" 
                            > 
                                <i class="${ 
                                    isFavorite 
                                        ? "fa-solid" 
                                        : "fa-regular" 
                                } fa-heart"></i> 
                            </button> 
 
                        </div> 
 
 
                        <div 
                            class="product-info" 
                        > 
 
                            <span 
                                class="product-category-label" 
                            > 
                                ${escapeHTML( 
                                    product.category 
                                )} 
                            </span> 
 
                            <h3> 
                                ${escapeHTML( 
                                    product.name 
                                )} 
                            </h3> 
 
                            <p> 
                                ${escapeHTML( 
                                    product.description 
                                )} 
                            </p> 
 
 
                            <div 
                                class="product-bottom" 
                            > 
 
                                <div 
                                    class="price-area" 
                                > 
 
                                    ${oldPriceHTML} 
 
                                    <strong 
                                        class="product-price" 
                                    > 
                                        ${formatPrice( 
                                            finalPrice 
                                        )} 
                                    </strong> 
 
                                </div> 
 
 
                                <button 
                                    class="add-cart-button" 
                                    data-add-cart="${product.id}" 
                                    type="button" 
                                    aria-label="Sepete ekle" 
                                > 
                                    <i 
                                        class="fa-solid fa-plus" 
                                    ></i> 
                                </button> 
 
                            </div> 
 
                        </div> 
 
                    </article> 
                ` 
            ); 
 
        } 
    ); 
 
 
    document 
        .querySelectorAll( 
            "[data-add-cart]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                event => { 
 
                    event.stopPropagation(); 
 
                    addToCart( 
                        Number( 
                            button.dataset.addCart 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
 
 
    document 
        .querySelectorAll( 
            "[data-favorite]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                event => { 
 
                    event.stopPropagation(); 
 
                    toggleFavorite( 
                        Number( 
                            button.dataset.favorite 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
 
 
    document 
        .querySelectorAll( 
            "[data-product-detail]" 
        ) 
        .forEach(element => { 
 
            element.addEventListener( 
                "click", 
                () => { 
 
                    openProductDetail( 
                        Number( 
                            element.dataset 
                                .productDetail 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
} 
 
 
/* ========================================================= 
   CATEGORIES 
========================================================= */ 
 
document 
    .querySelectorAll(".category-card") 
    .forEach(button => { 
 
        button.addEventListener( 
            "click", 
            () => { 
 
                currentCategory = 
                    button.dataset.category; 
 
                document 
                    .querySelectorAll( 
                        ".category-card" 
                    ) 
                    .forEach(card => { 
 
                        card.classList.remove( 
                            "active-category" 
                        ); 
 
                    }); 
 
                button.classList.add( 
                    "active-category" 
                ); 
 
                renderProducts(); 
 
                document 
                    .getElementById( 
                        "urunler" 
                    ) 
                    ?.scrollIntoView({ 
                        behavior: "smooth", 
                        block: "start" 
                    }); 
 
            } 
        ); 
 
    }); 
 
 
document 
    .getElementById("sortSelect") 
    ?.addEventListener( 
        "change", 
        renderProducts 
    ); 
 
 
/* ========================================================= 
   FAVORITES 
========================================================= */ 
 
function toggleFavorite(productId) { 
 
    if ( 
        favorites.includes(productId) 
    ) { 
 
        favorites = 
            favorites.filter( 
                id => id !== productId 
            ); 
 
        showToast( 
            "Favorilerden kaldırıldı.", 
            "💚" 
        ); 
 
    } else { 
 
        favorites.push( 
            productId 
        ); 
 
        showToast( 
            "Favorilere eklendi!", 
            "💚" 
        ); 
    } 
 
    saveData( 
        STORAGE_KEYS.favorites, 
        favorites 
    ); 
 
    updateFavoriteCount(); 
    renderProducts(); 
    renderFavorites(); 
} 
 
 
function updateFavoriteCount() { 
 
    const count = 
        document.getElementById( 
            "favoriteCount" 
        ); 
 
    if (count) { 
        count.textContent = 
            favorites.length; 
    } 
} 
 
 
function renderFavorites() { 
 
    const list = 
        document.getElementById( 
            "favoriteList" 
        ); 
 
    if (!list) { 
        return; 
    } 
 
    const favoriteProducts = 
        products.filter( 
            product => 
                favorites.includes( 
                    product.id 
                ) 
        ); 
 
    if ( 
        favoriteProducts.length === 0 
    ) { 
 
        list.innerHTML = ` 
            <div class="empty-state"> 
                <div>💚</div> 
                <h3>Henüz favorin yok!</h3> 
                <p> 
                    Beğendiğin ürünlerin 
                    kalbine basabilirsin. 
                </p> 
            </div> 
        `; 
 
        return; 
    } 
 
    list.innerHTML = ""; 
 
    favoriteProducts.forEach( 
        product => { 
 
            const images = 
                getProductImages( 
                    product 
                ); 
 
            list.insertAdjacentHTML( 
                "beforeend", 
                ` 
                    <div 
                        class="favorite-item" 
                    > 
 
                        ${ 
                            images.length > 0 
                                ? ` 
                                    <img 
                                        src="${images[0]}" 
                                        alt="${escapeHTML( 
                                            product.name 
                                        )}" 
                                    > 
                                ` 
                                : ` 
                                    <div 
                                        class="favorite-placeholder" 
                                    > 
                                        ${getEmojiForCategory( 
                                            product.category 
                                        )} 
                                    </div> 
                                ` 
                        } 
 
                        <div> 
                            <h4> 
                                ${escapeHTML( 
                                    product.name 
                                )} 
                            </h4> 
 
                            <p> 
                                ${formatPrice( 
                                    getDiscountedPrice( 
                                        product 
                                    ) 
                                )} 
                            </p> 
                        </div> 
 
                        <button 
                            data-remove-favorite="${product.id}" 
                            type="button" 
                        > 
                            <i 
                                class="fa-solid fa-heart" 
                            ></i> 
                        </button> 
 
                    </div> 
                ` 
            ); 
        } 
    ); 
 
 
    document 
        .querySelectorAll( 
            "[data-remove-favorite]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                () => { 
 
                    toggleFavorite( 
                        Number( 
                            button.dataset 
                                .removeFavorite 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
} 
 
 
document 
    .getElementById("favoritesBtn") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            renderFavorites(); 
 
            openModal( 
                "favoritesModal" 
            ); 
 
        } 
    ); 
 
 
/* ========================================================= 
   CART 
========================================================= */ 
 
function addToCart(productId) { 
 
    const product = 
        products.find( 
            item => 
                item.id === productId 
        ); 
 
    if (!product) { 
        return; 
    } 
 
    const existing = 
        cart.find( 
            item => 
                item.productId === 
                productId 
        ); 
 
    if (existing) { 
 
        existing.quantity += 1; 
 
    } else { 
 
        cart.push({ 
            productId, 
            quantity: 1 
        }); 
 
    } 
 
    saveData( 
        STORAGE_KEYS.cart, 
        cart 
    ); 
 
    updateCart(); 
 
    showToast( 
        `${product.name} sepete eklendi!`, 
        "🛒" 
    ); 
} 
 
 
function updateCart() { 
 
    const cartItems = 
        document.getElementById( 
            "cartItems" 
        ); 
 
    const cartEmpty = 
        document.getElementById( 
            "cartEmpty" 
        ); 
 
    if (!cartItems) { 
        return; 
    } 
 
    const validCart = 
        cart.filter( 
            item => 
                products.some( 
                    product => 
                        product.id === 
                        item.productId 
                ) 
        ); 
 
    if ( 
        validCart.length !== 
        cart.length 
    ) { 
 
        cart = validCart; 
 
        saveData( 
            STORAGE_KEYS.cart, 
            cart 
        ); 
    } 
 
    const totalCount = 
        cart.reduce( 
            (total, item) => 
                total + 
                Number(item.quantity), 
            0 
        ); 
 
    const cartCount = 
        document.getElementById( 
            "cartCount" 
        ); 
 
    if (cartCount) { 
        cartCount.textContent = 
            totalCount; 
    } 
 
    cartItems.innerHTML = ""; 
 
    if (cart.length === 0) { 
 
        cartEmpty?.classList.remove( 
            "hidden" 
        ); 
 
    } else { 
 
        cartEmpty?.classList.add( 
            "hidden" 
        ); 
    } 
 
    cart.forEach(item => { 
 
        const product = 
            products.find( 
                product => 
                    product.id === 
                    item.productId 
            ); 
 
        if (!product) { 
            return; 
        } 
 
        const images = 
            getProductImages( 
                product 
            ); 
 
        cartItems.insertAdjacentHTML( 
            "beforeend", 
            ` 
                <div 
                    class="cart-item" 
                > 
 
                    ${ 
                        images.length > 0 
                            ? ` 
                                <img 
                                    src="${images[0]}" 
                                    alt="${escapeHTML( 
                                        product.name 
                                    )}" 
                                > 
                            ` 
                            : ` 
                                <div 
                                    class="cart-item-placeholder" 
                                > 
                                    ${getEmojiForCategory( 
                                        product.category 
                                    )} 
                                </div> 
                            ` 
                    } 
 
                    <div> 
 
                        <h4> 
                            ${escapeHTML( 
                                product.name 
                            )} 
                        </h4> 
 
                        <div 
                            class="cart-item-price" 
                        > 
                            ${formatPrice( 
                                getDiscountedPrice( 
                                    product 
                                ) 
                            )} 
                        </div> 
 
                        <div 
                            class="cart-quantity" 
                        > 
 
                            <button 
                                data-cart-minus="${product.id}" 
                                type="button" 
                            > 
                                − 
                            </button> 
 
                            <strong> 
                                ${item.quantity} 
                            </strong> 
 
                            <button 
                                data-cart-plus="${product.id}" 
                                type="button" 
                            > 
                                + 
                            </button> 
 
                        </div> 
 
                    </div> 
 
                    <button 
                        class="cart-remove" 
                        data-cart-remove="${product.id}" 
                        type="button" 
                    > 
                        <i 
                            class="fa-solid fa-trash" 
                        ></i> 
                    </button> 
 
                </div> 
            ` 
        ); 
 
    }); 
 
 
    document 
        .querySelectorAll( 
            "[data-cart-minus]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                () => { 
 
                    changeCartQuantity( 
                        Number( 
                            button.dataset 
                                .cartMinus 
                        ), 
                        -1 
                    ); 
 
                } 
            ); 
 
        }); 
 
 
    document 
        .querySelectorAll( 
            "[data-cart-plus]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                () => { 
 
                    changeCartQuantity( 
                        Number( 
                            button.dataset 
                                .cartPlus 
                        ), 
                        1 
                    ); 
 
                } 
            ); 
 
        }); 
 
 
    document 
        .querySelectorAll( 
            "[data-cart-remove]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                () => { 
 
                    removeFromCart( 
                        Number( 
                            button.dataset 
                                .cartRemove 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
 
    updateCartTotals(); 
} 
 
 
function changeCartQuantity( 
    productId, 
    amount 
) { 
 
    const item = 
        cart.find( 
            item => 
                item.productId === 
                productId 
        ); 
 
    if (!item) { 
        return; 
    } 
 
    item.quantity += amount; 
 
    if ( 
        item.quantity <= 0 
    ) { 
 
        cart = 
            cart.filter( 
                item => 
                    item.productId !== 
                    productId 
            ); 
    } 
 
    saveData( 
        STORAGE_KEYS.cart, 
        cart 
    ); 
 
    updateCart(); 
} 
 
 
function removeFromCart(productId) { 
 
    cart = 
        cart.filter( 
            item => 
                item.productId !== 
                productId 
        ); 
 
    saveData( 
        STORAGE_KEYS.cart, 
        cart 
    ); 
 
    updateCart(); 
 
    showToast( 
        "Ürün sepetten kaldırıldı.", 
        "🛒" 
    ); 
} 
 
 
function getCartSubtotal() { 
 
    return cart.reduce( 
        (total, item) => { 
 
            const product = 
                products.find( 
                    product => 
                        product.id === 
                        item.productId 
                ); 
 
            if (!product) { 
                return total; 
            } 
 
            return total + 
                getDiscountedPrice( 
                    product 
                ) * 
                item.quantity; 
 
        }, 
        0 
    ); 
} 
 
 
function updateCartTotals() { 
 
    const subtotal = 
        getCartSubtotal(); 
 
    let discount = 0; 
 
    if (activeCoupon) { 
 
        discount = 
            Math.round( 
                subtotal * 
                activeCoupon.percent / 
                100 
            ); 
    } 
 
    const total = 
        Math.max( 
            0, 
            subtotal - discount 
        ); 
 
    const subtotalElement = 
        document.getElementById( 
            "cartSubtotal" 
        ); 
 
    const discountElement = 
        document.getElementById( 
            "cartDiscount" 
        ); 
 
    const totalElement = 
        document.getElementById( 
            "cartTotal" 
        ); 
 
    if (subtotalElement) { 
        subtotalElement.textContent = 
            formatPrice(subtotal); 
    } 
 
    if (discountElement) { 
        discountElement.textContent = 
            `-${formatPrice(discount)}`; 
    } 
 
    if (totalElement) { 
        totalElement.textContent = 
            formatPrice(total); 
    } 
} 
 
 
function openCart() { 
 
    document 
        .getElementById( 
            "cartOverlay" 
        ) 
        ?.classList.add("active"); 
 
    document 
        .getElementById( 
            "cartSidebar" 
        ) 
        ?.classList.add("active"); 
} 
 
 
function closeCart() { 
 
    document 
        .getElementById( 
            "cartOverlay" 
        ) 
        ?.classList.remove("active"); 
 
    document 
        .getElementById( 
            "cartSidebar" 
        ) 
        ?.classList.remove("active"); 
} 
 
 
document 
    .getElementById("cartBtn") 
    ?.addEventListener( 
        "click", 
        openCart 
    ); 
 
 
document 
    .getElementById("closeCart") 
    ?.addEventListener( 
        "click", 
        closeCart 
    ); 
 
 
document 
    .getElementById("cartOverlay") 
    ?.addEventListener( 
        "click", 
        closeCart 
    ); 
 
 
/* ========================================================= 
   COUPON 
========================================================= */ 
 
document 
    .getElementById("applyCoupon") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            const input = 
                document.getElementById( 
                    "couponInput" 
                ); 
 
            if (!input) { 
                return; 
            } 
 
            const code = 
                input.value 
                    .trim() 
                    .toUpperCase(); 
 
            if (!code) { 
 
                showToast( 
                    "Önce bir kupon kodu yaz.", 
                    "🎟️" 
                ); 
 
                return; 
            } 
 
            const coupon = 
                coupons.find( 
                    item => 
                        item.code.toUpperCase() === 
                        code 
                ); 
 
            if (!coupon) { 
 
                activeCoupon = null; 
 
                updateCartTotals(); 
 
                showToast( 
                    "Geçerli bir kupon bulunamadı.", 
                    "❌" 
                ); 
 
                return; 
            } 
 
            activeCoupon = coupon; 
 
            updateCartTotals(); 
 
            showToast( 
                `%${coupon.percent} indirim uygulandı!`, 
                "🎟️" 
            ); 
 
        } 
    ); 
 
 
/* ========================================================= 
   ÜRÜN DETAY 
========================================================= */ 
 
function openProductDetail( 
    productId 
) { 
 
    const product = 
        products.find( 
            item => 
                item.id === productId 
        ); 
 
    if (!product) { 
        return; 
    } 
 
    currentDetailProductId = 
        productId; 
 
    currentDetailImageIndex = 0; 
 
    renderProductDetail(); 
 
    openModal( 
        "productModal" 
    ); 
} 
 
 
function renderProductDetail() { 
 
    const product = 
        products.find( 
            item => 
                item.id === 
                currentDetailProductId 
        ); 
 
    const content = 
        document.getElementById( 
            "quickProductContent" 
        ); 
 
    if ( 
        !product || 
        !content 
    ) { 
        return; 
    } 
 
    const images = 
        getProductImages( 
            product 
        ); 
 
    const imageCount = 
        images.length; 
 
    const currentImage = 
        images[ 
            currentDetailImageIndex 
        ]; 
 
    const oldPrice = 
        Number( 
            product.discount || 0 
        ) > 0 
            ? ` 
                <span class="old-price"> 
                    ${formatPrice( 
                        product.price 
                    )} 
                </span> 
            ` 
            : ""; 
 
    let imageArea = ""; 
 
    if (currentImage) { 
 
        imageArea = ` 
            <div 
                class="quick-product-image" 
                style=" 
                    position:relative; 
                    overflow:hidden; 
                " 
            > 
 
                <img 
                    id="quickDetailImage" 
                    src="${currentImage}" 
                    alt="${escapeHTML( 
                        product.name 
                    )}" 
                    style=" 
                        width:100%; 
                        height:100%; 
                        display:block; 
                        object-fit:contain; 
                        object-position:center; 
                        cursor:zoom-in; 
                    " 
                > 
 
                ${ 
                    imageCount > 1 
                        ? ` 
                            <button 
                                type="button" 
                                id="quickProductPrev" 
                                class="product-slider-prev" 
                                aria-label="Önceki fotoğraf" 
                            > 
                                <i 
                                    class="fa-solid fa-chevron-left" 
                                ></i> 
                            </button> 
 
                            <button 
                                type="button" 
                                id="quickProductNext" 
                                class="product-slider-next" 
                                aria-label="Sonraki fotoğraf" 
                            > 
                                <i 
                                    class="fa-solid fa-chevron-right" 
                                ></i> 
                            </button> 
 
                            <div 
                                class="product-slider-dots" 
                                id="quickProductDots" 
                            > 
                                ${images.map( 
                                    (image, index) => ` 
                                        <button 
                                            type="button" 
                                            class="product-slider-dot ${ 
                                                index === 
                                                currentDetailImageIndex 
                                                    ? "active" 
                                                    : "" 
                                            }" 
                                            data-detail-dot="${index}" 
                                            aria-label="${ 
                                                index + 1 
                                            }. fotoğraf" 
                                        ></button> 
                                    ` 
                                ).join("")} 
                            </div> 
 
                            <div 
                                style=" 
                                    position:absolute; 
                                    right:14px; 
                                    top:14px; 
                                    background:rgba(255,255,255,.92); 
                                    padding:6px 10px; 
                                    border-radius:20px; 
                                    font-size:13px; 
                                    font-weight:700; 
                                    z-index:10; 
                                " 
                            > 
                                ${ 
                                    currentDetailImageIndex + 1 
                                } / ${imageCount} 
                            </div> 
                        ` 
                        : "" 
                } 
 
            </div> 
        `; 
 
    } else { 
 
        imageArea = ` 
            <div 
                class="quick-product-image" 
            > 
                <div 
                    class="product-image-placeholder" 
                    style=" 
                        width:100%; 
                        height:100%; 
                        display:flex; 
                        align-items:center; 
                        justify-content:center; 
                        font-size:70px; 
                    " 
                > 
                    ${getEmojiForCategory( 
                        product.category 
                    )} 
                </div> 
            </div> 
        `; 
    } 
 
 
    content.innerHTML = ` 
 
        ${imageArea} 
 
        <div 
            class="quick-product-info" 
        > 
 
            <span class="eyebrow"> 
                ${escapeHTML( 
                    product.category 
                )} 
            </span> 
 
            <h2> 
                ${escapeHTML( 
                    product.name 
                )} 
            </h2> 
 
            <p> 
                ${escapeHTML( 
                    product.description 
                )} 
            </p> 
 
            <div 
                class="quick-product-price" 
            > 
 
                ${oldPrice} 
 
                <strong> 
                    ${formatPrice( 
                        getDiscountedPrice( 
                            product 
                        ) 
                    )} 
                </strong> 
 
            </div> 
 
            <button 
                class="quick-add-button" 
                id="quickAddToCart" 
                type="button" 
            > 
                🛒 Sepete Ekle 
            </button> 
 
        </div> 
    `; 
 
 
    document 
        .getElementById( 
            "quickDetailImage" 
        ) 
        ?.addEventListener( 
            "click", 
            () => { 
 
                openLargeProductImage( 
                    currentImage, 
                    product.name 
                ); 
 
            } 
        ); 
 
 
    document 
        .getElementById( 
            "quickAddToCart" 
        ) 
        ?.addEventListener( 
            "click", 
            () => { 
 
                addToCart( 
                    product.id 
                ); 
 
                closeModal( 
                    "productModal" 
                ); 
 
            } 
        ); 
 
 
    document 
        .getElementById( 
            "quickProductNext" 
        ) 
        ?.addEventListener( 
            "click", 
            event => { 
 
                event.stopPropagation(); 
 
                if ( 
                    imageCount <= 1 
                ) { 
                    return; 
                } 
 
                currentDetailImageIndex++; 
 
                if ( 
                    currentDetailImageIndex >= 
                    imageCount 
                ) { 
                    currentDetailImageIndex = 0; 
                } 
 
                renderProductDetail(); 
 
            } 
        ); 
 
 
    document 
        .getElementById( 
            "quickProductPrev" 
        ) 
        ?.addEventListener( 
            "click", 
            event => { 
 
                event.stopPropagation(); 
 
                if ( 
                    imageCount <= 1 
                ) { 
                    return; 
                } 
 
                currentDetailImageIndex--; 
 
                if ( 
                    currentDetailImageIndex < 0 
                ) { 
                    currentDetailImageIndex = 
                        imageCount - 1; 
                } 
 
                renderProductDetail(); 
 
            } 
        ); 
 
 
    document 
        .querySelectorAll( 
            "[data-detail-dot]" 
        ) 
        .forEach(dot => { 
 
            dot.addEventListener( 
                "click", 
                event => { 
 
                    event.stopPropagation(); 
 
                    currentDetailImageIndex = 
                        Number( 
                            dot.dataset 
                                .detailDot 
                        ); 
 
                    renderProductDetail(); 
 
                } 
            ); 
 
        }); 
} 
 
 
/* ========================================================= 
   BÜYÜK FOTOĞRAF 
========================================================= */ 
 
function openLargeProductImage( 
    image, 
    productName 
) { 
 
    if (!image) { 
        return; 
    } 
 
    let modal = 
        document.getElementById( 
            "largeProductImageModal" 
        ); 
 
    if (!modal) { 
 
        modal = 
            document.createElement( 
                "div" 
            ); 
 
        modal.id = 
            "largeProductImageModal"; 
 
        modal.className = 
            "modal"; 
 
        modal.innerHTML = ` 
            <div 
                class="large-product-image-box" 
                style=" 
                    position:relative; 
                    width:min(94vw,1000px); 
                    height:min(90vh,850px); 
                    background:#f8f5ef; 
                    border-radius:28px; 
                    padding:20px; 
                    display:flex; 
                    align-items:center; 
                    justify-content:center; 
                " 
            > 
 
                <button 
                    type="button" 
                    id="largeProductImageClose" 
                    style=" 
                        position:absolute; 
                        right:15px; 
                        top:15px; 
                        z-index:20; 
                        width:42px; 
                        height:42px; 
                        border:0; 
                        border-radius:50%; 
                        background:white; 
                        cursor:pointer; 
                        font-size:18px; 
                        box-shadow:0 5px 20px rgba(0,0,0,.12); 
                    " 
                > 
                    <i 
                        class="fa-solid fa-xmark" 
                    ></i> 
                </button> 
 
                <img 
                    id="largeProductImage" 
                    src="" 
                    alt="" 
                    style=" 
                        max-width:100%; 
                        max-height:100%; 
                        width:auto; 
                        height:auto; 
                        object-fit:contain; 
                        display:block; 
                    " 
                > 
 
            </div> 
        `; 
 
        document.body.appendChild( 
            modal 
        ); 
 
        document 
            .getElementById( 
                "largeProductImageClose" 
            ) 
            ?.addEventListener( 
                "click", 
                () => { 
 
                    closeModal( 
                        "largeProductImageModal" 
                    ); 
 
                } 
            ); 
 
        modal.addEventListener( 
            "click", 
            event => { 
 
                if ( 
                    event.target === modal 
                ) { 
 
                    closeModal( 
                        "largeProductImageModal" 
                    ); 
                } 
 
            } 
        ); 
    } 
 
    const largeImage = 
        document.getElementById( 
            "largeProductImage" 
        ); 
 
    if (largeImage) { 
 
        largeImage.src = 
            image; 
 
        largeImage.alt = 
            productName; 
    } 
 
    openModal( 
        "largeProductImageModal" 
    ); 
} 
 
 
/* ========================================================= 
   SEARCH 
========================================================= */ 
 
function renderSearchResults( 
    query = "" 
) { 
 
    const results = 
        document.getElementById( 
            "searchResults" 
        ); 
 
    if (!results) { 
        return; 
    } 
 
    const cleanQuery = 
        query 
            .trim() 
            .toLocaleLowerCase("tr"); 
 
    if (!cleanQuery) { 
 
        results.innerHTML = ` 
            <div class="empty-state"> 
                <div>🔎</div> 
                <h3> 
                    Aramaya başlayabilirsin! 
                </h3> 
                <p> 
                    Ürün adı veya kategori yaz. 
                </p> 
            </div> 
        `; 
 
        return; 
    } 
 
    const foundProducts = 
        products.filter( 
            product => { 
 
                const text = [ 
                    product.name, 
                    product.category, 
                    product.description 
                ] 
                    .join(" ") 
                    .toLocaleLowerCase("tr"); 
 
                return text.includes( 
                    cleanQuery 
                ); 
            } 
        ); 
 
    if ( 
        foundProducts.length === 0 
    ) { 
 
        results.innerHTML = ` 
            <div class="empty-state"> 
                <div>🐸</div> 
                <h3> 
                    Sonuç bulunamadı! 
                </h3> 
                <p> 
                    Başka bir kelime deneyebilirsin. 
                </p> 
            </div> 
        `; 
 
        return; 
    } 
 
    results.innerHTML = ""; 
 
    foundProducts.forEach( 
        product => { 
 
            const images = 
                getProductImages( 
                    product 
                ); 
 
            results.insertAdjacentHTML( 
                "beforeend", 
                ` 
                    <button 
                        class="search-result-item" 
                        data-search-product="${product.id}" 
                        type="button" 
                    > 
 
                        ${ 
                            images.length > 0 
                                ? ` 
                                    <img 
                                        src="${images[0]}" 
                                        alt="${escapeHTML( 
                                            product.name 
                                        )}" 
                                    > 
                                ` 
                                : ` 
                                    <div 
                                        class="search-result-placeholder" 
                                    > 
                                        ${getEmojiForCategory( 
                                            product.category 
                                        )} 
                                    </div> 
                                ` 
                        } 
 
                        <div> 
 
                            <strong> 
                                ${escapeHTML( 
                                    product.name 
                                )} 
                            </strong> 
 
                            <span> 
                                ${formatPrice( 
                                    getDiscountedPrice( 
                                        product 
                                    ) 
                                )} 
                            </span> 
 
                        </div> 
 
                    </button> 
                ` 
            ); 
        } 
    ); 
 
 
    document 
        .querySelectorAll( 
            "[data-search-product]" 
        ) 
        .forEach(button => { 
 
            button.addEventListener( 
                "click", 
                () => { 
 
                    closeModal( 
                        "searchModal" 
                    ); 
 
                    openProductDetail( 
                        Number( 
                            button.dataset 
                                .searchProduct 
                        ) 
                    ); 
 
                } 
            ); 
 
        }); 
} 
 
 
document 
    .getElementById("searchBtn") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            renderSearchResults(""); 
 
            openModal( 
                "searchModal" 
            ); 
 
            setTimeout( 
                () => { 
 
                    document 
                        .getElementById( 
                            "searchInput" 
                        ) 
                        ?.focus(); 
 
                }, 
                100 
            ); 
 
        } 
    ); 
 
 
document 
    .getElementById("searchInput") 
    ?.addEventListener( 
        "input", 
        event => { 
 
            renderSearchResults( 
                event.target.value 
            ); 
 
        } 
    ); 
 
 
/* ========================================================= 
   SURPRISE 
========================================================= */ 
 
document 
    .getElementById("surpriseBtn") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            if ( 
                products.length === 0 
            ) { 
 
                showToast( 
                    "Önce ürün eklemelisin!", 
                    "🐸" 
                ); 
 
                return; 
            } 
 
            const randomIndex = 
                Math.floor( 
                    Math.random() * 
                    products.length 
                ); 
 
            openProductDetail( 
                products[randomIndex].id 
            ); 
 
        } 
    ); 
 
 
document 
    .getElementById("aboutShopBtn") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            document 
                .getElementById( 
                    "urunler" 
                ) 
                ?.scrollIntoView({ 
                    behavior: "smooth" 
                }); 
 
        } 
    ); 
 
 
/* ========================================================= 
   NEWSLETTER 
========================================================= */ 
 
document 
    .getElementById("newsletterForm") 
    ?.addEventListener( 
        "submit", 
        event => { 
 
            event.preventDefault(); 
 
            const email = 
                document 
                    .getElementById( 
                        "newsletterEmail" 
                    ) 
                    ?.value 
                    .trim(); 
 
            if (!email) { 
                return; 
            } 
 
            event.target.reset(); 
 
            showToast( 
                "CuteClayShop ailesine hoş geldin!", 
                "💌" 
            ); 
 
        } 
    ); 
 
 
/* ========================================================= 
   CHECKOUT 
========================================================= */ 
 
document 
    .getElementById("checkoutBtn") 
    ?.addEventListener( 
        "click", 
        () => { 
 
            if ( 
                cart.length === 0 
            ) { 
 
                showToast( 
                    "Sepetin şu an boş!", 
                    "🛒" 
                ); 
 
                return; 
            } 
 
            closeCart(); 
 
            openModal( 
                "checkoutModal" 
            ); 
 
        } 
    ); 
 
 
document 
    .querySelectorAll( 
        'input[name="payment"]' 
    ) 
    .forEach(radio => { 
 
        radio.addEventListener( 
            "change", 
            () => { 
 
                document 
                    .querySelectorAll( 
                        ".payment-option" 
                    ) 
                    .forEach(option => { 
 
                        option.classList.remove( 
                            "active-payment" 
                        ); 
 
                    }); 
 
                radio 
                    .closest( 
                        ".payment-option" 
                    ) 
                    ?.classList.add( 
                        "active-payment" 
                    ); 
 
                const cardInfo = 
                    document.getElementById( 
                        "cardInfo" 
                    ); 
 
                if (!cardInfo) { 
                    return; 
                } 
 
                if ( 
                    radio.value === 
                    "Kart ile Ödeme" 
                ) { 
 
                    cardInfo.classList.remove( 
                        "hidden" 
                    ); 
 
                } else { 
 
                    cardInfo.classList.add( 
                        "hidden" 
                    ); 
 
                } 
 
            } 
        ); 
 
    }); 
 
 
document 
    .getElementById("checkoutForm") 
    ?.addEventListener( 
        "submit", 
        event => { 
 
            event.preventDefault(); 
 
            if ( 
                cart.length === 0 
            ) { 
 
                showToast( 
                    "Sepetin boş!", 
                    "🛒" 
                ); 
 
                return; 
            } 
 
            const subtotal = 
                getCartSubtotal(); 
 
            const discount = 
                activeCoupon 
                    ? Math.round( 
                        subtotal * 
                        activeCoupon.percent / 
                        100 
                    ) 
                    : 0; 
 
            const total = 
                subtotal - discount; 
 
            const payment = 
                document 
                    .querySelector( 
                        'input[name="payment"]:checked' 
                    ) 
                    ?.value; 
 
            const customerName = 
                document 
                    .getElementById( 
                        "customerName" 
                    ) 
                    ?.value 
                    .trim(); 
 
            const order = { 
                id: Date.now(), 
 
                customerName, 
 
                phone: 
                    document 
                        .getElementById( 
                            "customerPhone" 
                        ) 
                        ?.value 
                        .trim(), 
 
                email: 
                    document 
                        .getElementById( 
                            "customerEmail" 
                        ) 
                        ?.value 
                        .trim(), 
 
                address: 
                    document 
                        .getElementById( 
                            "customerAddress" 
                        ) 
                        ?.value 
                        .trim(), 
 
                payment, 
 
                items: 
                    JSON.parse( 
                        JSON.stringify( 
                            cart 
                        ) 
                    ), 
 
                total, 
 
                date: 
                    new Date() 
                        .toLocaleString( 
                            "tr-TR" 
                        ) 
            }; 
 
            orders.unshift( 
                order 
            ); 
 
            saveData( 
                STORAGE_KEYS.orders, 
                orders 
            ); 
 
            cart = []; 
 
            activeCoupon = null; 
 
            saveData( 
                STORAGE_KEYS.cart, 
                cart 
            ); 
 
            const couponInput = 
                document.getElementById( 
                    "couponInput" 
                ); 
 
            if (couponInput) { 
                couponInput.value = ""; 
            } 
 
            updateCart(); 
 
            event.target.reset(); 
 
            closeModal( 
                "checkoutModal" 
            ); 
 
            showToast( 
                "Siparişin başarıyla oluşturuldu!", 
                "🎉" 
            ); 
 
            renderDashboard(); 
 
        } 
    ); 
 
 
/* ========================================================= 
   MOBILE MENU 
========================================================= */ 
 
const mobileMenu = 
    document.getElementById( 
        "mobileMenu" 
    ); 
 
const mobileMenuOverlay = 
    document.getElementById( 
        "mobileMenuOverlay" 
    ); 
 
 
function openMobileMenu() { 
 
    mobileMenu?.classList.add( 
        "active" 
    ); 
 
    mobileMenuOverlay?.classList.add( 
        "active" 
    ); 
} 
 
 
function closeMobileMenu() { 
 
    mobileMenu?.classList.remove( 
        "active" 
    ); 
 
    mobileMenuOverlay?.classList.remove( 
        "active" 
    ); 
} 
 
 
document 
    .getElementById( 
        "mobileMenuBtn" 
    ) 
    ?.addEventListener( 
        "click", 
        openMobileMenu 
    ); 
 
 
document 
    .getElementById( 
        "closeMobileMenu" 
    ) 
    ?.addEventListener( 
        "click", 
        closeMobileMenu 
    ); 
 
 
mobileMenuOverlay 
    ?.addEventListener( 
        "click", 
        closeMobileMenu 
    ); 
 
 
document 
    .querySelectorAll( 
        ".mobile-nav-link" 
    ) 
    .forEach(link => { 
 
        link.addEventListener( 
            "click", 
            closeMobileMenu 
        ); 
 
    }); 
 
 
/* ========================================================= 
   INFO MODAL 
========================================================= */ 
 
function openInfoModal( 
    title, 
    text, 
    icon 
) { 
 
    const content = 
        document.getElementById( 
            "infoModalContent" 
        ); 
 
    if (!content) { 
        return; 
    } 
 
    content.innerHTML = ` 
        <div 
            style=" 
                font-size:50px; 
                margin-bottom:10px 
            " 
        > 
            ${icon} 
        </div> 
 
        <h2> 
            ${escapeHTML(title)} 
        </h2> 
 
        <p> 
            ${escapeHTML(text)} 
        </p> 
    `; 
 
    openModal( 
        "infoModal" 
    ); 
} 
 
 
document 
    .getElementById( 
        "orderTrackingBtn" 
    ) 
    ?.addEventListener( 
        "click", 
        () => { 
 
            openInfoModal( 
                "Sipariş Takibi 📦", 
                "Sipariş oluşturulduktan sonra sipariş bilgilerin üzerinden durumunu takip edebilirsin.", 
                "📦" 
            ); 
 
        } 
    ); 
 
 
document 
    .getElementById( 
        "shippingInfoBtn" 
    ) 
    ?.addEventListener( 
        "click", 
        () => { 
 
            openInfoModal( 
                "Kargo Bilgileri 🚚", 
                "Siparişlerin özenle hazırlanır ve güvenli şekilde kargoya teslim edilir.", 
                "🚚" 
            ); 
 
        } 
    ); 
    
document
    .getElementById(
        "returnPolicyBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            openInfoModal(
                "İade Politikası 💌",
                "Ürünle ilgili bir sorun yaşarsan mağaza ile iletişime geçerek destek alabilirsin.",
                "💌"
            );

        }
    );


/* =========================================================
   SOCIAL
========================================================= */

document
    .getElementById(
        "instagramBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            showToast(
                "Instagram hesabı daha sonra buraya eklenebilir.",
                "📸"
            );

        }
    );


document
    .getElementById(
        "whatsappBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            showToast(
                "WhatsApp iletişim bağlantısı daha sonra eklenebilir.",
                "💬"
            );

        }
    );


/* =========================================================
   SELLER LOGIN
========================================================= */

/*
   YENİ SİSTEM:
   Kullanıcı adı ve şifre artık localStorage'da tutuluyor.

   İlk değerler:
   Kullanıcı adı: admin
   Şifre: 1234
*/

const DEFAULT_SELLER_USERNAME =
    "admin";

const DEFAULT_SELLER_PASSWORD =
    "1234";


function getSellerUsername() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.sellerUsername
        ) ||
        DEFAULT_SELLER_USERNAME
    );
}


function getSellerPassword() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.sellerPassword
        ) ||
        DEFAULT_SELLER_PASSWORD
    );
}


function saveSellerCredentials(
    username,
    password
) {

    localStorage.setItem(
        STORAGE_KEYS.sellerUsername,
        username
    );

    localStorage.setItem(
        STORAGE_KEYS.sellerPassword,
        password
    );
}


function openSellerLogin() {

    openModal(
        "sellerLoginModal"
    );
}


document
    .getElementById(
        "sellerOpenBtn"
    )
    ?.addEventListener(
        "click",
        openSellerLogin
    );


document
    .getElementById(
        "footerSellerBtn"
    )
    ?.addEventListener(
        "click",
        openSellerLogin
    );


document
    .getElementById(
        "sellerLoginForm"
    )
    ?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const username =
                document
                    .getElementById(
                        "sellerUsername"
                    )
                    ?.value
                    .trim();

            const password =
                document
                    .getElementById(
                        "sellerPassword"
                    )
                    ?.value;

            /*
               YENİ:
               Sabit admin/1234 yerine
               kayıtlı kullanıcı adı ve şifre
               kontrol ediliyor.
            */

            if (
                username ===
                    getSellerUsername() &&
                password ===
                    getSellerPassword()
            ) {

                closeModal(
                    "sellerLoginModal"
                );

                document
                    .getElementById(
                        "sellerDashboard"
                    )
                    ?.classList.add(
                        "active"
                    );

                renderDashboard();

                event.target.reset();

                showToast(
                    "Yönetim paneline hoş geldin!",
                    "🐸"
                );

            } else {

                showToast(
                    "Kullanıcı adı veya şifre yanlış!",
                    "❌"
                );

            }

        }
    );


/* =========================================================
   YENİ — SATICI AYARLARI
========================================================= */

function createSellerSettings() {

    const dashboard =
        document.getElementById(
            "sellerDashboard"
        );

    if (!dashboard) {
        return;
    }

    /*
       Daha önce oluşturulduysa tekrar oluşturma.
    */

    if (
        document.getElementById(
            "sellerSettingsPanel"
        )
    ) {
        return;
    }

    /*
       Dashboard navigasyon alanını bul.
    */

    const navigation =
        dashboard.querySelector(
            ".dashboard-nav"
        );

    /*
       Ayarlar butonu oluştur.
    */

    if (navigation) {

        if (
            !navigation.querySelector(
                '[data-panel="settings"]'
            )
        ) {

            const settingsButton =
                document.createElement(
                    "button"
                );

            settingsButton.type =
                "button";

            settingsButton.className =
                "dashboard-nav";

            settingsButton.dataset.panel =
                "settings";

            settingsButton.innerHTML = `
                <i class="fa-solid fa-gear"></i>
                Ayarlar
            `;

            navigation.appendChild(
                settingsButton
            );

            settingsButton.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".dashboard-nav"
                        )
                        .forEach(nav => {

                            nav.classList.remove(
                                "active-dashboard-nav"
                            );

                        });

                    settingsButton.classList.add(
                        "active-dashboard-nav"
                    );

                    document
                        .querySelectorAll(
                            ".dashboard-panel"
                        )
                        .forEach(panel => {

                            panel.classList.remove(
                                "active-panel"
                            );

                        });

                    document
                        .getElementById(
                            "settingsPanel"
                        )
                        ?.classList.add(
                            "active-panel"
                        );

                    renderSellerSettings();

                }
            );
        }
    }


    /*
       Ayarlar panelini oluştur.
    */

    const panel =
        document.createElement(
            "section"
        );

    panel.id =
        "settingsPanel";

    panel.className =
        "dashboard-panel";

    panel.innerHTML = `
        <div
            style="
                max-width:700px;
                margin:0 auto;
                padding:10px;
            "
        >

            <div
                style="
                    background:#fff;
                    border-radius:24px;
                    padding:28px;
                    box-shadow:0 10px 35px rgba(0,0,0,.06);
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:14px;
                        margin-bottom:25px;
                    "
                >

                    <div
                        style="
                            width:52px;
                            height:52px;
                            border-radius:16px;
                            background:#f3eee4;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:23px;
                        "
                    >
                        ⚙️
                    </div>

                    <div>

                        <h2
                            style="
                                margin:0 0 5px;
                            "
                        >
                            Satıcı Ayarları
                        </h2>

                        <p
                            style="
                                margin:0;
                                color:#68746a;
                            "
                        >
                            Kullanıcı adı ve şifreni buradan değiştirebilirsin.
                        </p>

                    </div>

                </div>


                <form
                    id="sellerSettingsForm"
                >

                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <label
                            for="newSellerUsername"
                            style="
                                display:block;
                                margin-bottom:8px;
                                font-weight:700;
                            "
                        >
                            Yeni Kullanıcı Adı
                        </label>

                        <input
                            id="newSellerUsername"
                            type="text"
                            autocomplete="username"
                            required
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:14px 16px;
                                border:1px solid #ddd6c9;
                                border-radius:14px;
                                font-size:15px;
                                outline:none;
                            "
                        >

                    </div>


                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <label
                            for="newSellerPassword"
                            style="
                                display:block;
                                margin-bottom:8px;
                                font-weight:700;
                            "
                        >
                            Yeni Şifre
                        </label>

                        <input
                            id="newSellerPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                            minlength="4"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:14px 16px;
                                border:1px solid #ddd6c9;
                                border-radius:14px;
                                font-size:15px;
                                outline:none;
                            "
                        >

                    </div>


                    <div
                        style="
                            margin-bottom:24px;
                        "
                    >

                        <label
                            for="confirmSellerPassword"
                            style="
                                display:block;
                                margin-bottom:8px;
                                font-weight:700;
                            "
                        >
                            Yeni Şifre Tekrar
                        </label>

                        <input
                            id="confirmSellerPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                            minlength="4"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:14px 16px;
                                border:1px solid #ddd6c9;
                                border-radius:14px;
                                font-size:15px;
                                outline:none;
                            "
                        >

                    </div>


                    <button
                        type="submit"
                        style="
                            width:100%;
                            border:0;
                            border-radius:15px;
                            padding:15px 20px;
                            background:#52665a;
                            color:white;
                            font-size:15px;
                            font-weight:700;
                            cursor:pointer;
                        "
                    >
                        <i class="fa-solid fa-floppy-disk"></i>
                        Bilgileri Kaydet
                    </button>

                </form>


                <div
                    style="
                        margin-top:22px;
                        padding:15px;
                        border-radius:14px;
                        background:#f8f5ef;
                        color:#68746a;
                        font-size:13px;
                        line-height:1.6;
                    "
                >
                    💡 Kullanıcı adı veya şifreni değiştirdikten sonra
                    yeni bilgiler geçerli olacaktır.
                </div>

            </div>

        </div>
    `;

    /*
       Mevcut dashboard panellerinin sonuna ekle.
    */

    const panels =
        dashboard.querySelector(
            ".dashboard-panels"
        );

    if (panels) {

        panels.appendChild(
            panel
        );

    } else {

        /*
           Eğer HTML'de dashboard-panels
           bulunmuyorsa sellerDashboard'a ekle.
        */

        dashboard.appendChild(
            panel
        );
    }


    /*
       Form kaydetme işlemi.
    */

    document
        .getElementById(
            "sellerSettingsForm"
        )
        ?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const username =
                    document
                        .getElementById(
                            "newSellerUsername"
                        )
                        ?.value
                        .trim();

                const password =
                    document
                        .getElementById(
                            "newSellerPassword"
                        )
                        ?.value;

                const confirmPassword =
                    document
                        .getElementById(
                            "confirmSellerPassword"
                        )
                        ?.value;


                if (!username) {

                    showToast(
                        "Kullanıcı adı boş bırakılamaz.",
                        "❌"
                    );

                    return;
                }


                if (!password) {

                    showToast(
                        "Şifre boş bırakılamaz.",
                        "❌"
                    );

                    return;
                }


                if (
                    password.length < 4
                ) {

                    showToast(
                        "Şifre en az 4 karakter olmalı.",
                        "❌"
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showToast(
                        "Şifreler birbiriyle aynı değil.",
                        "❌"
                    );

                    return;
                }


                saveSellerCredentials(
                    username,
                    password
                );


                showToast(
                    "Kullanıcı adı ve şifre başarıyla değiştirildi!",
                    "🔐"
                );


                event.target.reset();


                /*
                   Formdaki kullanıcı adını
                   tekrar güncel değerle göster.
                */

                renderSellerSettings();

            }
        );
}


/*
   Ayarlar formundaki mevcut bilgileri göster.
*/

function renderSellerSettings() {

    const usernameInput =
        document.getElementById(
            "newSellerUsername"
        );

    const passwordInput =
        document.getElementById(
            "newSellerPassword"
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmSellerPassword"
        );

    if (usernameInput) {

        usernameInput.value =
            getSellerUsername();
    }

    if (passwordInput) {

        passwordInput.value =
            "";
    }

    if (confirmPasswordInput) {

        confirmPasswordInput.value =
            "";
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    /*
       YENİ:
       Satıcı ayarları oluşturuluyor.
       Bunun dışında dashboard sistemi aynı.
    */

    createSellerSettings();

    renderSellerProducts();

    renderSellerOrders();

    renderCoupons();

    const statProducts =
        document.getElementById(
            "statProducts"
        );

    const statOrders =
        document.getElementById(
            "statOrders"
        );

    if (statProducts) {
        statProducts.textContent =
            products.length;
    }

    if (statOrders) {
        statOrders.textContent =
            orders.length;
    }

    const revenue =
        orders.reduce(
            (total, order) =>
                total +
                Number(
                    order.total || 0
                ),
            0
        );

    const statRevenue =
        document.getElementById(
            "statRevenue"
        );

    if (statRevenue) {

        statRevenue.textContent =
            formatPrice(revenue);
    }

    renderRecentOrders();
}


function renderRecentOrders() {

    const container =
        document.getElementById(
            "recentOrders"
        );

    if (!container) {
        return;
    }

    if (
        orders.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                <div>📦</div>
                <h3>
                    Henüz sipariş yok.
                </h3>
            </div>
        `;

        return;
    }

    container.innerHTML =
        orders
            .slice(0, 5)
            .map(
                order => `
                    <div
                        class="dashboard-order-item"
                    >

                        <div>

                            <h3>
                                #${order.id}
                                •
                                ${escapeHTML(
                                    order.customerName
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    order.date
                                )}
                            </p>

                        </div>

                        <strong
                            class="dashboard-order-total"
                        >
                            ${formatPrice(
                                order.total
                            )}
                        </strong>

                    </div>
                `
            )
            .join("");
}


function renderSellerProducts() {

    const grid =
        document.getElementById(
            "sellerProductGrid"
        );

    if (!grid) {
        return;
    }

    if (
        products.length === 0
    ) {

        grid.innerHTML = `
            <div class="empty-state">
                <div>🛍️</div>
                <h3>
                    Henüz ürün yok!
                </h3>
            </div>
        `;

        return;
    }

    grid.innerHTML = "";

    products.forEach(
        product => {

            const images =
                getProductImages(
                    product
                );

            grid.insertAdjacentHTML(
                "beforeend",
                `
                    <article
                        class="seller-product-card"
                    >

                        ${
                            images.length > 0
                                ? `
                                    <img
                                        src="${images[0]}"
                                        alt="${escapeHTML(
                                            product.name
                                        )}"
                                    >
                                `
                                : `
                                    <div
                                        class="seller-product-placeholder"
                                    >
                                        ${getEmojiForCategory(
                                            product.category
                                        )}
                                    </div>
                                `
                        }

                        <div
                            class="seller-product-content"
                        >

                            <h3>
                                ${escapeHTML(
                                    product.name
                                )}
                            </h3>

                            <p>
                                ${formatPrice(
                                    getDiscountedPrice(
                                        product
                                    )
                                )}
                            </p>

                            <div
                                class="seller-product-actions"
                            >

                                <button
                                    class="edit-product-button"
                                    data-edit-product="${product.id}"
                                    type="button"
                                >
                                    Düzenle
                                </button>

                                <button
                                    class="delete-product-button"
                                    data-delete-product="${product.id}"
                                    type="button"
                                >
                                    Sil
                                </button>

                            </div>

                        </div>

                    </article>
                `
            );

        }
    );


    document
        .querySelectorAll(
            "[data-edit-product]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openEditProduct(
                        Number(
                            button.dataset
                                .editProduct
                        )
                    );

                }
            );

        });


    document
        .querySelectorAll(
            "[data-delete-product]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteProduct(
                        Number(
                            button.dataset
                                .deleteProduct
                        )
                    );

                }
            );

        });
}


function renderSellerOrders() {

    const container =
        document.getElementById(
            "sellerOrdersList"
        );

    if (!container) {
        return;
    }

    if (
        orders.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                <div>📦</div>
                <h3>
                    Henüz sipariş yok!
                </h3>
            </div>
        `;

        return;
    }

    container.innerHTML =
        orders
            .map(
                order => `
                    <div
                        class="dashboard-order-item"
                    >

                        <div>

                            <h3>
                                #${order.id}
                                •
                                ${escapeHTML(
                                    order.customerName
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    order.phone
                                )}
                                •
                                ${escapeHTML(
                                    order.payment
                                )}
                                •
                                ${escapeHTML(
                                    order.date
                                )}
                            </p>

                        </div>

                        <strong
                            class="dashboard-order-total"
                        >
                            ${formatPrice(
                                order.total
                            )}
                        </strong>

                    </div>
                `
            )
            .join("");
}


/* =========================================================
   DASHBOARD NAV
========================================================= */

document
    .querySelectorAll(
        ".dashboard-nav"
    )
    .forEach(button => {

        /*
           Ayarlar butonunu createSellerSettings()
           kendisi oluşturacağı için burada sadece
           mevcut butonlar çalışmaya devam ediyor.
        */

        button.addEventListener(
            "click",
            () => {

                const panelName =
                    button.dataset.panel;

                /*
                   Ayarlar butonu için
                   özel click listener yukarıda
                   createSellerSettings içinde
                   oluşturuluyor.
                */

                if (
                    panelName ===
                    "settings"
                ) {
                    return;
                }

                document
                    .querySelectorAll(
                        ".dashboard-nav"
                    )
                    .forEach(nav => {

                        nav.classList.remove(
                            "active-dashboard-nav"
                        );

                    });

                button.classList.add(
                    "active-dashboard-nav"
                );

                document
                    .querySelectorAll(
                        ".dashboard-panel"
                    )
                    .forEach(panel => {

                        panel.classList.remove(
                            "active-panel"
                        );

                    });

                const targetPanel =
                    document.getElementById(
                        `${panelName}Panel`
                    );

                targetPanel?.classList.add(
                    "active-panel"
                );

            }
        );

    });


document
    .getElementById(
        "sellerLogoutBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "sellerDashboard"
                )
                ?.classList.remove(
                    "active"
                );

            showToast(
                "Çıkış yapıldı.",
                "👋"
            );

        }
    );


document
    .getElementById(
        "goShopBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "sellerDashboard"
                )
                ?.classList.remove(
                    "active"
                );

        }
    );


/* =========================================================
   ÜRÜN EKLE / DÜZENLE
========================================================= */

function openNewProductForm() {

    editingImage = "";

    editingImages = [];

    const title =
        document.getElementById(
            "productFormTitle"
        );

    if (title) {
        title.textContent =
            "Yeni Ürün Ekle";
    }

    const form =
        document.getElementById(
            "productForm"
        );

    form?.reset();

    const editingId =
        document.getElementById(
            "editingProductId"
        );

    if (editingId) {
        editingId.value = "";
    }

    resetImagePreview();

    openModal(
        "productFormModal"
    );
}


document
    .getElementById(
        "quickAddProduct"
    )
    ?.addEventListener(
        "click",
        openNewProductForm
    );


document
    .getElementById(
        "addProductBtn"
    )
    ?.addEventListener(
        "click",
        openNewProductForm
    );


function resetImagePreview() {

    const preview =
        document.getElementById(
            "imagePreview"
        );

    if (!preview) {
        return;
    }

    preview.innerHTML = `
        <span>🖼️</span>
        <strong>
            Ürün Fotoğrafı Yükle
        </strong>
        <small>
            En fazla 5 fotoğraf seçebilirsin
        </small>
    `;
}


function openEditProduct(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );

    if (!product) {
        return;
    }

    const images =
        getProductImages(
            product
        );

    editingImages =
        [...images];

    editingImage =
        images[0] || "";

    const title =
        document.getElementById(
            "productFormTitle"
        );

    if (title) {
        title.textContent =
            "Ürünü Düzenle";
    }

    const editingId =
        document.getElementById(
            "editingProductId"
        );

    if (editingId) {
        editingId.value =
            product.id;
    }

    const productName =
        document.getElementById(
            "productName"
        );

    const productCategory =
        document.getElementById(
            "productCategory"
        );

    const productDescription =
        document.getElementById(
            "productDescription"
        );

    const productPrice =
        document.getElementById(
            "productPrice"
        );

    const productDiscount =
        document.getElementById(
            "productDiscount"
        );

    if (productName) {
        productName.value =
            product.name;
    }

    if (productCategory) {
        productCategory.value =
            product.category;
    }

    if (productDescription) {
        productDescription.value =
            product.description;
    }

    if (productPrice) {
        productPrice.value =
            product.price;
    }

    if (productDiscount) {
        productDiscount.value =
            product.discount || 0;
    }

    renderImagePreview();

    openModal(
        "productFormModal"
    );
}


/* =========================================================
   FOTOĞRAF SEÇİMİ
========================================================= */

function renderImagePreview() {

    const preview =
        document.getElementById(
            "imagePreview"
        );

    if (!preview) {
        return;
    }

    if (
        editingImages.length === 0
    ) {

        resetImagePreview();

        return;
    }

    preview.innerHTML = `
        <div
            style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
                width:100%;
                padding:10px;
            "
        >

            ${editingImages.map(
                (image, index) => `
                    <div
                        style="
                            position:relative;
                            width:100px;
                            height:100px;
                            border-radius:14px;
                            overflow:hidden;
                            background:#f5f1e9;
                            flex:0 0 100px;
                        "
                    >

                        <img
                            src="${image}"
                            alt="Ürün fotoğrafı ${
                                index + 1
                            }"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:contain;
                                display:block;
                            "
                        >

                        <button
                            type="button"
                            data-remove-edit-image="${index}"
                            style="
                                position:absolute;
                                right:5px;
                                top:5px;
                                width:25px;
                                height:25px;
                                border:0;
                                border-radius:50%;
                                background:white;
                                cursor:pointer;
                            "
                        >
                            ×
                        </button>

                    </div>
                `
            ).join("")}

        </div>

        <strong>
            ${editingImages.length} / 5 fotoğraf
        </strong>
    `;


    document
        .querySelectorAll(
            "[data-remove-edit-image]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset
                                .removeEditImage
                        );

                    editingImages.splice(
                        index,
                        1
                    );

                    editingImage =
                        editingImages[0] ||
                        "";

                    renderImagePreview();

                }
            );

        });
}


document
    .getElementById(
        "productImageInput"
    )
    ?.addEventListener(
        "change",
        event => {

            const files =
                Array.from(
                    event.target.files || []
                );

            if (
                files.length === 0
            ) {
                return;
            }

            const availableSlots =
                5 -
                editingImages.length;

            if (
                availableSlots <= 0
            ) {

                showToast(
                    "En fazla 5 fotoğraf ekleyebilirsin.",
                    "🖼️"
                );

                event.target.value = "";

                return;
            }

            const selectedFiles =
                files.slice(
                    0,
                    availableSlots
                );

            let loadedCount = 0;

            selectedFiles.forEach(
                file => {

                    const reader =
                        new FileReader();

                    reader.onload =
                        loadEvent => {

                            editingImages.push(
                                loadEvent.target.result
                            );

                            loadedCount++;

                            if (
                                loadedCount ===
                                selectedFiles.length
                            ) {

                                editingImages =
                                    editingImages.slice(
                                        0,
                                        5
                                    );

                                editingImage =
                                    editingImages[0] ||
                                    "";

                                renderImagePreview();

                            }

                        };

                    reader.readAsDataURL(
                        file
                    );

                }
            );

            event.target.value = "";

        }
    );


/* =========================================================
   ÜRÜN FORMU
========================================================= */

document
    .getElementById(
        "productForm"
    )
    ?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const editingId =
                Number(
                    document
                        .getElementById(
                            "editingProductId"
                        )
                        ?.value
                );

            const productData = {

                name:
                    document
                        .getElementById(
                            "productName"
                        )
                        ?.value
                        .trim(),

                category:
                    document
                        .getElementById(
                            "productCategory"
                        )
                        ?.value,

                description:
                    document
                        .getElementById(
                            "productDescription"
                        )
                        ?.value
                        .trim(),

                price:
                    Number(
                        document
                            .getElementById(
                                "productPrice"
                            )
                            ?.value
                    ),

                discount:
                    Number(
                        document
                            .getElementById(
                                "productDiscount"
                            )
                            ?.value
                    ),

                images:
                    [...editingImages].slice(
                        0,
                        5
                    ),

                image:
                    editingImages[0] ||
                    ""
            };


            if (
                !productData.name ||
                !productData.description
            ) {

                showToast(
                    "Tüm gerekli alanları doldur.",
                    "❌"
                );

                return;
            }


            if (editingId) {

                const index =
                    products.findIndex(
                        product =>
                            product.id ===
                            editingId
                    );

                if (
                    index !== -1
                ) {

                    products[index] = {

                        ...products[index],

                        ...productData,

                        images:
                            productData.images,

                        image:
                            productData.image
                    };
                }

                showToast(
                    "Ürün güncellendi!",
                    "✨"
                );

            } else {

                products.unshift({

                    id: Date.now(),

                    ...productData

                });

                showToast(
                    "Yeni ürün eklendi!",
                    "🎉"
                );
            }


            saveData(
                STORAGE_KEYS.products,
                products
            );

            closeModal(
                "productFormModal"
            );

            renderProducts();

            renderDashboard();

            updateCart();

            renderFavorites();

            editingImage = "";

            editingImages = [];

        }
    );


/* =========================================================
   PRODUCT DELETE
========================================================= */

function deleteProduct(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );

    if (!product) {
        return;
    }

    const approved =
        confirm(
            `"${product.name}" ürününü silmek istediğine emin misin?`
        );

    if (!approved) {
        return;
    }

    products =
        products.filter(
            product =>
                product.id !== productId
        );

    favorites =
        favorites.filter(
            id =>
                id !== productId
        );

    cart =
        cart.filter(
            item =>
                item.productId !==
                productId
        );

    saveData(
        STORAGE_KEYS.products,
        products
    );

    saveData(
        STORAGE_KEYS.favorites,
        favorites
    );

    saveData(
        STORAGE_KEYS.cart,
        cart
    );

    updateFavoriteCount();

    updateCart();

    renderProducts();

    renderDashboard();

    showToast(
        "Ürün silindi.",
        "🗑️"
    );
}


/* =========================================================
   COUPON MANAGEMENT
========================================================= */

document
    .getElementById(
        "couponForm"
    )
    ?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const code =
                document
                    .getElementById(
                        "newCouponCode"
                    )
                    ?.value
                    .trim()
                    .toUpperCase();

            const percent =
                Number(
                    document
                        .getElementById(
                            "newCouponPercent"
                        )
                        ?.value
                );

            if (
                !code ||
                percent < 1 ||
                percent > 100
            ) {

                showToast(
                    "Geçerli bilgiler gir.",
                    "❌"
                );

                return;
            }

            const existingIndex =
                coupons.findIndex(
                    coupon =>
                        coupon.code ===
                        code
                );

            if (
                existingIndex !== -1
            ) {

                coupons[
                    existingIndex
                ].percent = percent;

            } else {

                coupons.push({
                    code,
                    percent
                });

            }

            saveData(
                STORAGE_KEYS.coupons,
                coupons
            );

            event.target.reset();

            renderCoupons();

            showToast(
                "Kupon kaydedildi!",
                "🎟️"
            );

        }
    );


function renderCoupons() {

    const list =
        document.getElementById(
            "couponList"
        );

    if (!list) {
        return;
    }

    if (
        coupons.length === 0
    ) {

        list.innerHTML = `
            <p
                style="color:#68746a"
            >
                Henüz aktif kupon yok.
            </p>
        `;

        return;
    }

    list.innerHTML = "";

    coupons.forEach(
        (coupon, index) => {

            list.insertAdjacentHTML(
                "beforeend",
                `
                    <div
                        class="coupon-item"
                    >

                        <span>

                            <strong>
                                ${escapeHTML(
                                    coupon.code
                                )}
                            </strong>

                            •
                            %${coupon.percent}

                        </span>

                        <button
                            data-delete-coupon="${index}"
                            type="button"
                        >
                            Sil
                        </button>

                    </div>
                `
            );

        }
    );


    document
        .querySelectorAll(
            "[data-delete-coupon]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset
                                .deleteCoupon
                        );

                    coupons.splice(
                        index,
                        1
                    );

                    saveData(
                        STORAGE_KEYS.coupons,
                        coupons
                    );

                    renderCoupons();

                    showToast(
                        "Kupon silindi.",
                        "🗑️"
                    );

                }
            );

        });
}


/* =========================================================
   ESC
========================================================= */

document
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }

            document
                .querySelectorAll(
                    ".modal.active"
                )
                .forEach(modal => {

                    closeModal(
                        modal.id
                    );

                });

            closeCart();

            closeMobileMenu();

        }
    );


/* =========================================================
   BAŞLANGIÇ
========================================================= */

renderProducts();

renderFavorites();

updateFavoriteCount();

updateCart();

renderDashboard();
/* =========================================================
   CUTECLAYSHOP - AYARLAR DÜZELTME
   Tek Ayarlar butonu + kullanıcı adı/şifre değiştirme
========================================================= */

(function () {

    function fixSellerSettings() {

        const dashboard =
            document.getElementById("sellerDashboard");

        if (!dashboard) return;

        const menu =
            dashboard.querySelector(".dashboard-menu");

        if (!menu) return;


        /* -----------------------------------------------------
           AYARLAR BUTONLARINI BUL
        ----------------------------------------------------- */

        const settingsButtons =
            menu.querySelectorAll(
                '.dashboard-nav[data-panel="settings"]'
            );


        /* -----------------------------------------------------
           SADECE 1 TANE AYARLAR BUTONU BIRAK
        ----------------------------------------------------- */

        if (settingsButtons.length > 1) {

            for (
                let i = 0;
                i < settingsButtons.length - 1;
                i++
            ) {
                settingsButtons[i].remove();
            }

        }


        const settingsButton =
            menu.querySelector(
                '.dashboard-nav[data-panel="settings"]'
            );

        const discountsButton =
            menu.querySelector(
                '.dashboard-nav[data-panel="discounts"]'
            );


        /* -----------------------------------------------------
           AYARLAR BUTONUNU İNDİRİMLERİN ALTINA TAŞI
        ----------------------------------------------------- */

        if (
            settingsButton &&
            discountsButton
        ) {

            discountsButton.insertAdjacentElement(
                "afterend",
                settingsButton
            );

        }


        /* -----------------------------------------------------
           DUPLICATE AYARLAR PANELLERİNİ TEMİZLE
        ----------------------------------------------------- */

        const settingsPanels =
            dashboard.querySelectorAll(
                "#settingsPanel"
            );

        if (settingsPanels.length > 1) {

            for (
                let i = 1;
                i < settingsPanels.length;
                i++
            ) {
                settingsPanels[i].remove();
            }

        }


        const settingsPanel =
            document.getElementById(
                "settingsPanel"
            );

        if (!settingsPanel) return;


        /* -----------------------------------------------------
           AYARLAR BUTONUNA ÇALIŞAN CLICK
        ----------------------------------------------------- */

        if (settingsButton) {

            settingsButton.onclick = function (event) {

                event.preventDefault();
                event.stopPropagation();

                document
                    .querySelectorAll(".dashboard-nav")
                    .forEach(function (button) {

                        button.classList.remove(
                            "active-dashboard-nav"
                        );

                    });


                settingsButton.classList.add(
                    "active-dashboard-nav"
                );


                document
                    .querySelectorAll(".dashboard-panel")
                    .forEach(function (panel) {

                        panel.classList.remove(
                            "active-panel"
                        );

                    });


                settingsPanel.classList.add(
                    "active-panel"
                );


                loadSellerSettings();

            };

        }


        /* -----------------------------------------------------
           AYARLAR FORMU
        ----------------------------------------------------- */

        const form =
            document.getElementById(
                "sellerSettingsForm"
            );

        if (!form) return;


        /* Eski submit olaylarını ez */

        form.onsubmit = function (event) {

            event.preventDefault();
            event.stopPropagation();


            const usernameInput =
                document.getElementById(
                    "settingsUsername"
                );

            const currentPasswordInput =
                document.getElementById(
                    "settingsCurrentPassword"
                );

            const newPasswordInput =
                document.getElementById(
                    "settingsNewPassword"
                );

            const confirmPasswordInput =
                document.getElementById(
                    "settingsNewPasswordConfirm"
                );


            if (
                !usernameInput ||
                !currentPasswordInput ||
                !newPasswordInput ||
                !confirmPasswordInput
            ) {

                alert(
                    "Ayarlar alanları bulunamadı."
                );

                return;

            }


            const newUsername =
                usernameInput.value.trim();

            const currentPassword =
                currentPasswordInput.value;

            const newPassword =
                newPasswordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            /* -------------------------------------------------
               KULLANICI ADI
            ------------------------------------------------- */

            if (!newUsername) {

                alert(
                    "Yeni kullanıcı adı boş bırakılamaz."
                );

                return;

            }


            /* -------------------------------------------------
               MEVCUT ŞİFRE
            ------------------------------------------------- */

            const oldPassword =
                localStorage.getItem(
                    "cuteclay_seller_password"
                ) || "1234";


            if (
                currentPassword !== oldPassword
            ) {

                alert(
                    "Mevcut şifre yanlış! ❌"
                );

                return;

            }


            /* -------------------------------------------------
               YENİ ŞİFRE
            ------------------------------------------------- */

            if (!newPassword) {

                alert(
                    "Yeni şifre boş bırakılamaz."
                );

                return;

            }


            if (newPassword.length < 4) {

                alert(
                    "Yeni şifre en az 4 karakter olmalı."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                alert(
                    "Yeni şifreler aynı değil! ❌"
                );

                return;

            }


            /* -------------------------------------------------
               YENİ BİLGİLERİ KAYDET
            ------------------------------------------------- */

            localStorage.setItem(
                "cuteclay_seller_username",
                newUsername
            );

            localStorage.setItem(
                "cuteclay_seller_password",
                newPassword
            );


            /* -------------------------------------------------
               FORMU TEMİZLE
            ------------------------------------------------- */

            currentPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";


            /* Kullanıcı adını güncel tut */

            usernameInput.value =
                newUsername;


            alert(
                "Kullanıcı adı ve şifre başarıyla değiştirildi! ✅"
            );

        };

    }


    /* ---------------------------------------------------------
       AYARLAR BİLGİLERİNİ YÜKLE
    --------------------------------------------------------- */

    function loadSellerSettings() {

        const usernameInput =
            document.getElementById(
                "settingsUsername"
            );

        if (!usernameInput) return;


        const username =
            localStorage.getItem(
                "cuteclay_seller_username"
            ) || "admin";


        usernameInput.value =
            username;

    }


    /* ---------------------------------------------------------
       DASHBOARD AÇILDIĞINDA DÜZELT
    --------------------------------------------------------- */

    function startSettingsFix() {

        fixSellerSettings();

    }


    /* Sayfa hazır */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startSettingsFix
        );

    } else {

        startSettingsFix();

    }


    /* ---------------------------------------------------------
       PANEL HER AÇILDIĞINDA TEKRAR DÜZELT
    --------------------------------------------------------- */

    setInterval(
        function () {

            const dashboard =
                document.getElementById(
                    "sellerDashboard"
                );

            if (
                dashboard &&
                dashboard.classList.contains("active")
            ) {

                fixSellerSettings();

            }

        },
        500
    );


})();
