let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let Products = JSON.parse(localStorage.getItem('productsInCart')) || [];
let amounts = JSON.parse(localStorage.getItem('amounts')) || [];
let elemntlist = JSON.parse(localStorage.getItem('CartList')) || [];
let count = parseInt(localStorage.getItem('CartCount')) || 0;
let user = document.querySelector('.nameOfuser');
const navLogin = document.querySelector('.nav-login');
const cartcoun = document.querySelector('.cart-count');
const logoutbtn = document.querySelector('.btn-logout');
const parent = document.querySelector('.parent');
const totalPrice = document.querySelector('.total-amount');
let price = document.querySelector('.cart-total');
const container = document.querySelector('.container');
let sum = 0;
user.textContent = `${currentUser.firstname}`;
cartcoun.innerHTML = count;

function showEmptyCart() 
{
    if(document.querySelector('.empty-cart')) return; // already shown
    parent.innerHTML = "";  
    if (price) price.remove();    
    let warningMessage = document.createElement('p');
    warningMessage.classList.add('empty-cart');
    warningMessage.textContent = "Your cart is empty, add some products ^^";
    warningMessage.style.display = 'flex';
    warningMessage.style.justifyContent = 'center';
    warningMessage.style.textAlign = 'center';
    warningMessage.style.alignItems = 'center';
    warningMessage.style.fontSize = '30px';
    warningMessage.style.fontWeight = 'bold';
    warningMessage.style.marginTop = '200px';
    warningMessage.style.color = '#19B4FD';
    container.appendChild(warningMessage);
}

function updateCartPage(product)
{
    if (!Products || Products.length === 0)
    {
        showEmptyCart();
        return;
    }
    else
    {
        let amount = 1;
        amounts.forEach(ele => {
            if(ele.index === product.id)
            {
                amount = ele.amount;
            }
        });
        let item = document.createElement('div');
        item.classList.add('col');
        item.innerHTML = `
        <div class="cart-items">
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${product.img}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body" data-set="${product.id}">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text cate">Category : ${product.category}</p>
                        <p class="card-text price">Price : $${product.price}</p>
                        <div class="control d-flex justify-content-between align-items-center">
                            <div class="amount">
                                <i class="bi bi-file-minus"></i>
                                <i class="bi bi-file-minus-fill"></i>
                                <span class="item-amount">${amount}</span>
                                <i class="bi bi-file-plus"></i>
                                <i class="bi bi-file-plus-fill"></i>
                            </div>
                            <button class="btn remove-item">Remove from cart</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`;
        parent.appendChild(item);
        changeCartamount();
        item.querySelector('.remove-item').addEventListener('click', function () {
            removeProduct(item);
        });
    }
}

function saveCartAmounts() {
    let newAmounts = elemntlist.map(ele => {
        let cardBody = document.querySelector(`.card-body[data-set='${ele.id}']`);
        let amount = cardBody ? parseInt(cardBody.querySelector('.item-amount').innerText) : 0;
        return {
            index: ele.index,
            id: ele.id,
            amount: amount
        };
    });

    newAmounts = newAmounts.filter(item => item.amount > 0);

    localStorage.setItem('amounts', JSON.stringify(newAmounts));

    let newTotalCount = newAmounts.reduce((total, item) => total + item.amount, 0);
    localStorage.setItem('CartCount', newTotalCount);
    cartcoun.innerHTML = newTotalCount;
}

function changeCartamount() {
    let listProducts = document.querySelectorAll('.col');

    listProducts.forEach((pro) => {
        let minusBtn = pro.querySelector('.bi-file-minus');
        let plusBtn  = pro.querySelector('.bi-file-plus');
        let amountElem = pro.querySelector('.item-amount');

        const id = pro.querySelector(".card-body").dataset.set;
        const title = pro.querySelector(".card-title").innerText;

        // Clean old events
        minusBtn.replaceWith(minusBtn = minusBtn.cloneNode(true));
        plusBtn.replaceWith(plusBtn = plusBtn.cloneNode(true));

        minusBtn.addEventListener("click", () => {
            let currentAmount = parseInt(amountElem.innerText);

            if (currentAmount > 1) {
                currentAmount--;
                amountElem.innerText = currentAmount;
            } 
            else {
                pro.remove();
                elemntlist = elemntlist.filter(e => e.id != id);
                Products = Products.filter(p => p.name !== title);

                localStorage.setItem("CartList", JSON.stringify(elemntlist));
                localStorage.setItem("productsInCart", JSON.stringify(Products));
            }
            saveCartAmounts();
            if (!Products || Products.length === 0) {
                showEmptyCart();
            }

            calcPrice(); 
        });

        plusBtn.addEventListener("click", () => {
            let currentAmount = parseInt(amountElem.innerText) + 1;
            amountElem.innerText = currentAmount;
            saveCartAmounts();
            calcPrice(); 
        });
    });
}

function calcPrice()
{
    if(parseInt(localStorage.getItem('CartCount'))  === 0)
    {
        showEmptyCart();
        return;
    }
    let sum = 0; 
    let Prods = document.querySelectorAll('.col');
    Prods.forEach(pro => {
        let price = pro.querySelector('.price').innerText.replace('Price : $', '');
        let amount = pro.querySelector('.item-amount').innerText;
        sum += (parseInt(price) * parseInt(amount));
    });
    totalPrice.innerText = sum;
}

function logoutUser() {
    const confirmBtn = document.querySelector('.confirm');
    const cancelBtn = document.querySelector('.cancel');

    if (!confirmBtn || !cancelBtn) {
        console.warn("Confirm or Cancel button not found");
        return;
    }

    confirmBtn.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('CartList');
        localStorage.removeItem('productsInCart');
        localStorage.removeItem('amounts');
        localStorage.removeItem('CartCount');
        window.location.href = 'index.html';
    }, { once: true }); 

    cancelBtn.addEventListener('click', function(event) {
        event.preventDefault();
    }, { once: true });
}

function changeCartCount() {
    let sum = 0;
    let amounts = document.querySelectorAll('.item-amount');
    amounts.forEach(ele => {
        sum += parseInt(ele.innerText);
    });

    cartcoun.innerHTML = sum;
    localStorage.setItem('CartCount', sum);
}

function removeProduct(pro)
{
    const productIndex = parseInt(pro.querySelector(".card-body").dataset.set);
    const title = pro.querySelector(".card-title").innerText;
    pro.remove();
    elemntlist = elemntlist.filter(e => e.index !== productIndex); 
    Products = Products.filter(p => p.name !== title);
    localStorage.setItem("CartList", JSON.stringify(elemntlist));
    localStorage.setItem("productsInCart", JSON.stringify(Products));
    saveCartAmounts();
    calcPrice();
    if (!Products || Products.length === 0) {
        showEmptyCart();
    }
}

logoutbtn.addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

parent.innerHTML = "";
Products.forEach(element => updateCartPage(element));
changeCartCount();
calcPrice();


