import { menuArray } from "./data.js";

let orderItems = [];

document.addEventListener("click", function(e) {
    if (e.target.dataset.id) {
        handleOrder(e.target.dataset.id);
    } else if (e.target.classList.contains('remove-btn')) {
        handleRemoveItem(e.target.dataset.removeId);
    } else if (e.target.id === 'purchase-btn') {
        handlePurchase();
    }
});

const modalCloseBtn = document.getElementById("modal-close-btn")
modalCloseBtn.addEventListener('click', function(){
    modal.style.display = 'none'
})

function handleOrder(itemId) {
    const menuItem = menuArray.filter(function(item) {
        return itemId == item.id
    })[0]
    
    const existingItem = orderItems.filter(function(item) {
        return itemId == item.id
    })[0]

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        
        orderItems.push({
            ...menuItem,
            quantity: 1
        });
    }

    document.getElementById("order").classList.remove('hidden');
    updateOrder();
}

function handleRemoveItem(itemId) {
    
    let itemIndex = -1;
    for (let i = 0; i < orderItems.length; i++) {
        if (orderItems[i].id == itemId) {
            itemIndex = i;
            break; 
        }
    }
    if (itemIndex > -1) {
        if (orderItems[itemIndex].quantity > 1) {
            orderItems[itemIndex].quantity -= 1;
        } else {
            orderItems.splice(itemIndex, 1);
        }
        
        if (orderItems.length === 0) {
            document.getElementById("order").classList.add('hidden');
        } else {
            updateOrder();
        }
    }
}

function handlePurchase() {
    if (orderItems.length === 0) return;
    const total = calculateTotal();
    
    modal.style.display = 'block'

    orderItems = [];
    document.getElementById("order").classList.add('hidden');
}

function calculateTotal() {
    return orderItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateOrder() {
    const orderInner = document.getElementById("order-inner");

    let orderHTML = '';
    
    orderItems.forEach(item => {
        orderHTML += `
            <div class="preview">
                <div class="preview-name">
                    <span class="preview-item-name">${item.name}</span>
                    ${item.quantity > 1 ? `<span class="quantity"> X ${item.quantity}</span>` : ''}
                    <button class="remove-btn" data-remove-id="${item.id}">remove</button>
                </div>
                <div class="preview-price">$${item.price * item.quantity}</div>
            </div>
        `;
    });
    
    const total = calculateTotal();
    orderHTML += `
        <div class="total-section">
            <div class="total-line">
                <span class="total-label">Total price:</span>
                <span class="total-amount">$${total}</span>
            </div>
        </div>
    `;
    
    orderInner.innerHTML = orderHTML;
}

function menuRender() {
    let menu = '';
    menuArray.forEach(function(order) {
        menu += `
            <div class="menuItems">
                <div class="inner">
                    <div class="emoji-display">${order.emoji}</div>       
                    <div class="desc">
                        <div class="text">
                            <p class="name">${order.name}</p>
                            <p class="ingred">${order.ingredients.join(', ')}</p>
                            <p class="price">$${order.price}</p>
                        </div>
                    </div>
                    <button class="add-btn" data-id="${order.id}">+</button>
                </div> 
                <br>
            </div>
        `;
    });
    return menu;
}

function render() {
    document.getElementById("menu").innerHTML = menuRender();
}

render();