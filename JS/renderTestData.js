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
let unlockedCard = [{ cardIdx: 0, day: 1 }];

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

        fetchData(`/Pages/${ testDir }/${ fileName }`, day);
    });
});

// ----------------------
// Unlock logic
// ----------------------
function isUnlocked() {
    // this card will be unlocked
    const lockCard = document.querySelector(".lock");
    if (!lockCard) return;

    const card = lockCard.parentNode;

    const day = card?.querySelector(".day").innerText.split(" ")[1];

    let cardIdx = idxOfCard(card);
    let image = lockCard.children[0];

    const standardTime = '10:48 AM';
    let crrTime = currentTime();

    if (standardTime === crrTime) {
        image.src = "/assets/unlock.svg";
        image.alt = "unlock";
        image.addEventListener("click", () => {
            lockCard.classList.add("unlock");
            lockCard.classList.remove("lock");
        });
        console.log(cardIdx, day)
        unlockedCard.push({ cardIdx, day });
        unlockedCardStoreInLocalStorage();
    }
}

function changeLockIcon(card) {
    let image = card.querySelector(".lock img");
    if (!image) return;

    image.src = "/assets/unlock.svg";
    image.alt = "unlock";

    image.addEventListener("click", () => {
        const lockDiv = card.querySelector(".lock");
        if (lockDiv) {
            lockDiv.classList.add("unlock");
            lockDiv.classList.remove("lock");
        }
    });
}

function idxOfCard(crd) {
    return Array.from(container.children).indexOf(crd);
}

// check previous day is checkin
function prevDayIsCheckin(fileName, currday) {
    let prevDay = currday - 1;
    const checkedDays = localStorage.getItem(`${ fileName } Checkin`);
    if (checkedDays) {
        try {
            const parsed = JSON.parse(checkedDays);
            return parsed.some(obj => obj.day == prevDay);
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

// ---------------------------
// Remove lock from checked card
// ---------------------------
function checkedCards() {
    const lockedCards = document.querySelectorAll(".lock");

    lockedCards.forEach(lockedCard => {
        const card = lockedCard.parentNode;
        const day = card?.querySelector(".day").innerText.split(" ")[1];

        if (checkedDays.some(obj => obj.day == day)) {
            lockedCard.classList.replace("lock", "unlock");
        }
    });
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

// ---------------------------
// Track day checkin and store
// ---------------------------
function checkin(fileName, day) {
    checkedDays.push({ day, check: true });
    localStorage.setItem(`${ fileName } Checkin`, JSON.stringify(checkedDays));
}

// ---------------------------
// unlock the card
// ---------------------------
function unlockedTheCard() {
    container.querySelectorAll(".cards").forEach((card, cardIdx) => {
        const obj = unlockedCard.find(u => u.cardIdx === cardIdx);
        if (obj && obj.day != 1) {
            changeLockIcon(card);
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
            });
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
                if (!checkedDays.some(d => d.day == obj.day)) {
                    checkedDays.push(obj);
                }
            });
        } catch (e) {
            console.error("Failed to parse saved cheched days", e);
        }
    }
}

// ---------------------------
// Init calls
// ---------------------------
loadUnlockedCard();
loadCheckinDays();
unlockedTheCard();
checkedCards();
removeDuplicates();
isUnlocked();