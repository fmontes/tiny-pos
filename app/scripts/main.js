Number.prototype.toCurrency = function() {
    return this.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

function addProduct(product) {
    const existingProduct = getExistingProduct(product.barcode);

    if (existingProduct) {
        updateProductInList(existingProduct, product);
    } else {
        $productList.appendChild(getProductListItem(product));
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

function getProductsShortcut(products) {
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

function getPageState() {
    return $wrapper.classList.contains('payment') ? 'payment' : 'home';
}

function goToDone() {
    $wrapper.classList.add('done');

    setTimeout(() => {
        $wrapper.classList.remove('payment');
        resetApp();
    }, 150);

    setTimeout(() => {
        $wrapper.classList.remove('done');
    }, 800);
}

function goToHome() {
    $wrapper.classList.remove('payment');
    $primaryButton.style.width = `${$primaryButton.offsetWidth}px`;
}

function goToPayment() {
    $wrapper.classList.add('payment');
    $primaryButton.removeAttribute('style');
}

function navigate() {
    if (getPageState() === 'home') {
        goToPayment();
    } else {
        goToDone();
    }
}

function resetApp() {
    $cashPayingField.value = '';
    $cashChangeAmmount.innerHTML = parseInt('0').toCurrency();
    $productList.innerHTML = '';
    $subtotal.innerHTML = '';
    $tax.innerHTML = '';
    $total.innerHTML = '';
    $primaryButton.setAttribute('disabled', true);
    productsModel = [];
    $total.classList.remove('show');
}

function setInvoice(priceProduct) {
    $subtotal.innerHTML = getSubtotal().toCurrency();
    $tax.innerHTML = getTax().toCurrency();
    $total.innerHTML = getTotal().toCurrency();
    $cardAmmountField.innerHTML = $total.innerHTML;
}

function updateProductsModel(product) {
    if (productsModel.includes(product)) {
        productsModel = productsModel.map(product => {
            if (product.barcode === product.barcode) {
                product.quantity++;
            }

            return product;
        });
    } else {
        product.quantity = 1;
        productsModel.push(product);
    }
}

function updateProductInList(productEl, product) {
    const quantity = parseInt(productEl.querySelector('.products__quantity-number').innerHTML) + 1;
    productEl.querySelector('.products__quantity-number').innerHTML = quantity;
    productEl.querySelector('.products__price').innerHTML = (product.price * quantity).toCurrency();    
}

function getProduct(barcode) {
    return data.find(product => product.barcode === barcode);
}

const $backButton = document.querySelector('.actions__back');
const $cardAmmountField = document.querySelector('.card__ammout');
const $cashChangeAmmount = document.querySelector('.cash__change-ammout');
const $cashPayingField = document.querySelector('.cash__paying-field');
const $paymentMethodSelector = document.querySelector('.actions__payment-method');
const $primaryButton = document.querySelector('.actions__payment');
const $productList = document.querySelector('.products');
const $productsShortcuts = document.querySelector('.products-shortcut');
const $subtotal = document.querySelector('.subtotal__ammount');
const $tax = document.querySelector('.tax__ammount');
const $total = document.querySelector('.total__ammount');
const $wrapper = document.querySelector('.wrapper');

let productsModel = [];

$primaryButton.style.width = `${$primaryButton.offsetWidth}px`;

$primaryButton.addEventListener('click', navigate);

$paymentMethodSelector.addEventListener('click', event => {
    if (!event.target.classList.contains('payment-method--selected')) {
        document.querySelector('.payment-selected').classList.toggle('payment-selected--card');
        document.querySelector('.payment-method--selected').classList.remove('payment-method--selected');
        event.target.classList.toggle('payment-method--selected');
    }
});

$backButton.addEventListener('click', goToHome);

$cashPayingField.addEventListener('keyup', event => {
    $cashChangeAmmount.innerHTML = event.target.value
        ? (event.target.value - getTotal()).toCurrency()
        : parseInt('0').toCurrency();
});

$productsShortcuts.appendChild(getProductsShortcut(data));
$productsShortcuts.style.width = `${data.length * 100}px`;
$productsShortcuts.addEventListener('click', (event) => {
    addProduct(getProduct(event.target.dataset.barcode));

    if (productsModel.length === 1) {
        $primaryButton.removeAttribute('disabled');
        document.querySelector('.total').classList.add('show');
    }
});
