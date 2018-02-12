const wrapper = document.querySelector('.wrapper');

const actionsPaymentButton = document.querySelector('.actions__payment');
const actionsPaymentButtonWidth = actionsPaymentButton.offsetWidth;
actionsPaymentButton.style.width = `${actionsPaymentButtonWidth}px`;

actionsPaymentButton.addEventListener('click', event => {
    setState('payment');
});

const paymentMethodSelector = document.querySelector('.actions__payment-method');

paymentMethodSelector.addEventListener('click', (event) => {
    document.querySelector('.payment-method--selected').classList.remove('payment-method--selected');
    event.target.classList.toggle('payment-method--selected')
});

const backButton = document.querySelector('.actions__back');
backButton.addEventListener('click', ($event) => {
    setState('home');
});


const setState = (state) => {
    if (state === 'payment') {
        wrapper.classList.add('payment');
        actionsPaymentButton.removeAttribute('style');
    } else if (state === 'home') {
        wrapper.classList.remove('payment');
        actionsPaymentButton.style.width = `${actionsPaymentButtonWidth}px`;   
    }
}