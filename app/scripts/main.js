let pageState = 'home';

const wrapper = document.querySelector('.wrapper');

const actionsPaymentButton = document.querySelector('.actions__payment');
const actionsPaymentButtonWidth = actionsPaymentButton.offsetWidth;
actionsPaymentButton.style.width = `${actionsPaymentButtonWidth}px`;

actionsPaymentButton.addEventListener('click', event => {
    setState(pageState === 'home' ? 'payment' : 'done');
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
        }, 150)
        
        setTimeout(() => {
            wrapper.classList.remove('done');
        }, 800)
    }
}