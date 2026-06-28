/* ==========================================================================
   REVORA LUXURY BRAND EXPERIENCE - CORE LOGIC ENGINE
   ========================================================================== */

// 1. PRODUCT METADATA
const PRODUCTS = {
  1: {
    id: 1,
    name: "Satin Contour Bra Set",
    meta: "Satin wire-free contour set",
    price: 3999.00,
    oldPrice: 4999.00,
    badge: "Best Seller",
    description: "Ditch the painful digging. Our signature luxury bra features 3D contour-molding that lifts and sculpts with 0% underwires, adapting perfectly to your unique shape for all-day comfort.",
    colors: ["Deep Burgundy", "Deep Espresso", "Creamy Beige"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "assets/images/uploaded_burgundy_front.jpg",
      "assets/images/bra_brown_front.png",
      "assets/images/bra_pink_front.jpg"
    ]
  },
  2: {
    id: 2,
    name: "Satin Plunge Lingerie Set",
    meta: "French lace detailing set",
    price: 9999.00,
    oldPrice: 11999.00,
    badge: "Limited Edition",
    description: "Elegantly constructed with French lace detailing and deep burgundy satin. Includes a soft-cup plunge bralette and matching mid-rise briefs with adjustable satin straps.",
    colors: ["Deep Burgundy", "Warm Caramel Sand", "Creamy Beige"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "assets/images/uploaded_burgundy_full.jpg",
      "assets/images/product_lingerie.png",
      "assets/images/bra_pink_front.png"
    ]
  },
  3: {
    id: 3,
    name: "Rose Satin Cami Set",
    meta: "Pure organic silk loungewear",
    price: 14999.00,
    oldPrice: null,
    badge: "Signature",
    description: "Float effortlessly in our matching camisole and tap shorts set in pure organic silk. Styled with a delicate cowl neck, cross-back thin straps, and side-slit hem for ultimate luxury lounging.",
    colors: ["Rose Pink", "Creamy Beige"],
    sizes: ["S", "M", "L"],
    images: [
      "assets/images/uploaded_pink_teal.jpg",
      "assets/images/fabric_texture.png"
    ]
  },
  4: {
    id: 4,
    name: "Revora Signature Gift Box",
    meta: "Luxury Packaging Accessory",
    price: 799.00,
    oldPrice: null,
    badge: "Exclusive",
    description: "The ultimate finishing touch. Drawer-style matte deep espresso box with warm caramel embossed foil dragonfly logo and luxury soft velvet tissue wrap.",
    colors: ["Deep Espresso"],
    sizes: ["O/S"],
    images: [
      "assets/images/hero_silk_bg.png",
      "assets/images/fabric_texture.png"
    ]
  },
  5: {
    id: 5,
    name: "Sage Comfort Bralette",
    meta: "Certified beechwood modal bralette",
    price: 3499.00,
    oldPrice: null,
    badge: "New",
    description: "Certified organic Austrian beechwood modal fabric offering lightweight comfort and seamless wire-free support.",
    colors: ["Sage Green", "Sage Green Detail"],
    sizes: ["S", "M", "L"],
    images: [
      "assets/images/bra_green_front.png",
      "assets/images/bra_green_back.png"
    ]
  },
  6: {
    id: 6,
    name: "Slate Blue Active Bra",
    meta: "Seamless active stretch bra",
    price: 3299.00,
    oldPrice: null,
    badge: "New",
    description: "Four-way stretch premium Elastane core fabric woven to support your form and breathe naturally under pressure.",
    colors: ["Slate Blue", "Slate Blue Detail"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "assets/images/bra_blue_front.png",
      "assets/images/bra_blue_back.png"
    ]
  }
};

// 2. STATE OBJECT
const STATE = {
  cart: [],
  wishlist: new Set(),

  // Active PDP properties
  currentPdpId: 1,
  pdpQty: 1,
  pdpColor: "Deep Espresso",
  pdpSize: "M"
};

// 3. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // initCursor();
  initDrawers();
  initCart();
  initWishlist();
  initReviews();
  initFabricAccordion();
  initScrollAnimations();
  initStoryScrollAnimations();
  initSearch();
  initPdp();
  initCraftsmanshipCarousel();
  initCardSwatches();
  initProductsCarousel();
  initSectionFades();
  initMagnetics();
  initAnnouncementBar();
  initHeroScrollAnimation();
});

// ==========================================================================
// LUXURY CUSTOM CURSOR
// ==========================================================================
function initCursor() {
  const cursor = document.getElementById("custom-cursor");
  const follower = document.getElementById("custom-follower");

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Core dot immediately follows mouse
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower element smooth lerp movement (inertia)
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Highlight effect on clickable tags
  const interactives = "a, button, .product-card, .pdp-trigger, .quick-add-size, .qty-btn, .pdp-thumb, .pdp-color-swatch, .category-card";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.add("hovering-interactive");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove("hovering-interactive");
    }
  });
}

// ==========================================================================
// MAGNETIC BUTTON PHYSICS
// ==========================================================================
function initMagnetics() {
  const magneticWraps = document.querySelectorAll(".magnetic-btn-wrap");

  magneticWraps.forEach((wrap) => {
    const btn = wrap.querySelector("a, button");
    if (!btn) return;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      // Calculate cursor position relative to wrap center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Pull button slightly towards pointer
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      wrap.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    wrap.addEventListener("mouseleave", () => {
      // Snap back smoothly
      btn.style.transform = "translate(0px, 0px)";
      wrap.style.transform = "translate(0px, 0px)";
    });
  });
}

