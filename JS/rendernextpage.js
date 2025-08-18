let nextPageBtns = document.querySelectorAll('.nextPage');

let roomsJoined = [];

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
        let [categoryName] = h1.innerText.split(" ");
        let [roomName] = title.split(" ");
        if (isRoomJoined(roomName)) {
            window.location.href = `/Pages/${ categoryName }_SkillRooms/${ roomName } Room.html`;
        } else if (roomsJoined.length < 3) {
            roomsJoined.push({ categoryName, roomName });
            joinedRoomsStoretoLocalstorage();
            window.location.href = `/Pages/${ categoryName }_SkillRooms/${ roomName } Room.html`;
        } else {
            console.log("Your Limit excide");
            modalContainer.remove();
            renderWarningModal();
        }
    });

    modalContent.appendChild(btnCont);
    modalContainer.appendChild(modalContent);
    body.appendChild(modalContainer);
}

// -----------------
// Check room is joined
// -----------------
function isRoomJoined(roomName) {
    let val = false;
    roomsJoined.forEach(room => {
        if (room.roomName === roomName) {
            val = true;
        }
    });
    return val;
}

function renderWarningModal() {
    const body = document.querySelector("body");

    let modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    let modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    let p = document.createElement("p");
    p.innerHTML = `<i class="ri-error-warning-line"></i>  You're already join three rooms!!!`;
    p.style.color = "red";
    p.style.fontSize = "1.2rem";
    modalContent.appendChild(p);

    let okBtn = document.createElement("button");
    okBtn.classList.add("yes-btn");
    okBtn.innerText = "OK";
    okBtn.addEventListener("click", () => {
        modalContainer.remove();
    });
    modalContent.appendChild(okBtn);
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
    });
});

// store joined rooms in localstorage
function joinedRoomsStoretoLocalstorage() {
    localStorage.setItem("Joined Room", JSON.stringify(roomsJoined));
}

// load joined roome from localstorage
function loadJoinedRoomfromLocalstorage() {
    const joinedRooms = localStorage.getItem("Joined Room");
    if (joinedRooms) {
        try {
            const parse = JSON.parse(joinedRooms);
            parse.forEach(obj => {
                if (obj.roomName != roomsJoined.roomName) {
                    roomsJoined.push(obj);
                }
            });
        } catch (e) {
            console.error("Failed to parse saved cheched days", e);
        }
    }
}

loadJoinedRoomfromLocalstorage();