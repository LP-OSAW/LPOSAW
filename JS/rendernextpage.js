let nextPageBtns = document.querySelectorAll('.nextPage');

function renderModal(card, title) {
    let container = card.parentElement;
    let body = container.parentElement;

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    let p = document.createElement("p");
    p.innerText = "Are you read agreement?";
    modalContent.appendChild(p);

    let btnCont = document.createElement("div");
    btnCont.classList.add("btn-container");

    let noBtn = document.createElement("button");
    noBtn.classList.add("cancel");
    noBtn.innerText = "Not read";
    btnCont.appendChild(noBtn);

    let yesBtn = document.createElement("button");
    yesBtn.classList.add("yes-btn");
    yesBtn.innerText = "Yes i read";
    btnCont.appendChild(yesBtn);
    yesBtn.addEventListener("click", () => {
        window.location.href = `/Pages/YogaSkillRooms/${ title } Room.html`;
    })

    modalContent.appendChild(btnCont);
    modalContainer.appendChild(modalContent);
    body.appendChild(modalContainer);
}

nextPageBtns.forEach(nextPageBtn => {
    nextPageBtn.addEventListener('click', () => {
        console.log(nextPageBtn, "Clicked!");
        let card = nextPageBtn.parentElement;
        let h2 = card.childNodes[3];
        let title = h2.innerText;
        if (nextPageBtn.innerText == 'Join Room') {
            // jump to next room
            renderModal(card, title);
        }
        else if (nextPageBtn.innerText == 'Explore') {
            // jump to next page
            window.location.href = `/Pages/${ title }.html`;
        }
    });
});