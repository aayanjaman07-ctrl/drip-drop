// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effects for products
document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('mouseenter', () => {
        product.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    product.addEventListener('mouseleave', () => {
        product.style.transform = 'translateY(0) scale(1)';
    });
});

// Mobile menu toggle (if needed in future)
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Add loading animation for images
document.querySelectorAll('img').forEach((img, index) => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
        img.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s both`;
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s';
});

// Staggered animation for products
document.querySelectorAll('.product').forEach((product, index) => {
    product.style.animationDelay = `${index * 0.2}s`;
});

// Scroll-triggered animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add animate-on-scroll class to sections in CSS or here
document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
});

/* =========================
   PRODUCT MODAL SYSTEM
========================= */

let products = [];

let currentProduct = null;

/* Load products from JSON */

fetch("products.json")
    .then(response => response.json())
    .then(data => {

        products = data;

        console.log("Products loaded");
    })

    .catch(error => {
        console.error("Error loading products:", error);
    });

/* Open Product Modal */

function openProduct(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;
    currentProduct = product;

    /* Product Info */

    document.getElementById("product-name")
        .innerText = product.name;

    document.getElementById("product-price")
        .innerText = `$${product.price}`;

    document.getElementById("product-description")
        .innerText = product.description;

    /* Main Image */

    const mainImage =
        document.getElementById("main-image");

    mainImage.src = product.images[0];

    /* Animate image */

    mainImage.style.opacity = "0";

    setTimeout(() => {

        mainImage.style.opacity = "1";

    }, 100);

    /* Sizes */

    const sizesContainer =
        document.getElementById("sizes");

    sizesContainer.innerHTML = "";

    product.sizes.forEach((size, index) => {

        const sizeButton = document.createElement("button");

        sizeButton.classList.add("size-btn");

        sizeButton.innerText = size;

        sizeButton.style.animation =
            `slideInUp 0.4s ease ${index * 0.1}s both`;

        sizeButton.addEventListener("click", () => {

            document.querySelectorAll(".size-btn")
                .forEach(btn => btn.classList.remove("active"));

            sizeButton.classList.add("active");
        });

        sizesContainer.appendChild(sizeButton);
    });

    /* Thumbnails */

    const thumbnailContainer =
        document.getElementById("thumbnail-container");

    thumbnailContainer.innerHTML = "";

    product.images.forEach((image, index) => {

        const thumb = document.createElement("img");

        thumb.src = image;

        thumb.classList.add("thumbnail");

        thumb.style.animation =
            `fadeIn 0.5s ease ${index * 0.12}s both`;

        thumb.addEventListener("click", () => {

            changeImage(image);
        });

        thumbnailContainer.appendChild(thumb);
    });

    /* Show modal */

    const modal =
        document.getElementById("product-modal");

    modal.style.display = "flex";

    document.body.style.overflow = "hidden";

    /* Smooth appearance */

    setTimeout(() => {

        modal.style.opacity = "1";

    }, 10);
}

/* Close Modal */

function closeModal() {

    const modal =
        document.getElementById("product-modal");

    modal.style.opacity = "0";

    setTimeout(() => {

        modal.style.display = "none";

        document.body.style.overflow = "auto";

    }, 300);
}

/* Change Main Image */

function changeImage(image) {

    const mainImage =
        document.getElementById("main-image");

    mainImage.style.opacity = "0";

    mainImage.style.transform = "scale(0.96)";

    setTimeout(() => {

        mainImage.src = image;

        mainImage.style.opacity = "1";

        mainImage.style.transform = "scale(1)";

    }, 200);
}

/* Close when clicking outside */

window.addEventListener("click", (e) => {

    const modal =
        document.getElementById("product-modal");

    if (e.target === modal) {

        closeModal();
    }
});

/* ESC key closes modal */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeModal();
    }
});

/* =========================
   CART SYSTEM
========================= */

function addToCart() {

    if (!currentProduct) return;

    const selectedSize =
        document.querySelector(".size-btn.active");

    if (!selectedSize) {

        alert("Please select a size.");

        return;
    }

    const size = selectedSize.innerText;

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item =>

        item.id === currentProduct.id &&
        item.size === size
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: currentProduct.id,

            name: currentProduct.name,

            price: currentProduct.price,

            image: currentProduct.images[0],

            size: size,

            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    /* PLAY PREMIUM SOUND */

document
    .getElementById("cart-sound")
    .play();

/* SHOW PREMIUM TOAST */

const toast =
    document.getElementById("cart-toast");

toast.innerText =
    `✓ ${currentProduct.name} added to cart`;

toast.classList.add("show");

/* HIDE TOAST */

setTimeout(() => {

    toast.classList.remove("show");

}, 3000);
}

/* CART COUNT */

function updateCartCount() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;
    });

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {

        cartCount.innerText = total;
    }
}

updateCartCount();

function toggleMenu() {

    const navLinks = document.getElementById("navLinks");
    const hamburger = document.querySelector(".hamburger");

    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".nav-links").classList.remove("active");
        document.querySelector(".hamburger").classList.remove("active");
    });
});