// ==========================================================================
// DRAWERS & MODALS MECHANICS
// ==========================================================================
function initDrawers() {
  const overlay = document.getElementById("drawer-overlay");

  // Drawer triggers & objects
  const drawers = [
    { trigger: "cart-trigger", drawer: "cart-drawer", close: "cart-close" },
    { trigger: "wishlist-trigger", drawer: "wishlist-drawer", close: "wishlist-close" },
    { trigger: "mobile-menu-trigger", drawer: "mobile-menu-drawer", close: "mobile-menu-close" }
  ];

  function closeAllDrawers() {
    drawers.forEach(d => {
      document.getElementById(d.drawer).classList.remove("active");
    });
    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");
  }

  drawers.forEach(d => {
    const tBtn = document.getElementById(d.trigger);
    const dObj = document.getElementById(d.drawer);
    const cBtn = document.getElementById(d.close);

    if (tBtn && dObj) {
      tBtn.addEventListener("click", () => {
        closeAllDrawers();
        dObj.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("drawer-open");
      });
    }

    if (cBtn) {
      cBtn.addEventListener("click", closeAllDrawers);
    }
  });

  if (overlay) {
    overlay.addEventListener("click", closeAllDrawers);
  }

  // Sticky header transition on scroll
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile navigation links click behavior
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  mobileLinks.forEach(link => {
    link.addEventListener("click", closeAllDrawers);
  });
}

