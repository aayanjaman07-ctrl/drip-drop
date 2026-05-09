let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const cartItems =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <img src="${item.image}">

                <div>

                    <h3>${item.name}</h3>

                    <p>Size: ${item.size}</p>

                    <p>$${item.price}</p>

                    <p>Qty: ${item.quantity}</p>

                </div>

                <button onclick="removeItem(${index})">

                    Remove
                </button>

            </div>
        `;
    });

    cartTotal.innerText =
        `Total: $${total}`;
}

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}

function openCheckout(event) {

    if (event) {
        event.preventDefault();
    }

    document.getElementById("checkout-modal")
        .style.display = "flex";

    document.getElementById("checkout-modal")
        .style.opacity = "1";
}

function closeCheckout() {

    const modal =
        document.getElementById("checkout-modal");

    modal.style.opacity = "0";

    setTimeout(() => {
        modal.style.display = "none";
    }, 200);
}

renderCart();

/* PLACE ORDER */

async function placeOrder() {

    /* CUSTOMER INFO */

    const name =
        document.getElementById("customer-name").value;

    const email =
        document.getElementById("customer-email").value;

    const address =
        document.getElementById("customer-address").value;

    const phone =
        document.getElementById("customer-phone").value;

    const trxId =
        document.getElementById("bkash-trx").value;

    /* VALIDATION */

    if (
        !name ||
        !email ||
        !address ||
        !phone ||
        !trxId
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }

    /* TOTAL */

    let total = 0;

    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;
    });

    /* ORDER NUMBER */

    const orderNumber =
          "DD-" +
        Date.now();

    /* ORDER OBJECT */

    const orderData = {

        orderId:
            orderNumber,

        name,
        email,
        address,
        phone,

        trxId,

        items:
            cart,

        total,

        status: "pending",

        createdAt:
            firebase.firestore.FieldValue.serverTimestamp()
    };

    try {

        /* SAVE TO FIRESTORE */

        await db.collection("orders")
            .doc(orderNumber)
            .set(orderData);

        /* SHOW ORDER ID */

        document.getElementById("order-id")
            .innerText =
            `Order ID: ${orderNumber}`;

        /* CLOSE CHECKOUT */

        document.getElementById("checkout-modal")
            .style.display = "none";

        /* SHOW SUCCESS */

        document.getElementById("order-success")
            .style.display = "flex";

        /* CLEAR CART */

        localStorage.removeItem("cart");

        cart = [];

        renderCart();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to place order."
        );
    }
}

/* CLOSE SUCCESS */

function closeSuccess() {

    document.getElementById("order-success")
        .style.display = "none";

    window.location.href = "product.html";
}
