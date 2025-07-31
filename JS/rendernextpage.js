let nextPageBtns = document.querySelectorAll('.nextPage');

nextPageBtns.forEach(nextPageBtn => {
    nextPageBtn.addEventListener('click', () => {
        let card = nextPageBtn.parentElement;
        let h2 = card.childNodes[3];
        let title = h2.innerText;
        if (nextPageBtn.innerText == 'Join Room') {
            // jump to next room
            window.location.href = `/Pages/${title} Room.html`;
        }
        else if (nextPageBtn.innerText == 'Explore') {
            // jump to next page
            window.location.href = `/Pages/${title}.html`;
        }
    });
});