// ==========================================================================
// SHOPPING CART CONTROLLER
// ==========================================================================
function initCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartBadge = document.getElementById("cart-badge");
  const cartTotalPrice = document.getElementById("cart-total-price");
  const progressText = document.getElementById("shipping-goal-text");
  const progressBar = document.getElementById("shipping-progress");

  // Render shopping cart list
  window.renderCart = function () {
    cartContainer.innerHTML = "";

    if (STATE.cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="cart-empty-message">
          <svg class="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <p style="font-family:var(--font-serif); font-size:1.2rem; margin-bottom:1.5rem;">Your cart is empty.</p>
          <a href="#best-sellers" class="btn btn-outline" onclick="document.getElementById('cart-close').click();"><span>Shop Bestsellers</span></a>
        </div>
      `;
      cartBadge.textContent = "0";
      cartTotalPrice.textContent = "₹0.00";
      progressBar.style.width = "0%";
      progressText.textContent = "Spend ₹12,500.00 more for Free Express Shipping";
      return;
    }

    let subtotal = 0;
    let itemCount = 0;

    STATE.cart.forEach((item, index) => {
      const prod = PRODUCTS[item.id];
      const itemPrice = prod.price * item.quantity;
      subtotal += itemPrice;
      itemCount += item.quantity;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${prod.images[0]}" class="cart-item-img" alt="${prod.name}">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${prod.name}</h4>
          <p class="cart-item-meta">Size: ${item.size} | Color: ${item.color}</p>
          <div class="cart-item-qty">
            <button class="qty-btn dec-qty-btn" data-index="${index}">&minus;</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn inc-qty-btn" data-index="${index}">&plus;</button>
          </div>
          <button class="cart-item-remove" data-index="${index}">Remove</button>
        </div>
        <div class="cart-item-price-wrap">
          <span class="cart-item-price">₹${itemPrice.toFixed(2)}</span>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    // Update quantities, counters, values
    cartBadge.textContent = itemCount;
    cartTotalPrice.textContent = `₹${subtotal.toFixed(2)}`;

    // Free Shipping Progress Calculation
    const target = 12500.00;
    const progressPercent = Math.min((subtotal / target) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;

    if (subtotal >= target) {
      progressText.innerHTML = "<strong>Congratulations!</strong> You have unlocked Free Express Shipping.";
    } else {
      const remaining = target - subtotal;
      progressText.innerHTML = `Spend <strong>₹${remaining.toFixed(2)}</strong> more for Free Express Shipping`;
    }

    // Attach cart actions event listeners
    document.querySelectorAll(".dec-qty-btn").forEach(btn => {
      btn.addEventListener("click", (e) => adjustCartQty(parseInt(e.target.dataset.index), -1));
    });

    document.querySelectorAll(".inc-qty-btn").forEach(btn => {
      btn.addEventListener("click", (e) => adjustCartQty(parseInt(e.target.dataset.index), 1));
    });

    document.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.addEventListener("click", (e) => removeCartItem(parseInt(e.target.dataset.index)));
    });
  };

  // Add Item to cart
  window.addToCart = function (id, size, color, quantity = 1) {
    // Check if duplicate item exists
    const duplicateIndex = STATE.cart.findIndex(
      item => item.id === id && item.size === size && item.color === color
    );

    if (duplicateIndex > -1) {
      STATE.cart[duplicateIndex].quantity += quantity;
    } else {
      STATE.cart.push({ id, size, color, quantity });
    }

    window.renderCart();
    // Open Cart Drawer automatically on Add
    document.getElementById("cart-trigger").click();
  };

  function adjustCartQty(index, amount) {
    STATE.cart[index].quantity += amount;
    if (STATE.cart[index].quantity <= 0) {
      STATE.cart.splice(index, 1);
    }
    window.renderCart();
  }

  function removeCartItem(index) {
    STATE.cart.splice(index, 1);
    window.renderCart();
  }

  // Cross Sell: Add signature gift box
  const giftBoxBtn = document.getElementById("add-giftbox-btn");
  if (giftBoxBtn) {
    giftBoxBtn.addEventListener("click", () => {
      window.addToCart(4, "O/S", "Deep Espresso", 1);
    });
  }

  // Cart quick-adds from Cards
  document.querySelectorAll(".quick-add-trigger").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = parseInt(e.currentTarget.dataset.id);
      const parent = e.currentTarget.closest(".product-card");
      if (!parent) return;

      // Find selected size button
      const activeSizeBtn = parent.querySelector(".quick-add-size.active");
      const size = activeSizeBtn ? activeSizeBtn.dataset.size : PRODUCTS[id].sizes[0];

      // Find selected color swatch
      const activeColorSwatch = parent.querySelector(".product-swatch.active");
      const color = activeColorSwatch ? activeColorSwatch.dataset.color : PRODUCTS[id].colors[0];

      // Add feedback visual states
      const originalHtml = btn.innerHTML;
      btn.classList.add("adding");
      btn.innerHTML = `<span class="btn-spinner"></span> Adding...`;

      setTimeout(() => {
        btn.classList.remove("adding");
        btn.classList.add("added");
        btn.innerHTML = `✓ Added!`;

        window.addToCart(id, size, color, 1);

        setTimeout(() => {
          btn.classList.remove("added");
          btn.innerHTML = originalHtml;
        }, 1500);
      }, 700);
    });
  });

  // Handle sizes selects on home listing cards
  document.querySelectorAll(".quick-add-size").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = e.target.closest(".product-sizes-selector");
      // Uncheck other buttons
      parent.querySelectorAll(".quick-add-size").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
    });
  });

  renderCart();
}

// ==========================================================================
// WISHLIST CONTROLLER
// ==========================================================================
function initWishlist() {
  const wishlistContainer = document.getElementById("wishlist-items-container");
  const wishlistBadge = document.getElementById("wishlist-badge");

  function renderWishlist() {
    wishlistContainer.innerHTML = "";

    if (STATE.wishlist.size === 0) {
      wishlistContainer.innerHTML = `
        <div class="cart-empty-message">
          <svg class="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <p style="font-family:var(--font-serif); font-size:1.2rem; margin-bottom:1.5rem;">Your wishlist is empty.</p>
          <a href="#best-sellers" class="btn btn-outline" onclick="document.getElementById('wishlist-close').click();"><span>Shop Bestsellers</span></a>
        </div>
      `;
      wishlistBadge.textContent = "0";
      return;
    }

    wishlistBadge.textContent = STATE.wishlist.size;

    STATE.wishlist.forEach(id => {
      const prod = PRODUCTS[id];
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <img src="${prod.images[0]}" class="cart-item-img" alt="${prod.name}">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${prod.name}</h4>
          <p class="cart-item-price" style="font-family:var(--font-serif); color:var(--caramel); margin-bottom:0.5rem;">₹${prod.price.toFixed(2)}</p>
          <button class="btn btn-outline" style="padding:0.4rem 1.2rem; font-size:0.7rem; border-color:var(--caramel); color:var(--caramel-light);" onclick="window.addToCart(${id}, '${prod.sizes[0]}', '${prod.colors[0]}', 1)">
            <span>Add to Cart</span>
          </button>
          <button class="cart-item-remove remove-wishlist-btn" data-id="${id}" style="margin-top:0.6rem;">Remove</button>
        </div>
      `;
      wishlistContainer.appendChild(item);
    });

    document.querySelectorAll(".remove-wishlist-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        toggleWishlist(parseInt(e.target.dataset.id));
      });
    });
  }

  window.toggleWishlist = function (id) {
    if (STATE.wishlist.has(id)) {
      STATE.wishlist.delete(id);
      // Toggle card icon visual active states
      document.querySelectorAll(`.wishlist-toggle-btn[data-id="${id}"]`).forEach(btn => {
        btn.querySelector("svg").setAttribute("fill", "none");
      });
    } else {
      STATE.wishlist.add(id);
      document.querySelectorAll(`.wishlist-toggle-btn[data-id="${id}"]`).forEach(btn => {
        btn.querySelector("svg").setAttribute("fill", "currentColor");
      });
    }
    renderWishlist();
  };

  // Setup wishlist buttons listeners
  document.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(parseInt(e.currentTarget.dataset.id));
    });
  });

  renderWishlist();
}

// ==========================================================================
// REVIEWS SLIDER
// ==========================================================================
function initReviews() {
  const slides = document.querySelectorAll(".review-slide");
  const prevBtn = document.getElementById("prev-review");
  const nextBtn = document.getElementById("next-review");

  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  }

  // Auto transition every 8s
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 8000);
}

// ==========================================================================
// ANNOUNCEMENT BAR TICKER
// ==========================================================================
function initAnnouncementBar() {
  const items = document.querySelectorAll(".announcement-item");
  if (items.length <= 1) return;

  let current = 0;
  setInterval(() => {
    items[current].classList.remove("active");
    current = (current + 1) % items.length;
    items[current].classList.add("active");
  }, 5000);
}

