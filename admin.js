/* PROTECT PAGE */
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }

    loadOrders(); // ✅ IMPORTANT FIX
});

const ordersContainer = document.getElementById("orders");

/* LOAD ORDERS REALTIME */
function loadOrders() {

    db.collection("orders")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {

            ordersContainer.innerHTML = "";

            snapshot.forEach((doc) => {

                const order = doc.data();

                let itemsHTML = "";

                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach((item) => {
                        itemsHTML += `
                            <div class="item">
                                ${item.name} | Size: ${item.size} | Qty: ${item.quantity}
                            </div>
                        `;
                    });
                }

                const status = order.status || "pending";

                ordersContainer.innerHTML += `
                    <div class="order">

                        <h3>
                            Order ID:
                            <span class="badge">${doc.id}</span>
                        </h3>

                        <p><b>Name:</b> ${order.name || ""}</p>
                        <p><b>Phone:</b> ${order.phone || ""}</p>
                        <p><b>bKash TRX ID:</b> ${order.trxId || ""}</p>
                        <p><b>Address:</b> ${order.address || ""}</p>
                        <p><b>Total:</b> $${order.total || 0}</p>

                        <p>
                            <b>Status:</b>
                            <span class="status ${status}">
                                ${status}
                            </span>
                        </p>

                        <div class="items">
                            ${itemsHTML}
                        </div>

                        <div class="status-buttons">

                            <button onclick="updateStatus('${doc.id}', 'pending')">
                                Pending
                            </button>

                            <button onclick="updateStatus('${doc.id}', 'shipped')">
                                Shipped
                            </button>

                            <button onclick="updateStatus('${doc.id}', 'delivered')">
                                Delivered
                            </button>

                        </div>

                    </div>
                `;
            });
        });
}

/* UPDATE STATUS */
async function updateStatus(orderId, newStatus) {

    try {

        await db.collection("orders")
            .doc(orderId)
            .update({
                status: newStatus
            });

    } catch (error) {
        console.error(error);
        alert("Failed to update status.");
    }
}

/* LOGOUT */
function logout() {
    auth.signOut().then(() => {
        window.location.href = "admin-login.html";
    });
}
