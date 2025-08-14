// ----------------------
// Global Variables Setup
// ----------------------

// Directory name for data files (e.g. "SkillData")
const dirName = ((window.location.pathname).split("_")[0].split("/")[2]) + "Data";

// Base filename without extension (used for both main and test JSON files)
const fileNameBase = ((window.location.pathname).split("_")[1].split("/")[1].split("%")[0]);

// Collect all day navigation buttons (must be declared in your HTML)
// const nextPageBtns = document.querySelectorAll(".day-btn");

// ---------------------------
// Event Listener for Day Cards
// ---------------------------
nextPageBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const day = parseInt(btn.childNodes[1].innerText.split(" ")[1], 10); // Extract Day number
        const fileName = `${fileNameBase}.json`;

        // If Day 1 → Skip test and go directly to Day page
        if (day === 1) {
            goToDayPage(day, fileName);
            return;
        }

        // Build test directory path by inserting "Test" before "Data"
        const breakPoint = dirName.length - 4;
        const testDir = dirName.slice(0, breakPoint) + "Test" + dirName.slice(breakPoint);

        // Fetch the corresponding test file
        fetchData(`/Pages/${testDir}/${fileName}`, day);
    });
});

// -------------------
// Go to Day.html Page
// -------------------
function goToDayPage(day, file) {
    window.location.href = `/Pages/Day.html?dir=${encodeURIComponent(dirName)}&file=${encodeURIComponent(file)}&day=${encodeURIComponent(day)}`;
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
                goToDayPage(day, `${fileNameBase}.json`);
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
    h1.textContent = `Day ${currentDay.day - 1} - Short Test`;
    testContent.append(h1);

    const form = document.createElement("form");

    currentDay.test.forEach((q, i) => {
        const qDiv = document.createElement("div");
        qDiv.className = "questions";

        const qP = document.createElement("p");
        qP.className = "qs";
        qP.textContent = `${i + 1}. ${q.question}`;
        qDiv.append(qP);

        const optDiv = document.createElement("div");
        optDiv.className = "options";

        Object.entries(q.options).forEach(([key, val]) => {
            const label = document.createElement("label");
            label.className = "radio-btn";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${i + 1}`;
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
    form.querySelectorAll(".questions").forEach(q => q.classList.remove("unanswered"));

    currentDay.test.forEach((_, i) => {
        if (!form.querySelector(`input[name="q${i + 1}"]:checked`)) unanswered.push(i);
    });

    if (unanswered.length) {
        unanswered.forEach(i => form.querySelectorAll(".questions")[i].classList.add("unanswered"));
        return;
    }

    let score = 0;

    currentDay.test.forEach((q, i) => {
        const selected = form.querySelector(`input[name="q${i + 1}"]:checked`).value.toUpperCase();
        const correct = getCorrectKey(q);
        const block = form.querySelectorAll(".questions")[i];

        if (selected === correct) {
            score++;
            block.querySelector(`input[value="${correct}"]`)?.parentElement.classList.add("option-correct");
        } else {
            block.querySelector(`input[value="${correct}"]`)?.parentElement.classList.add("option-correct");
            block.querySelector(`input[value="${selected}"]`)?.parentElement.classList.add("option-wrong");
        }
    });

    const passMark = Math.ceil(currentDay.test.length * 0.6);
    form.querySelector(".score").textContent = `Score: ${score}/${currentDay.test.length} - ${score >= passMark ? "✅ Passed" : "❌ Failed"}`;

    submitBtn.textContent = "Next Day";
    submitBtn.onclick = () => goToDayPage(parseInt(currentDay.day), `${fileNameBase}.json`);
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