// ==========================================================================
// FABRIC TECHNOLOGY ACCORDION
// ==========================================================================
function initFabricAccordion() {
  const items = document.querySelectorAll(".fabric-accordion-item");

  items.forEach(item => {
    const header = item.querySelector(".fabric-accordion-header");
    const content = item.querySelector(".fabric-accordion-content");

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close other active accordions
      document.querySelectorAll(".fabric-accordion-item").forEach(b => {
        b.classList.remove("active");
        b.querySelector(".fabric-accordion-content").style.maxHeight = "0";
      });

      if (!isActive) {
        item.classList.add("active");
        // Read full scroll height of content panel
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

// ==========================================================================
// SEARCH CONTROL SYSTEM
// ==========================================================================
function initSearch() {
  const overlay = document.getElementById("search-overlay");
  const trigger = document.getElementById("search-trigger");
  const close = document.getElementById("search-close");
  const input = document.getElementById("search-input");

  if (!overlay || !trigger) return;

  trigger.addEventListener("click", () => {
    overlay.classList.add("active");
    document.body.classList.add("drawer-open");
    setTimeout(() => input.focus(), 300);
  });

  function closeSearch() {
    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");
    input.value = "";
  }

  if (close) close.addEventListener("click", closeSearch);

  // Suggestion tags triggers
  document.querySelectorAll(".search-tag-trigger").forEach(tag => {
    tag.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = e.target.textContent;
      // Simulate typing search
    });
  });

  // Escape key close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeSearch();
    }
  });
}

