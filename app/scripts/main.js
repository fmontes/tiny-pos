const actionButton = document.querySelector('.actions .btn');

actionButton.addEventListener('click', (event) => {
    event.currentTarget.classList.toggle('icon');
})