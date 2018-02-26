Number.prototype.toCurrency = function() {
    return this.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

function addProduct(product) {
    const existingProduct = getExistingProduct(product.barcode);

    if (existingProduct) {
        updateProductInList(existingProduct, product);
    } else {
        productList.appendChild(getProductListItem(product));
    }

    updateProductsModel(product);
    setInvoice();
}

function getExistingProduct(barcode) {
    return document.querySelector(`li[data-barcode="${barcode}"]`);
}

function getProductListItem(data) {
    const fragment = document.createDocumentFragment();
    const li = document.createElement('li');
    li.dataset.barcode = data.barcode;
    li.classList.add('products__item');
    li.innerHTML = `
        <span class="products__quantity">
            <span class="products__quantity-number">1</span>
            <span class="products__quantity-separator">x</span>
        </span>
        <span class="products__name">${data.name}</span>
        <span class="products__price">${data.price.toCurrency()}</span>
    `;
    fragment.appendChild(li);
    return fragment;
}

function getProductsShortcutImages(products) {
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const imageEl = document.createElement('img');
        imageEl.src = `/images/products/${product.image}`
        imageEl.dataset.barcode = product.barcode;
        fragment.appendChild(imageEl);
    });
    
    return fragment;
}

function getRandomProduct() {
    return data[Math.floor(Math.random() * Math.floor(data.length))];
}

function getSubtotal() {
    return productsModel.reduce((accumulator, currentProduct) => {
        return accumulator + currentProduct.price * currentProduct.quantity;
    }, 0);
}

function getTax() {
    return getSubtotal() * 0.13;
}

function getTotal() {
    return getSubtotal() + getTax();
}

function resetApp() {
    document.querySelector('.cash__paying-field').value = '';
    document.querySelector('.cash__change-ammout').innerHTML = '$0.00';
    productList.innerHTML = '';
    subtotalElem.innerHTML = '';
    taxElem.innerHTML = '';
    totalElem.innerHTML = '';
    actionsPaymentButton.setAttribute('disabled', true);
    productsModel = [];
    document.querySelector('.total').classList.remove('show');
}

function setInvoice(priceProduct) {
    subtotalElem.innerHTML = getSubtotal().toCurrency();
    taxElem.innerHTML = getTax().toCurrency();
    totalElem.innerHTML = getTotal().toCurrency();
    document.querySelector('.card__ammout').innerHTML = totalElem.innerHTML;
}

function setState(state) {
    if (state === 'payment') {
        pageState = 'payment';
        wrapper.classList.add('payment');
        actionsPaymentButton.removeAttribute('style');
    } else if (state === 'home') {
        pageState = 'home';
        wrapper.classList.remove('payment');
        actionsPaymentButton.style.width = `${actionsPaymentButton.offsetWidth}px`;
    } else if (state === 'done') {
        wrapper.classList.add('done');
        pageState = 'home';

        setTimeout(() => {
            wrapper.classList.remove('payment');
            resetApp();
        }, 150);

        setTimeout(() => {
            wrapper.classList.remove('done');
        }, 800);
    }
}

function updateProductsModel(products) {
    if (productsModel.includes(products)) {
        productsModel = productsModel.map(product => {
            if (product.barcode === products.barcode) {
                product.quantity++;
            }

            return product;
        });
    } else {
        products.quantity = 1;
        productsModel.push(products);
    }
}

function updateProductInList(productEl, product) {
    const quantity = parseInt(productEl.querySelector('.products__quantity-number').innerHTML) + 1;
    productEl.querySelector('.products__price').innerHTML = (product.price * quantity).toCurrency();
    productEl.querySelector('.products__quantity-number').innerHTML = quantity;
}

function getProduct(barcode) {
    return data.find(product => product.barcode === barcode);
}

const actionsPaymentButton = document.querySelector('.actions__payment');
const backButton = document.querySelector('.actions__back');
const paymentMethodSelector = document.querySelector('.actions__payment-method');
const productList = document.querySelector('.products');
const subtotalElem = document.querySelector('.subtotal__ammount');
const taxElem = document.querySelector('.tax__ammount');
const totalElem = document.querySelector('.total__ammount');
const wrapper = document.querySelector('.wrapper');
const productsShortcutEl = document.querySelector('.products-shortcut');

let pageState = 'home';
let productsModel = [];

actionsPaymentButton.style.width = `${actionsPaymentButton.offsetWidth}px`;

actionsPaymentButton.addEventListener('click', event => {
    setState(pageState === 'home' ? 'payment' : 'done');
});

paymentMethodSelector.addEventListener('click', event => {
    if (!event.target.classList.contains('payment-method--selected')) {
        document.querySelector('.payment-selected').classList.toggle('payment-selected--card');
        document.querySelector('.payment-method--selected').classList.remove('payment-method--selected');
        event.target.classList.toggle('payment-method--selected');
    }
});

backButton.addEventListener('click', $event => {
    setState('home');
});

document.querySelector('.cash__paying-field').addEventListener('keyup', event => {
    document.querySelector('.cash__change-ammout').innerHTML = event.target.value
        ? (event.target.value - getTotal()).toCurrency()
        : parseInt('0').toCurrency();
});

productsShortcutEl.appendChild(getProductsShortcutImages(data));
productsShortcutEl.style.width = `${data.length * 100}px`;
productsShortcutEl.addEventListener('click', (event) => {
    addProduct(getProduct(event.target.dataset.barcode));

    if (productsModel.length === 1) {
        actionsPaymentButton.removeAttribute('disabled');
        document.querySelector('.total').classList.add('show');
    }
});
