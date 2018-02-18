Number.prototype.toCurrency = function() {
    return `$${this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
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

function getPriceModel() {
    return productsModel.map(product => product.price);
}

function getProductListItem(data) {
    const fragment = document.createDocumentFragment();
    const li = document.createElement('li');
    li.dataset.barcode = data.barcode;
    li.classList.add('products__item');
    li.innerHTML = `
        <span class="products__quantity">${data.quantity}</span>
        <span class="products__name">${data.name}</span>
        <span class="products__price">${data.price.toCurrency()}</span>
    `;
    fragment.appendChild(li);
    return fragment;
}

function getRandomProduct() {
    return data[Math.floor(Math.random() * Math.floor(data.length))];
}

function getSubtotal() {
    return productsModel.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
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
}

function setInvoice(priceProduct) {
    const pricesModel = getPriceModel();
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
        actionsPaymentButton.style.width = `${actionsPaymentButtonWidth}px`;
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
        productsModel.push(products);
    }
}

function updateProductInList(productEl, product) {
    const quantity = parseInt(productEl.querySelector('.products__quantity').innerHTML) + 1;
    productEl.querySelector('.products__price').innerHTML = (product.price * quantity).toCurrency();
    productEl.querySelector('.products__quantity').innerHTML = quantity;
}

const actionsPaymentButton = document.querySelector('.actions__payment');
const actionsPaymentButtonWidth = actionsPaymentButton.offsetWidth;
const backButton = document.querySelector('.actions__back');
const paymentMethodSelector = document.querySelector('.actions__payment-method');
const productList = document.querySelector('.products');
const subtotalElem = document.querySelector('.subtotal__ammount');
const taxElem = document.querySelector('.tax__ammount');
const totalElem = document.querySelector('.total__ammount');
const wrapper = document.querySelector('.wrapper');
let pageState = 'home';
let productsModel = [];

actionsPaymentButton.style.width = `${actionsPaymentButtonWidth}px`;

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

document.querySelector('.barcode').addEventListener('click', () => {
    addProduct(getRandomProduct());

    if (productsModel.length) {
        actionsPaymentButton.removeAttribute('disabled');
    }
});

document.querySelector('.cash__paying-field').addEventListener('keyup', event => {
    document.querySelector('.cash__change-ammout').innerHTML = event.target.value
        ? (event.target.value - getTotal()).toCurrency()
        : parseInt('0').toCurrency();
});
