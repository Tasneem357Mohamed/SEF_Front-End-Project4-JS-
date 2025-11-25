const logoutbtn = document.querySelector('.btn-logout');
const parent = document.querySelector('.parent');
const container = document.querySelector('.container');
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let Products = JSON.parse(localStorage.getItem('Favproducts')) || [];
let user = document.querySelector('.nameOfuser');
user.textContent = `${currentUser.firstname}`;


function showEmptyFav() 
{
    if(document.querySelector('.empty-fav')) return; // already shown
    parent.innerHTML = "";  
    let warningMessage = document.createElement('p');
    warningMessage.classList.add('empty-fav');
    warningMessage.textContent = "Your favourites list is empty. Add some products ^^";
    warningMessage.style.display = 'flex';
    warningMessage.style.justifyContent = 'center';
    warningMessage.style.textAlign = 'center';
    warningMessage.style.alignItems = 'center';
    warningMessage.style.fontSize = '30px';
    warningMessage.style.fontWeight = 'bold';
    warningMessage.style.marginTop = '170px';
    warningMessage.style.color = '#19B4FD';
    container.appendChild(warningMessage);
}

function updateFavPage(product)
{
    if (!Products || Products.length === 0)
    {
        showEmptyFav();
        return;
    }
    else
    {
        let item = document.createElement('div');
        item.classList.add('card','product');
        item.setAttribute('data-set', `${product.id}`);
        item.style.width = '18rem';
        item.innerHTML = `
            <img src="${product.img}" class="card-img-top" alt="...">
            <div class="card-body d-flex flex-column gap-1 justify-content-center m-auto ps-4 align-items-center">
            <h5 class="card-title mt-1" Id="dell-laptop-core-i5">${product.name}</h5>
            <p class="card-text category text-light">category : ${product.category}</p>
            <a href="#" class="btn btn2"><i class="bi bi-heart-fill addheart"></i></a>
            </div>
        `;
        parent.appendChild(item);
        item.querySelector('.addheart').addEventListener('click', function () {
            removeProduct(item);
        });
    }
}

function removeProduct(pro)
{
    const id = pro.dataset.set;
    const title = pro.querySelector(".card-title").innerText;
    pro.remove();
    Products = Products.filter(p => p.name !== title);
    localStorage.setItem("Favproducts", JSON.stringify(Products));
    if (!Products || Products.length === 0) {
        showEmptyFav();
    }
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

logoutbtn.addEventListener('click', function(event) {
    event.preventDefault();
    logoutUser();
});

parent.innerHTML = "";
Products.forEach(element => updateFavPage(element));
if(Products.length === 0)
{
    showEmptyFav();
}