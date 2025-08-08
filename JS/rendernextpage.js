let nextPageBtns = document.querySelectorAll('.nextPage');

function renderModal(card, title) {
    let container = (card.parentElement).parentElement;
    let body = container.parentElement;
    let h1 = body.childNodes[1];

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
    noBtn.addEventListener("click", () => {
        modalContainer.remove();
    });

    let yesBtn = document.createElement("button");
    yesBtn.classList.add("yes-btn");
    yesBtn.innerText = "Yes i read";
    btnCont.appendChild(yesBtn);
    yesBtn.addEventListener("click", () => {
        let [skillName] = h1.innerText.split(" ");
        let [roomName] = title.split(" ");
        window.location.href = `/Pages/${ skillName }_SkillRooms/${ roomName } Room.html`;
    })

    modalContent.appendChild(btnCont);
    modalContainer.appendChild(modalContent);
    body.appendChild(modalContainer);
}

nextPageBtns.forEach(nextPageBtn => {
    nextPageBtn.addEventListener('click', () => {
        let card = nextPageBtn.parentElement;
        let h2 = card.childNodes[1];
        let title = h2.innerText;

        if (nextPageBtn.innerText == 'Join Room') {
            // jump to next room
            renderModal(card, title);
        }
        else if (nextPageBtn.innerText == 'Explore') {
            // jump to next page
            window.location.href = `/Pages/${ title }.html`;
        }
        else if (nextPageBtn.innerText == 'Check in') {
            let dirName = ((window.location.pathname).split("_"))[0].split("/")[2] + "Data";
            let fileName = ((window.location.pathname).split("_"))[1].split("/")[1].split("%")[0];
            let day = nextPageBtn.childNodes[1].innerText;
            day = day.split(" ")[1];

            fileName = fileName + ".json";

            window.location.href = `/Pages/Day.html?dir=${encodeURIComponent(dirName)}&file=${encodeURIComponent(fileName)}&day=${encodeURIComponent(day)}`;
        }
    });
});