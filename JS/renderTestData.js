// ----------------------
// Global Variables Setup
// ----------------------

// Directory name for data files (e.g. "SkillData")
const dirName = ((window.location.pathname).split("_")[0].split("/")[2]) + "Data";

// Base filename without extension (used for both main and test JSON files)
const fileNameBase = ((window.location.pathname).split("_")[1].split("/")[1].split("%")[0]);

const container = document.querySelector(".container");

// days checked
let checkedDays = [];

// unlocked
let unlockedCard = [
    { cardIdx: 1, day: 1 },
];

// Collect all day navigation buttons (must be declared in your HTML)
// const nextPageBtns = document.querySelectorAll(".day-btn");

// ---------------------------
// Event Listener for Day Cards
// ---------------------------
nextPageBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const day = parseInt(btn.childNodes[1].innerText.split(" ")[1], 10); // Extract Day number
        const fileName = `${ fileNameBase }.json`;

        // If Day 1 → Skip test and go directly to Day page
        if (day === 1) {
            checkin(fileName, day);
            goToDayPage(day, fileName);
            return;
        }

        // Build test directory path by inserting "Test" before "Data"
        const breakPoint = dirName.length - 4;
        const testDir = dirName.slice(0, breakPoint) + "Test" + dirName.slice(breakPoint);

        // if (isUnlocked(day)) {
        // Fetch the corresponding test file
        fetchData(`/Pages/${ testDir }/${ fileName }`, day);
        // }
    });
});

// This function select all lockedDiv. check it's need to be unlock as time condition(12:00am), If yes then this fun will be add unlock the card and return true otherwise return false.


function isUnlocked() {
    // this card will be unlocked
    const lockCard = document.querySelectorAll(".lock")[0];
    const card = lockCard.parentNode;

    const [key, day] = card.childNodes[1].childNodes[3].childNodes[5].childNodes[1].innerText.split(" ");

    let cardIdx = idxOfCard(card);
    let image = lockCard.children[0];

    const standardTime = '10:22 PM';
    let crrTime = currentTime();

    if (standardTime == crrTime) {
        image.src = '/assets/unlock-svgrepo-com.svg';
        image.alt = "unlock";
        image.addEventListener("click", () => {
            lockCard.classList.add("unlock");
            lockCard.classList.remove("lock");
        });
        unlockedCard.push({ cardIdx, day });
        unlockedCardStoreInLocalStorage();
    }
}

function changeLockIcon(card) {
    let image = (card.children[1]).children[0];
    image.src = '/assets/unlock-svgrepo-com.svg';
    image.alt = "unlock";
    image.addEventListener("click", () => {
        const lockDiv = card.childNodes[3];
        lockDiv.classList.add("unlock");
        lockDiv.classList.remove("lock");
    });
}

function idxOfCard(crd) {
    let index = 0;
    container.childNodes.forEach((card, idx) => {
        if (card == crd) {
            index = idx;
        }
    });
    return index;
}

// check previous day is checkin
function prevDayIsCheckin(fileName, currday) {
    let prevDay = currday - 1;
    const checkedDays = localStorage.getItem(`${ fileName } Checkin`);
    if (checkedDays) {
        try {
            const parsed = JSON.parse(checkedDays);
            // Merge all topics, including new user-created ones
            parsed.forEach((obj) => {
                if (obj.day == prevDay) {
                    return true;
                }
            });
        } catch (e) {
            console.error("Failed to parse saved cheched days", e);
        }
        return false;
    }
}

function currentTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "PM" : "AM";

    // 12-hours format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 -> 12

    return `${ hours }:${ minutes } ${ ampm }`;
}

// remove lock from checked card
function checkedCards() {
    const lockedCards = document.querySelectorAll(".lock");

    lockedCards.forEach(lockedCard => {
        const card = lockedCard.parentNode;
        const [key, day] = card.childNodes[1].childNodes[3].childNodes[5].childNodes[1].innerText.split(" ");

        checkedDays.forEach(obj => {
            if (obj.day == day) {
                lockedCard.classList.add("unlock");
                lockedCard.classList.remove("lock");
            }
        })

    })
}

