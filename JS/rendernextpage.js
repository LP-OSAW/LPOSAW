let nextPageBtns = document.querySelectorAll('.nextPage');

nextPageBtns.forEach(nextPageBtn => {
    nextPageBtn.addEventListener('click', () => {
        let card = nextPage.parentElement;
        let h2 = card.childNodes[3];
        let categoryName = h2.innerText;
        window.location.href = `/Pages/${categoryName}.html`; 
    });
});