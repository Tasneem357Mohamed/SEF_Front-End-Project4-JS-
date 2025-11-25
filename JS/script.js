let currentUser = JSON.parse(localStorage.getItem('currentUser'));
const navLogin = document.querySelector('.nav-login');
const navHome = document.querySelector('.nav-home');
const section = document.querySelector('.sec1');
const cards = section.querySelectorAll('.product');
let typeofsearch = 'search by product name';
const regbtn = document.querySelector('.btn-reg');
const loginbtn = document.querySelector('.btn-login');
const dropdownItems = document.querySelectorAll('.item-search');
const searchbtn = document.getElementById('search-btn');
const logoutbtn = document.querySelector('.btn-logout');
const addcartbtns = document.querySelectorAll('.addcart');
const addheartbtns = document.querySelectorAll('.addheart');
const fillheart = document.querySelectorAll('.fill');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const controlSplus = document.querySelectorAll('.bi-file-plus'); 
const controlSminus = document.querySelectorAll('.bi-file-minus');
const parent = document.querySelector('.items-container');
let counter = 3;
let amounts = JSON.parse(localStorage.getItem('amounts')) || [];
let elemntCart = JSON.parse(localStorage.getItem('CartList')) || [];
let Cartproducts = JSON.parse(localStorage.getItem('productsInCart')) || [];
let Favproducts = JSON.parse(localStorage.getItem('Favproducts')) || [];
let storedCartCount = JSON.parse(localStorage.getItem('CartCount'));


if (storedCartCount !== null) {
    cartCount.textContent = storedCartCount;
} else {
    cartCount.textContent = 0;
}

dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        typeofsearch = this.dataset.value; 
        document.getElementById('dropdownMenuButton1').innerText = typeofsearch; 
    });
});

regbtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "register.html";
});

loginbtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "login.html";
});

function showNav()
{
    if(currentUser !== null) 
    {
        navLogin.style.display = 'block';
        navHome.style.display = 'none';
        let user = document.querySelector('.nameOfuser');
        user.textContent = `${currentUser.firstname}`;
    }
    else
    {
        navLogin.style.display = 'none';
        navHome.style.display = 'block';
    }
}

function restoreCart() 
{
    Cartproducts.forEach(item => {
        let id = item.id + 1;
        const btn = [...addcartbtns].find(h => h.dataset.value == id);
        if (btn) 
        {
            btn.innerText = 'Remove from cart';
        }
    });
}

function inverserestoreCart() 
{
    Cartproducts.forEach(item => {
        let id = item.id + 1;
        const btn = [...addcartbtns].find(h => h.dataset.value == id);
        if (btn) 
        {
            btn.innerText = 'Add to cart';
        }
    });
}

function restoreFavHearts() 
{
    Favproducts.forEach(item => {
        let id = item.id + 1;
        const emptyHeart = [...addheartbtns].find(h => h.dataset.value == id);
        const filledHeart = [...fillheart].find(f => f.dataset.value == id);
        if (emptyHeart && filledHeart) {
            emptyHeart.style.display = "none";
            filledHeart.style.display = "inline-block";
        }
    });
}