// ==========================================================================
// DYNAMIC PDP TEMPLATE CONTROLLER & INTERACTIVE 360 VIEWER
// ==========================================================================
function initPdp() {
  const homeView = document.getElementById("homepage-view");
  const pdpView = document.getElementById("product-detail-view");
  const backBtn = document.getElementById("pdp-back-trigger");
  const logoTrigger = document.getElementById("header-logo-trigger");

  // State elements
  const pdpTitle = document.getElementById("pdp-detail-title");
  const pdpPrice = document.getElementById("pdp-detail-price");
  const pdpPriceOld = document.getElementById("pdp-detail-price-old");
  const pdpDescr = document.getElementById("pdp-detail-descr");
  const pdpMainImg = document.getElementById("pdp-main-image");
  const pdpThumbsWrap = document.getElementById("pdp-thumbs-wrap");
  const pdpSizesContainer = document.getElementById("pdp-sizes-container");
  const pdpSelectedColorLabel = document.getElementById("pdp-selected-color");
  const pdpSelectedSizeLabel = document.getElementById("pdp-selected-size");
  const stickyBar = document.getElementById("pdp-sticky-bar");

  // Sticky elements
  const stickyTitle = document.getElementById("sticky-bar-title");
  const stickyPrice = document.getElementById("sticky-bar-price");
  const stickyImg = document.getElementById("sticky-bar-image");

  // Bundle elements
  const bundleImg1 = document.getElementById("bundle-img-1");
  const bundleName1 = document.getElementById("bundle-name-1");
  const bundlePrice1 = document.getElementById("bundle-price-1");
  const bundleTotal = document.getElementById("bundle-total-price");

  // View PDP function
  window.openPdp = function (id) {
    STATE.currentPdpId = id;
    const prod = PRODUCTS[id];

    // Reset quantity
    STATE.pdpQty = 1;
    document.getElementById("pdp-qty-input").value = 1;

    // Reset variants
    STATE.pdpColor = prod.colors[0];
    STATE.pdpSize = prod.sizes[0];
    pdpSelectedColorLabel.textContent = STATE.pdpColor;
    pdpSelectedSizeLabel.textContent = STATE.pdpSize;

    // Build texts & details
    pdpTitle.textContent = prod.name;
    pdpPrice.textContent = `₹${prod.price.toFixed(2)}`;

    if (prod.oldPrice) {
      pdpPriceOld.textContent = `₹${prod.oldPrice.toFixed(2)}`;
      pdpPriceOld.style.display = "inline";
    } else {
      pdpPriceOld.style.display = "none";
    }

    pdpDescr.textContent = prod.description;
    pdpMainImg.src = prod.images[0];

    // Build thumbnails list
    pdpThumbsWrap.innerHTML = "";
    prod.images.forEach((img, i) => {
      pdpThumbsWrap.innerHTML += `
        <div class="pdp-thumb ${i === 0 ? 'active' : ''}" data-img="${img}">
          <img src="${img}" alt="Angle ${i + 1}">
        </div>
      `;
    });

    // Thumbnail click triggers
    document.querySelectorAll(".pdp-thumb").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
        const parent = e.currentTarget;
        parent.classList.add("active");
        pdpMainImg.src = parent.dataset.img;

        // Ensure Gallery View button is selected
        document.getElementById("btn-view-gallery").click();
      });
    });

    // Build sizes layout list
    pdpSizesContainer.innerHTML = "";
    prod.sizes.forEach((sz, i) => {
      pdpSizesContainer.innerHTML += `
        <button class="pdp-size-btn ${i === 0 ? 'active' : ''} pdp-size-select" data-size="${sz}">${sz}</button>
      `;
    });

    document.querySelectorAll(".pdp-size-select").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".pdp-size-select").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        STATE.pdpSize = e.target.dataset.size;
        pdpSelectedSizeLabel.textContent = STATE.pdpSize;
      });
    });

    // Build color swatch selector layout list
    const swatchesContainer = document.querySelector(".pdp-color-swatches");
    swatchesContainer.innerHTML = "";
    prod.colors.forEach((color, i) => {
      let rgbCode = "#4A342B";
      if (color === "Warm Caramel Sand") rgbCode = "#C8AD7C";
      if (color === "Creamy Beige Honeyed") rgbCode = "#F2E8D6";

      swatchesContainer.innerHTML += `
        <div class="pdp-color-swatch ${i === 0 ? 'active' : ''}" data-color="${color}" style="background:${rgbCode};"></div>
      `;
    });

    document.querySelectorAll(".pdp-color-swatch").forEach(swatch => {
      swatch.addEventListener("click", (e) => {
        document.querySelectorAll(".pdp-color-swatch").forEach(s => s.classList.remove("active"));
        e.target.classList.add("active");
        STATE.pdpColor = e.target.dataset.color;
        pdpSelectedColorLabel.textContent = STATE.pdpColor;
      });
    });

    // Update sticky bar details
    stickyTitle.textContent = prod.name;
    stickyPrice.textContent = `₹${prod.price.toFixed(2)}`;
    stickyImg.src = prod.images[0];

    // Update bundle builder item 1
    bundleImg1.src = prod.images[0];
    bundleName1.textContent = prod.name;
    bundlePrice1.textContent = `₹${prod.price.toFixed(2)}`;

    // Recalc bundle subtotal
    recalculateBundle();

    // Toggle view states (Home vs PDP)
    homeView.style.display = "none";
    pdpView.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize 360 viewer module
    setup360Viewer(prod.images);
  }

  // Recalculate FBT Bundle items checks
  function recalculateBundle() {
    const prod = PRODUCTS[STATE.currentPdpId];
    let originalTotal = prod.price;

    const check2 = document.getElementById("bundle-check-2");
    const check3 = document.getElementById("bundle-check-3");

    if (check2 && check2.checked) originalTotal += 9999.00; // Lingerie Set
    if (check3 && check3.checked) originalTotal += 799.00;  // Gift Box

    const discountedTotal = originalTotal * 0.85; // 15% discount

    bundleTotal.innerHTML = `₹${discountedTotal.toFixed(2)} <span>₹${originalTotal.toFixed(2)}</span>`;
  }

  document.querySelectorAll(".bundle-calc-trigger").forEach(c => {
    c.addEventListener("change", recalculateBundle);
  });

  // Back to home trigger
  function showHome(e) {
    if (e) e.preventDefault();
    pdpView.classList.remove("active");
    homeView.style.display = "block";
    stickyBar.classList.remove("active");
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (backBtn) backBtn.addEventListener("click", showHome);
  if (logoTrigger) logoTrigger.addEventListener("click", showHome);

  // Link card clicks to open PDP template views
  document.querySelectorAll(".pdp-trigger").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(e.currentTarget.dataset.id);
      openPdp(id);
    });
  });

  // PDP Quantity selectors adjusters
  const minus = document.getElementById("pdp-qty-minus");
  const plus = document.getElementById("pdp-qty-plus");
  const val = document.getElementById("pdp-qty-input");

  if (minus && plus) {
    minus.addEventListener("click", () => {
      STATE.pdpQty = Math.max(STATE.pdpQty - 1, 1);
      val.value = STATE.pdpQty;
    });
    plus.addEventListener("click", () => {
      STATE.pdpQty += 1;
      val.value = STATE.pdpQty;
    });
  }

  // Main Add to Cart buttons
  const addBtn = document.getElementById("pdp-add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.addToCart(STATE.currentPdpId, STATE.pdpSize, STATE.pdpColor, STATE.pdpQty);
    });
  }

  const stickyAddBtn = document.getElementById("sticky-add-btn");
  if (stickyAddBtn) {
    stickyAddBtn.addEventListener("click", () => {
      window.addToCart(STATE.currentPdpId, STATE.pdpSize, STATE.pdpColor, STATE.pdpQty);
    });
  }

  // FBT Bundle Add trigger
  const bundleAddBtn = document.getElementById("pdp-bundle-add-btn");
  if (bundleAddBtn) {
    bundleAddBtn.addEventListener("click", () => {
      const mainProd = PRODUCTS[STATE.currentPdpId];
      // Add main product
      window.addToCart(STATE.currentPdpId, STATE.pdpSize, STATE.pdpColor, 1);

      // Add bundle lingerie set if checked
      if (document.getElementById("bundle-check-2").checked) {
        window.addToCart(2, "M", "Warm Caramel Sand", 1);
      }
      // Add bundle gift box if checked
      if (document.getElementById("bundle-check-3").checked) {
        window.addToCart(4, "O/S", "Deep Espresso", 1);
      }
    });
  }

  // Wishlist toggle directly on PDP
  const pdpWishlist = document.getElementById("pdp-wishlist-toggle");
  if (pdpWishlist) {
    pdpWishlist.addEventListener("click", () => {
      window.toggleWishlist(STATE.currentPdpId);
      // Toggle color state
      if (STATE.wishlist.has(STATE.currentPdpId)) {
        pdpWishlist.querySelector("svg").setAttribute("fill", "currentColor");
      } else {
        pdpWishlist.querySelector("svg").setAttribute("fill", "none");
      }
    });
  }

  // Sticky add to cart scroll show/hide
  window.addEventListener("scroll", () => {
    if (pdpView.classList.contains("active")) {
      if (window.scrollY > 400) {
        stickyBar.classList.add("active");
      } else {
        stickyBar.classList.remove("active");
      }
    }
  });

  // Fit modal toggling
  const fitModal = document.getElementById("fit-guide-modal");
  const fitTrigger = document.getElementById("pdp-fit-guide-trigger");
  const fitClose = document.getElementById("fit-guide-close");

  if (fitTrigger && fitModal) {
    fitTrigger.addEventListener("click", () => fitModal.classList.add("active"));
  }
  if (fitClose) {
    fitClose.addEventListener("click", () => fitModal.classList.remove("active"));
  }

  // Fit guide tab switching
  const tabs = document.querySelectorAll(".fit-guide-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      tabs.forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const target = e.target.dataset.target;

      document.getElementById("men-size").style.display = target === "men-size" ? "table" : "none";
      document.getElementById("women-size").style.display = target === "women-size" ? "table" : "none";
    });
  });

  // 360 view / gallery switcher buttons
  const btnGallery = document.getElementById("btn-view-gallery");
  const btn360 = document.getElementById("btn-view-360");
  const viewGallery = document.getElementById("pdp-image-view");
  const view360 = document.getElementById("pdp-360-view");

  if (btnGallery && btn360) {
    btnGallery.addEventListener("click", () => {
      btn360.classList.remove("active");
      btnGallery.classList.add("active");
      view360.classList.remove("active");
      viewGallery.style.display = "block";
    });

    btn360.addEventListener("click", () => {
      btnGallery.classList.remove("active");
      btn360.classList.add("active");
      viewGallery.style.display = "none";
      view360.classList.add("active");
    });
  }
}

