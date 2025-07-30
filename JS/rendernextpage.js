let explores = document.querySelectorAll('.explore');

explores.forEach(explore => {
    explore.addEventListener('click', () => {
        let card = explore.parentElement;
        let h2 = card.childNodes[3];
        let categoryName = h2.innerText;
        window.location.href = `/Pages/${categoryName}.html`; 
    });
});