function saveCartAmounts() {
    let newAmounts = elemntCart.map(ele => {
        let cardBody = document.querySelector(`.cart-item .card-body[data-set='${ele.id}']`);
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
    localStorage.setItem('CartCount', JSON.stringify(newTotalCount));
}

function changeCartListamount() {
    let listProducts = document.querySelectorAll('.cart-item');

    listProducts.forEach((pro) => {
        let minusBtn = pro.querySelector('.bi-file-minus');
        let plusBtn  = pro.querySelector('.bi-file-plus');
        let amountElem = pro.querySelector('.item-amount');
        const productDataSetId = pro.querySelector(".card-body").dataset.set;
        const productTitle = pro.querySelector(".card-title").innerText;

        if (!minusBtn || !plusBtn || !amountElem) return;
        const cloneMinus = minusBtn.cloneNode(true);
        minusBtn.parentNode.replaceChild(cloneMinus, minusBtn);
        minusBtn = cloneMinus;

        const clonePlus = plusBtn.cloneNode(true);
        plusBtn.parentNode.replaceChild(clonePlus, plusBtn);
        plusBtn = clonePlus;

        minusBtn.addEventListener("click", () => {
            let currentAmount = parseInt(amountElem.innerText);
            if (currentAmount > 0) {
                currentAmount--;
                amountElem.innerText = currentAmount;
                cartCount.innerText = parseInt(cartCount.innerText) - 1;
            }
            if (currentAmount === 0) 
            {
                pro.remove();
                elemntCart = elemntCart.filter(i => i.id !== parseInt(productDataSetId));
                Cartproducts = Cartproducts.filter(i => i.name !== productTitle);
                localStorage.setItem('CartList' , JSON.stringify(elemntCart));
                localStorage.setItem('productsInCart', JSON.stringify(Cartproducts));
                counter += 1;
                const cartBtn = [...addcartbtns].find(b => {
                    let card = cards[b.dataset.value - 1];
                    return card.querySelector('.card-title').innerText === productTitle;
                });
                if (cartBtn) cartBtn.innerText = 'Add to cart'; 
            }
            saveCartAmounts(); 
        });


        plusBtn.addEventListener('click', () => {
            let currentAmount = parseInt(amountElem.innerText) + 1;
            amountElem.innerText = currentAmount;
            cartCount.innerText = parseInt(cartCount.innerText) + 1;
            saveCartAmounts(); 
        });
    });
}

function updatecartList(product , id)
{
    let item = document.createElement('div');
    item.classList.add('card', 'mb-3', 'cart-item');
    item.innerHTML = `
    <div class="card-body d-flex flex-column gap-1 align-items-center m-auto text-center" data-set = '${id}'>
        <div class="card-info d-flex flex-column flex-wrap">
            <h5 class="card-title">${product.querySelector('.card-title').innerText}</h5>
            <p class="card-text price">${product.querySelector('.price').innerText}</p>
        </div>
        <div class="amount justify-content-between align-items-center">
            <i class="bi bi-file-minus"></i>
            <i class="bi bi-file-minus-fill"></i>
            <span class="item-amount">1</span>
            <i class="bi bi-file-plus"></i>
            <i class="bi bi-file-plus-fill"></i>
        </div>
    </div>`;
    parent.appendChild(item);
}

function addToCart(id) {
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    let product = cards[id - 1];
    if (Cartproducts.findIndex(p => p.name === product.querySelector('.card-title').innerText) === -1 || Cartproducts.length === 0) 
    {
        if (counter !== 0) 
        {
            const newProductId = (3 - counter);
            
            updatecartList(product, newProductId);
            let ele = 
            {
                index: (id - 1),
                id: newProductId
            };
            elemntCart.push(ele);
            localStorage.setItem('CartList' , JSON.stringify(elemntCart));
            counter -= 1;
            changeCartListamount(); 
        }
        const item = 
        {
            id : (id - 1),
            img: product.querySelector('.card-img-top').src,
            name: product.querySelector('.card-title').innerText,
            price: product.querySelector('.price').innerText.replace('Price : $', ''),
            category: product.querySelector('.category').innerText.replace('category : ', '')
        };
        Cartproducts.push(item);
        localStorage.setItem('productsInCart', JSON.stringify(Cartproducts));
        cartCount.textContent = parseInt(cartCount.textContent) + 1;
        localStorage.setItem('CartCount', JSON.stringify(parseInt(cartCount.textContent)));
        saveCartAmounts(); 

        alert('Product added to cart successfully!');
    }
}

function addToFav(id)
{
    if(currentUser == null) 
    {
        window.location.href = "login.html";
        return;
    }
    let product = cards[id - 1];
    if (Favproducts.findIndex(p => p.name === product.querySelector('.card-title').innerText) === -1 || Favproducts.length === 0) 
    {
        const item = 
        {
            id : (id - 1),
            img: product.querySelector('.card-img-top').src,
            name: product.querySelector('.card-title').innerText,
            category: product.querySelector('.category').innerText.replace('category : ', '')
        };
        Favproducts.push(item);
        localStorage.setItem('Favproducts', JSON.stringify(Favproducts));
        const emptyHeart = [...addheartbtns].find(h => h.dataset.value == id);
        const filledHeart = [...fillheart].find(f => f.dataset.value == id);
        if (!emptyHeart || !filledHeart) {
            console.warn("Heart not found for id:", id);
            return;
        }
        emptyHeart.style.display = "none";
        filledHeart.style.display = "inline-block";
    }
    else
    {
        return;
    }
}

function removefromcart(id) {
    const productIndex = id - 1;
    const element = elemntCart.find(ele => ele.index === productIndex);
    if (!element) return;
    const amountItem = amounts.find(a => a.index === productIndex);
    const removedQuantity = amountItem ? amountItem.amount : 1;
    const cartItem = document.querySelector(`.cart-item .card-body[data-set='${element.id}']`);
    if (cartItem) cartItem.parentElement.remove();
    elemntCart = elemntCart.filter(i => i.index !== productIndex);
    Cartproducts = Cartproducts.filter(i => i.id !== productIndex);
    amounts = amounts.filter(i => i.index !== productIndex); 

    localStorage.setItem('CartList', JSON.stringify(elemntCart));
    localStorage.setItem('productsInCart', JSON.stringify(Cartproducts));
    localStorage.setItem('amounts', JSON.stringify(amounts));
    const btn = [...addcartbtns].find(b => b.dataset.value == id);
    if (btn) btn.innerText = "Add to cart";
    saveCartAmounts();
    cartCount.textContent = JSON.parse(localStorage.getItem('CartCount')) || 0;
    counter += 1;
}

function removefromFav(id)
{
    Favproducts = Favproducts.filter(fav => fav.id !== (id - 1));
    localStorage.setItem('Favproducts', JSON.stringify(Favproducts));
    const emptyHeart = [...addheartbtns].find(h => h.dataset.value == id);
    const filledHeart = [...fillheart].find(f => f.dataset.value == id);
    if (!emptyHeart || !filledHeart) {
        console.warn("Heart not found for id:", id);
        return;
    }
    emptyHeart.style.display = "inline-block";
    filledHeart.style.display = "none";
}

function logoutUser() 
{
    const confirmBtn = document.querySelector('.confirm');
    const cancelBtn = document.querySelector('.cancel');

    if (confirmBtn) {
        confirmBtn.onclick = function(event) {
            event.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('CartList');
            localStorage.removeItem('productsInCart');
            localStorage.removeItem('amounts');
            localStorage.removeItem('CartCount');
            navLogin.style.display = 'none';
            navHome.style.display = 'block';
            window.location.reload(); 
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function(event) {
            event.preventDefault();         
            return;
        };
    }
}

function searchProducts() {
    let text = document.getElementById('search').value.toLowerCase();
    let found = false;
    let searchResultDiv = document.querySelector('.search-result');
    let existingNoResults = document.querySelector('.no-results');
    if (existingNoResults) existingNoResults.remove();
    
    if (typeofsearch === 'search by product name') 
    {
        cards.forEach(card => {
            let productname = card.querySelector('.card-title').innerText.toLowerCase();
            console.log(productname);
            if(productname.indexOf(text) !== -1) 
            {
                found = true;
                card.style.display = 'block';
            }
            else 
            {
                card.style.display = 'none';
            }
        });
    } 
    else if (typeofsearch === 'search by category') 
    {
        cards.forEach(card => {
            let category = card.querySelector('.category').innerText.toLowerCase();
            category = category.replace('category : ', '');
            if(category.indexOf(text) !== -1)
            {
                found = true;
                card.style.display = 'block';
            }
            else 
            {
                card.style.display = 'none';
            }
        });
    }
    if(!found) 
    {
        let warningMessage = document.createElement('p');
        warningMessage.classList.add('no-results');
        warningMessage.textContent = "No products found matching your search!!!";
        warningMessage.style.display = 'flex';
        warningMessage.style.justifyContent = 'center';
        warningMessage.style.textAlign = 'center';
        warningMessage.style.alignItems = 'center';  
        warningMessage.style.fontSize = '30px';
        warningMessage.style.fontWeight = 'bold';
        warningMessage.style.marginTop = '65px';
        warningMessage.style.color = '#19B4FD';
        searchResultDiv.appendChild(warningMessage);
    }
}

showNav();
restoreCart();
restoreFavHearts();
inverserestoreCart();


searchbtn.addEventListener('click', function(event) {
    event.preventDefault();
    searchProducts();
});

logoutbtn.addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

cartBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    let menu = document.querySelector('.products-dropdown-menu');
    // Simple toggle functionality
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; 
}); 

addcartbtns.forEach(button => { 
    button.addEventListener('click', function(event) {
        event.preventDefault();

        const id = Number(this.dataset.value);
        const text = this.innerText.trim();

        if (text === 'Add to cart') {
            addToCart(id);
            if(currentUser !== null)
            {
                this.innerText = 'Remove from cart';
            }
        } else {
            removefromcart(id);
            this.innerText = 'Add to cart';
        }
    });
});


addheartbtns.forEach(button => { 
    button.addEventListener('click', function(event) {
        event.preventDefault();
        let productId = this.getAttribute('data-value');
        addToFav(productId);
    });
});

fillheart.forEach(button => 
{ 
    button.addEventListener('click', function(event) {
        event.preventDefault();
        let productId = this.getAttribute('data-value');
        removefromFav(productId);
    });
});

window.addEventListener("DOMContentLoaded", () => {
    Cartproducts = JSON.parse(localStorage.getItem("productsInCart")) || [];
    elemntCart = JSON.parse(localStorage.getItem("CartList")) || [];
    let savedAmounts = JSON.parse(localStorage.getItem("amounts")) || [];
    counter = 3 - elemntCart.length; 
    
    parent.innerHTML = ""; 

    let totalCount = 0;

    elemntCart.forEach(element => {
        let storedProduct = cards[element.index];
        if (storedProduct) {
            updatecartList(storedProduct, element.id);
            let saved = savedAmounts.find(a => a.id === element.id);
            let amount = saved ? saved.amount : 1;

            let cardBody = document.querySelector(`.cart-item .card-body[data-set='${element.id}']`);
            if (cardBody) {
                cardBody.querySelector('.item-amount').innerText = amount;
                totalCount += amount; 
            }
        }
    });
    cartCount.textContent = totalCount; 
    localStorage.setItem('CartCount', JSON.stringify(totalCount)); 
    changeCartListamount();
    restoreCart();
});