// ==========================================================================
// INTERACTIVE 360 DEGREE SCRUBBER MODULE
// ==========================================================================
function setup360Viewer(imagesArray) {
  const canvas = document.getElementById("pdp-canvas-360");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const frameCount = imagesArray.length;

  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;

  // Preload images into memory
  const preloadedImages = [];
  let loadedCount = 0;

  imagesArray.forEach((src, idx) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === frameCount) {
        // Draw the first frame once loaded
        drawFrame(0);
      }
    };
    preloadedImages.push(img);
  });

  function drawFrame(index) {
    if (!preloadedImages[index]) return;

    // Fit canvas aspect ratio bounds dynamically
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const img = preloadedImages[index];

    // Calculate size scaling (contain image)
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }

  // Pointer drag/swiping events
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    canvas.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = "grab";
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    // Scrub sensitivity: change frame every 15px of horizontal drag
    const sensitivity = 20;

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1;
      currentFrame = (currentFrame + direction + frameCount) % frameCount;
      drawFrame(currentFrame);
      startX = e.clientX; // Reset drag anchor point
    }
  });

  // Touch device events support
  canvas.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  canvas.addEventListener("touchend", () => {
    isDragging = false;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 15;

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1;
      currentFrame = (currentFrame + direction + frameCount) % frameCount;
      drawFrame(currentFrame);
      startX = e.touches[0].clientX;
    }
  });

  // Recalculate dimensions and redraw canvas on window resize
  if (window.pdp360ResizeHandler) {
    window.removeEventListener("resize", window.pdp360ResizeHandler);
  }
  window.pdp360ResizeHandler = () => {
    if (canvas && canvas.offsetParent !== null) {
      drawFrame(currentFrame);
    }
  };
  window.addEventListener("resize", window.pdp360ResizeHandler);
}

// ==========================================================================
// SCROLL-REVEAL SLOW TRANSITIONS (Intersection Observer)
// ==========================================================================
function initScrollAnimations() {
  // 1. Core reveal triggers
  const reveals = document.querySelectorAll(".reveal-fade-up, .reveal-blur, .reveal-scale, .stagger-wrap");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Keep observing if you want repeat, but for luxury timing we trigger once
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12, // Reveal when 12% in viewport
    rootMargin: "0px 0px -50px 0px" // bottom offset
  });

  reveals.forEach(el => revealObserver.observe(el));

  // 2. Slow entrance transitions for Hero Content on page load
  setTimeout(() => {
    const heading = document.getElementById("hero-heading");
    const subtext = document.getElementById("hero-subtext");
    const ctas = document.getElementById("hero-cta-wrap");

    if (heading) {
      heading.style.opacity = "1";
      heading.style.transform = "translateY(0)";
      heading.style.transition = "opacity 1.5s var(--ease-luxury), transform 1.5s var(--ease-luxury)";
    }

    if (subtext) {
      setTimeout(() => {
        subtext.style.opacity = "0.9";
        subtext.style.transform = "translateY(0)";
        subtext.style.transition = "opacity 1.2s var(--ease-luxury), transform 1.2s var(--ease-luxury)";
      }, 300);
    }

    if (ctas) {
      setTimeout(() => {
        ctas.style.opacity = "1";
        ctas.style.transform = "translateY(0)";
        ctas.style.transition = "opacity 1s var(--ease-luxury), transform 1s var(--ease-luxury)";
      }, 550);
    }
  }, 100);
}

// ==========================================================================
// SCROLLTRIGGER LUXURY PARALLAX & REVEALS FOR OUR STORY
// ==========================================================================
function initStoryScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Parallax Scroll trigger for overlapping image wrappers
  const primaryWrap = document.querySelector(".primary-image-wrap");
  const secondaryWrap = document.querySelector(".secondary-image-wrap");

  if (primaryWrap && secondaryWrap) {
    // Primary wrapper shifts downwards as scroll progress increases
    gsap.fromTo(primaryWrap, {
      y: -30
    }, {
      y: 30,
      ease: "none",
      scrollTrigger: {
        trigger: "#brand-story",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2
      }
    });

    // Secondary wrapper shifts upwards as scroll progress increases
    gsap.fromTo(secondaryWrap, {
      y: 40
    }, {
      y: -45,
      ease: "none",
      scrollTrigger: {
        trigger: "#brand-story",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2
      }
    });
  }

  // Smooth staggered reveal sequence for editorial text content
  const textColumnElements = document.querySelectorAll(
    ".brand-story-content-column > *, .brand-story-text-wrap > *, .brand-story-signature > *"
  );

  if (textColumnElements.length) {
    gsap.fromTo(textColumnElements, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#brand-story",
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  }
}