// -------------------
// Go to Day.html Page
// -------------------
function goToDayPage(day, file) {
    window.location.href = `/Pages/Day.html?dir=${ encodeURIComponent(dirName) }&file=${ encodeURIComponent(file) }&day=${ encodeURIComponent(day) }`;
}

// -----------------
// Fetch Test Data
// -----------------
function fetchData(filePath, day) {
    fetch(filePath)
        .then(res => res.ok ? res.json() : Promise.reject("Network error"))
        .then(days => {
            const currentDay = days.find(d => d.day == day);

            // If test not found or empty → Go directly to Day page
            if (!currentDay || !Array.isArray(currentDay.test) || currentDay.test.length === 0) {
                checkin(`${ fileNameBase }.json`, day);
                goToDayPage(day, `${ fileNameBase }.json`);
                return;
            }

            renderTest(currentDay);
        })
        .catch(console.error);
}

// ----------------
// Render Test HTML
// ----------------
function renderTest(currentDay) {
    document.querySelector(".test-container")?.remove();

    const testContainer = document.createElement("div");
    testContainer.className = "test-container";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-test-btn";
    cancelBtn.textContent = "✖";
    cancelBtn.title = "Cancel and go back";
    cancelBtn.onclick = () => testContainer.remove();

    const testContent = document.createElement("div");
    testContent.className = "test-content";
    testContent.append(cancelBtn);

    const h1 = document.createElement("h1");
    h1.textContent = `Day ${ currentDay.day - 1 } - Short Test`;
    testContent.append(h1);

    const form = document.createElement("form");

    currentDay.test.forEach((q, i) => {
        const qDiv = document.createElement("div");
        qDiv.className = "questions";

        const qP = document.createElement("p");
        qP.className = "qs";
        qP.textContent = `${ i + 1 }. ${ q.question }`;
        qDiv.append(qP);

        const optDiv = document.createElement("div");
        optDiv.className = "options";

        Object.entries(q.options).forEach(([key, val]) => {
            const label = document.createElement("label");
            label.className = "radio-btn";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${ i + 1 }`;
            input.value = key;

            label.append(input, val);
            optDiv.append(label);
        });

        qDiv.append(optDiv);
        form.append(qDiv);
    });

    const scoreP = document.createElement("p");
    scoreP.className = "score";
    scoreP.textContent = "*Your score will be displayed here after submission.";

    const submitBtn = document.createElement("button");
    submitBtn.className = "submit-btn";
    submitBtn.type = "button";
    submitBtn.textContent = "Submit";
    submitBtn.onclick = () => handleSubmit(currentDay, form, submitBtn);

    const submitDiv = document.createElement("div");
    submitDiv.className = "submit-container";
    submitDiv.append(scoreP, submitBtn);

    form.append(submitDiv);
    testContent.append(form);
    testContainer.append(testContent);
    document.body.append(testContainer);
}

// ----------------
// Handle Submission
// ----------------
function handleSubmit(currentDay, form, submitBtn) {
    const unanswered = [];
    form.querySelectorAll(".questions").forEach(q => {
        q.classList.remove("unanswered")
        q.querySelector(".unanswered-notice")?.remove();
    });

    currentDay.test.forEach((_, i) => {
        if (!form.querySelector(`input[name="q${ i + 1 }"]:checked`)) unanswered.push(i);
    });

    if (unanswered.length) {
        unanswered.forEach(i => {
            form.querySelectorAll(".questions")[i].classList.add("unanswered");
            let notice = document.createElement("p");
            notice.className = "unanswered-notice";
            notice.innerHTML = `<i class="ri-error-warning-line"></i> Please answer this question.`;
            form.querySelectorAll(".questions")[i].append(notice);
        });
        return;
    }

    let score = 0;

    currentDay.test.forEach((q, i) => {
        const selected = form.querySelector(`input[name="q${ i + 1 }"]:checked`).value.toUpperCase();
        const correct = getCorrectKey(q);
        const block = form.querySelectorAll(".questions")[i];

        if (selected === correct) {
            score++;
            block.querySelector(`input[value="${ correct }"]`)?.parentElement.classList.add("option-correct");
        } else {
            block.querySelector(`input[value="${ correct }"]`)?.parentElement.classList.add("option-correct");
            block.querySelector(`input[value="${ selected }"]`)?.parentElement.classList.add("option-wrong");
        }
    });

    const passMark = Math.ceil(currentDay.test.length * 0.6);
    form.querySelector(".score").textContent = `Score: ${ score }/${ currentDay.test.length } - ${ score >= passMark ? "✅ Passed" : "❌ Failed" }`;

    submitBtn.textContent = "Next Day";
    submitBtn.onclick = () => {
        checkin(`${ fileNameBase }.json`, currentDay.day);
        goToDayPage(parseInt(currentDay.day), `${ fileNameBase }.json`);
    };
}

// ------------------------
// Extract Correct Answer Key
// ------------------------
function getCorrectKey(q) {
    if (typeof q.correctAnswer === "string") return q.correctAnswer.trim().toUpperCase();
    if (q.correctAnswer && typeof q.correctAnswer === "object") return Object.keys(q.correctAnswer)[0].toUpperCase();
    if (typeof q.answer === "string") {
        for (const [k, v] of Object.entries(q.options || {})) {
            if (String(v).trim() === q.answer.trim()) return k.toUpperCase();
        }
    }
    if (q.answer && typeof q.answer === "object") return Object.keys(q.answer)[0].toUpperCase();
    return null;
}




// Track day checkin and store in localstorage
function checkin(fileName, day) {
    checkedDays.push({ "day": day, "check": true });
    localStorage.setItem(`${ fileName } Checkin`, JSON.stringify(checkedDays));
}

// unlock the card
function unlockedTheCard() {
    let arrIdx = 0;
    container.childNodes.forEach((card, cardIdx) => {
        if (cardIdx % 2 != 0) {
            if (arrIdx < unlockedCard.length) {
                if (cardIdx == unlockedCard[arrIdx].cardIdx && arrIdx != 0) {
                    changeLockIcon(card);
                }
            }
            arrIdx++;
        }
    })
}

// add unlocked Card in localstorage
function unlockedCardStoreInLocalStorage() {
    localStorage.setItem(`${ fileNameBase }.json Unlocked`, JSON.stringify(unlockedCard));
}

// load unlocked cards
function loadUnlockedCard() {
    const unlockedCards = localStorage.getItem(`${ fileNameBase }.json Unlocked`);
    if (unlockedCards) {
        try {
            const parsed = JSON.parse(unlockedCards);

            parsed.forEach((obj) => {
                unlockedCard.push(obj);
                removeDuplicates();
            })
        } catch (e) {
            console.error("Failed to parse saved cheched days", e);
        }
        return false;
    }
}

// remove duplicates from the unlockedCard Arr
function removeDuplicates() {
    let prev = unlockedCard[0];
    let newArr = [prev];
    let j = 1;
    for (let i = 1; i <= unlockedCard.length - 1; i++) {
        let cond = prev.cardIdx != unlockedCard[i].cardIdx;
        if (cond) {
            newArr[j] = unlockedCard[i];
            prev = unlockedCard[i];
            j++;
        }
    }
    unlockedCard = newArr;
}

// load checkin days
function loadCheckinDays() {
    const checkedDaysls = localStorage.getItem(`${ fileNameBase }.json Checkin`);
    if (checkedDaysls) {
        try {
            const parsed = JSON.parse(checkedDaysls);
            parsed.forEach((obj) => {
                if (!checkedDays.includes(obj)) {
                    checkedDays.push(obj);
                }
            });
        } catch (e) {
            console.error("Failed to parse saved cheched days", e);
        }
    }
}

loadUnlockedCard();
loadCheckinDays();
unlockedTheCard();
checkedCards();
removeDuplicates();
isUnlocked();
