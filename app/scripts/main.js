
class ButtonStated {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.fullWidth = this.element.offsetWidth;

        this.element.style.width = `${this.fullWidth}px`;
    }

    onClick(callback) {
        this.element.addEventListener('click', event => {
            const el = event.currentTarget;
            el.classList.toggle('icon');

            if (el.classList.contains('icon')) {
                el.removeAttribute('style');
            } else {
                el.style.width = `${this.fullWidth}px`;
            }

            callback(event);
        });
    }
}

new ButtonStated('.actions .btn').onClick((event) => {
    document.querySelector('.wrapper').classList.toggle('payment');
});