// ==========================================================================
// SCROLL-DRIVEN HERO CANVAS ANIMATION CONTROLLER
// ==========================================================================
function initHeroScrollAnimation() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  // Set canvas dimension based on viewport and devicePixelRatio (Retina/DPI support)
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  // Enable high-quality image smoothing on the context
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const frameCount = 240;
  const currentFramePath = index => (
    `assets/images/hero-frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg?v=2`
  );

  // Preload frame images asynchronously in the background
  const images = [];
  const animationState = { frame: 0 };

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFramePath(i);
    images.push(img);
  }

  let lastRenderedImg = null;

  function render() {
    const frameIndex = animationState.frame;
    const activeImg = images[frameIndex];
    if (!activeImg) return;

    // Use backwards-searching fallback rendering to prevent blank canvas while loading
    if (activeImg.complete && activeImg.naturalWidth !== 0) {
      drawImg(activeImg);
      lastRenderedImg = activeImg;
    } else if (lastRenderedImg) {
      drawImg(lastRenderedImg);
    } else {
      let fallbackImg = null;
      // Search backwards
      for (let i = frameIndex; i >= 0; i--) {
        if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
          fallbackImg = images[i];
          break;
        }
      }
      // Search forwards fallback
      if (!fallbackImg) {
        for (let i = frameIndex; i < frameCount; i++) {
          if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
            fallbackImg = images[i];
            break;
          }
        }
      }
      if (fallbackImg) {
        drawImg(fallbackImg);
        lastRenderedImg = fallbackImg;
      }
    }
  }

  function drawImg(img) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const imgWidth = img.width || 1280;
    const imgHeight = img.height || 720;

    // Scale canvas frame using "cover" math to stretch and fill screen
    const scale = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);
    const x = (canvas.width - imgWidth * scale) / 2;
    const y = (canvas.height - imgHeight * scale) / 2;

    context.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
  }

  // Draw the initial frame once loaded
  images[0].onload = render;

  // Setup GSAP ScrollTrigger to lock the hero section and animate frames
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=150%", // Pinned viewport scroll length
        scrub: 0.5,    // Smooth framerate damping
        pin: true,
        invalidateOnRefresh: true,
        toggleClass: { targets: "body", className: "hero-active" }
      }
    });

    // Animate canvas frames from 0 to 239 over a timeline duration of 239 ticks
    tl.to(animationState, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
      duration: 239
    }, 0);

    // Fade out text overlay based on specific frames
    // Heading fades out quickly starting immediately and is completely gone by Frame 6 (the thread frame)
    tl.to("#hero-heading", {
      opacity: 0,
      y: -50,
      ease: "power1.out",
      duration: 6
    }, 0);

    // Secondary heading emerges on the right side as bra rotates/shifts to the left
    tl.to("#hero-secondary-heading", {
      opacity: 1,
      scale: 0.9,
      x: 0,
      ease: "none",
      duration: 34
    }, 106);

    // Secondary heading fades out a bit later (by Frame 160)
    tl.to("#hero-secondary-heading", {
      opacity: 0,
      y: -40,
      ease: "power1.out",
      duration: 20
    }, 140);

    // Final message emerges 20 frames before the end (Frame 220 to 240)
    tl.to("#hero-final-message", {
      opacity: 1,
      y: 0,
      ease: "power1.out",
      duration: 20
    }, 220);
  }

  // Listen to window size update events
  window.addEventListener("resize", () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Resizing resets canvas context state, so re-enable smoothing
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    render();
  });
}

// ==========================================================================
// MOBILE AUTO-SCROLL CAROUSEL FOR PREMIUM CRAFTSMANSHIP
// ==========================================================================
function initCraftsmanshipCarousel() {
  const grid = document.querySelector(".editorial-grid");
  if (!grid) return;

  let intervalId = null;
  let currentCardIndex = 0;

  function getCards() {
    return grid.querySelectorAll(".editorial-card");
  }

  function startAutoScroll() {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      // Only auto-scroll on mobile views
      if (window.innerWidth > 768) return;

      const cards = getCards();
      if (cards.length <= 1) return;

      currentCardIndex = (currentCardIndex + 1) % cards.length;

      const card = cards[currentCardIndex];
      const gridWidth = grid.clientWidth;
      const cardWidth = card.clientWidth;
      const cardLeft = card.offsetLeft;

      // Calculate scroll value to center the card inside the container
      const scrollPosition = cardLeft - (gridWidth / 2) + (cardWidth / 2);

      grid.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
    }, 4000);
  }

  function stopAutoScroll() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  let touchTimeout = null;

  // Pause auto-scroll on manual touch events
  grid.addEventListener("touchstart", () => {
    stopAutoScroll();
  }, { passive: true });

  // Resume auto-scroll after manual swipes conclude
  grid.addEventListener("touchend", () => {
    if (touchTimeout) clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      const cards = getCards();
      const gridCenter = grid.scrollLeft + (grid.clientWidth / 2);

      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + (card.clientWidth / 2);
        const distance = Math.abs(gridCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      currentCardIndex = closestIndex;
      startAutoScroll();
    }, 3000);
  });

  // Start initialization
  startAutoScroll();

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      stopAutoScroll();
    } else if (!intervalId) {
      startAutoScroll();
    }
  });
}

