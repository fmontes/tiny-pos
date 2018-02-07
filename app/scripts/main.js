const actionButton = document.querySelector('.actions .btn');
const width = actionButton.offsetWidth;
actionButton.style.width = `${width}px`;

actionButton.addEventListener('click', (event) => {
    const el = event.currentTarget;

    el.classList.toggle('icon');

    if (!el.classList.contains('icon')) {
        el.style.width = `${width}px`;
    } else {
        el.removeAttribute('style');
    }
});