Number.prototype.toCurrency = function() {
    return this.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

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
const $total = document.querySelector('.total');
const $totalAmmount = document.querySelector('.total__ammount');
const $wrapper = document.querySelector('.wrapper');

const model = new State('barcode');

function addProduct(product) {
    const isNewProduct = !model.itemExist(product.barcode);
    model.addItem(product);

    if (isNewProduct) {
        addProductInList(product);
    } else {
        updateProductInList(product);        
    }
    setInvoice();
}

function addProductInList(product) {
    $productList.appendChild(getProductListItem(product));
}

function getExistingProductItem(barcode) {
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

function getProductsShortcutItems(products) {
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        const imageEl = document.createElement('img');
        imageEl.src = `/images/products/${product.image}`
        imageEl.dataset.barcode = product.barcode;
        fragment.appendChild(imageEl);
    });
    
    return fragment;
}

function getSubtotal() {
    return model.getAll().reduce((accumulator, currentProduct) => {
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
    $totalAmmount.innerHTML = '';
    $primaryButton.setAttribute('disabled', true);
    $total.classList.remove('show');
    model.reset();
}

function setInvoice(priceProduct) {
    $subtotal.innerHTML = getSubtotal().toCurrency();
    $tax.innerHTML = getTax().toCurrency();
    $totalAmmount.innerHTML = getTotal().toCurrency();
    $cardAmmountField.innerHTML = $totalAmmount.innerHTML;
}

function updateProductInList(product) {
    const productEl = getExistingProductItem(product.barcode);
    const quantity = model.getItemProperty(product.barcode, 'quantity');
    productEl.querySelector('.products__quantity-number').innerHTML = quantity;
    productEl.querySelector('.products__price').innerHTML = (product.price * quantity).toCurrency();    
}

function getProduct(barcode) {
    return data.find(product => product.barcode === barcode);
}

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

$productsShortcuts.appendChild(getProductsShortcutItems(data));
$productsShortcuts.style.width = `${data.length * 100}px`;
$productsShortcuts.addEventListener('click', (event) => {
    addProduct(getProduct(event.target.dataset.barcode));

    if (model.isNotEmpty()) {
        $primaryButton.removeAttribute('disabled');
        $total.classList.add('show');
    }
});