// ==========================================================================
// COLOR SWATCH ACTIONS FOR BEST SELLERS
// ==========================================================================
function initCardSwatches() {
  document.querySelectorAll(".product-swatch").forEach(swatch => {
    swatch.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = swatch.closest(".product-card");
      if (!card) return;

      const img = card.querySelector(".product-img");
      const swatches = card.querySelectorAll(".product-swatch");

      // Set active visual state
      swatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");

      // Switch product image smoothly
      const idx = parseInt(swatch.dataset.index);
      const prodId = parseInt(card.dataset.productId);
      const prod = PRODUCTS[prodId];

      if (img && prod && prod.images && prod.images[idx]) {
        img.style.opacity = 0.3;
        setTimeout(() => {
          img.src = prod.images[idx];
          img.dataset.imgIndex = idx; // SYNC INDEX FOR CAROUSEL ARROWS
          img.style.opacity = 1;
        }, 120);
      }
    });
  });
}


// ==========================================================================
// BEST SELLERS SECTION PRODUCTS GRID CAROUSEL
// ==========================================================================
function initProductsCarousel() {
  const container = document.getElementById("best-sellers-carousel-wrap");
  const grid = container ? container.querySelector(".products-grid") : null;
  const cards = container ? container.querySelectorAll(".product-card") : [];
  const prevBtn = document.getElementById("best-sellers-prev");
  const nextBtn = document.getElementById("best-sellers-next");

  if (!container || !grid || cards.length === 0) return;

  // The carousel only activates if there are more than 5 products
  if (cards.length > 5) {
    container.classList.add("carousel-mode");
    grid.classList.add("carousel-mode");

    let currentSlide = 0;

    // On desktop, 4 cards are visible at a time. The slider can move cards.length - 4 steps.
    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1; // mobile uses native swiping
      if (window.innerWidth <= 1024) return 2; // tablet has 2 columns
      return 4; // desktop has 4 columns
    }

    function getMaxSlides() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function updateNav() {
      const maxSlides = getMaxSlides();
      if (window.innerWidth <= 768) {
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        return;
      }

      if (prevBtn) {
        prevBtn.style.display = "flex";
        prevBtn.style.opacity = currentSlide === 0 ? "0.3" : "1";
        prevBtn.style.pointerEvents = currentSlide === 0 ? "none" : "auto";
      }
      if (nextBtn) {
        nextBtn.style.display = "flex";
        nextBtn.style.opacity = currentSlide >= maxSlides ? "0.3" : "1";
        nextBtn.style.pointerEvents = currentSlide >= maxSlides ? "none" : "auto";
      }
    }

    function slideTo(index) {
      const maxSlides = getMaxSlides();
      if (index < 0) index = 0;
      if (index > maxSlides) index = maxSlides;

      currentSlide = index;

      if (window.innerWidth <= 768) {
        grid.style.transform = "none";
        updateNav();
        return;
      }

      // Calculate translate width of single card + gap dynamically
      const cardWidth = cards[0].getBoundingClientRect().width;
      const computedStyle = window.getComputedStyle(grid);
      const gap = parseFloat(computedStyle.gap) || 40;
      const translateAmt = currentSlide * (cardWidth + gap);

      grid.style.transform = `translateX(-${translateAmt}px)`;
      updateNav();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        slideTo(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        slideTo(currentSlide + 1);
      });
    }

    // Set layout dynamically on resize and page load
    window.addEventListener("resize", () => {
      slideTo(currentSlide);
    });

    // Initialize state
    setTimeout(() => slideTo(0), 100);
  } else {
    // Hide navigation arrows if there are 5 or fewer products
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
  }
}

// ==========================================================================
// LUXURY SECTION REVEAL ANIMATIONS
// ==========================================================================
function initSectionFades() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const revealSections = [
    { id: "#best-sellers", triggerOffset: "top 90%" },
    { id: "#values", triggerOffset: "top 85%" },
    { id: "#fabric-tech", triggerOffset: "top 85%" },
    { id: "#collections", triggerOffset: "top 85%" },
    { id: "#editorial", triggerOffset: "top 85%" },
    { id: "#reviews", triggerOffset: "top 85%" },
    { id: "#instagram", triggerOffset: "top 85%" },
    { id: "#brand-story", triggerOffset: "top 85%" },
    { id: "#faq", triggerOffset: "top 85%" },
    { id: "#newsletter", triggerOffset: "top 90%" },
    { id: "footer", triggerOffset: "top 95%" }
  ];

  revealSections.forEach(secConfig => {
    const sec = document.querySelector(secConfig.id);
    if (!sec) return;

    // Target the inner container layout wrap instead of section parent to prevent stacking contexts
    const target = sec.querySelector(".container, .container-fluid, .brand-story-grid, .footer-grid") || sec;

    // Set initial clean hidden state
    gsap.set(target, {
      opacity: 0,
      y: 45
    });

    // Clean scroll-triggered fade up transition
    gsap.to(target, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sec,
        start: secConfig.triggerOffset,
        toggleActions: "play none none none"
      }
    });
  });
}



