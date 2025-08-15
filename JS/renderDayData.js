// DOM element references
let title = document.querySelector(".title");
let dayNo = document.querySelector(".dayNo");
let imgContainer = document.querySelector(".img");
let intro = document.querySelector(".intro");
let topicsList = document.querySelector(".topics-list");
let activityList = document.querySelector(".activity-list");
let theoryContainer = document.querySelector(".theory");

// Get query parameters from URL
const params = new URLSearchParams(window.location.search);
const dirName = params.get("dir");
const fileName = params.get("file");
const day = params.get("day"); // fallback to Day 1

console.log("Parsed Day:", day); //

let filePath = `${ dirName }/${ fileName }`;

// Fetch JSON data for all days
fetch(filePath)
  .then(res => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  })
  .then(days => {
    const currentDay = days.find(d => d.day == day);
    if (currentDay) {
      renderDayData(currentDay);
    } else {
      throw new Error(`Day ${ day } not found in the data.`);
    }
  })
  .catch(err => {
    console.error("Caught error:", err);
    theoryContainer.innerHTML = `<p style="color: red;">Error loading content: ${ err.message }</p>`;
  });

// Main render function
function renderDayData(data) {
  title.textContent = data.title || "No title found";
  dayNo.textContent = "Day " + data.day;

  if (imgContainer && data.img) {
    imgContainer.innerHTML = `<img src="${ data.img }" alt="Day ${ data.day } Image">`;
  }

  intro.textContent = data.intro || "No introduction available for this day.";

  if (topicsList && data.topics) renderTopics(data.topics);
  if (activityList && data.activity) renderActivities(data.activity);
  if (theoryContainer && data.theory) renderTheory(data.theory);
  else console.warn("No theory data found or .theory container is missing.");
}

// Render topics
function renderTopics(topics) {
  topicsList.innerHTML = "";
  if (Array.isArray(topics) && topics.length > 0) {
    topics.forEach(topic => {
      const li = document.createElement("li");
      li.textContent = topic;
      topicsList.appendChild(li);
    });
  } else {
    topicsList.innerHTML = "<li>No topics available for this day.</li>";
  }
}

// Render activities
function renderActivities(activities) {
  activityList.innerHTML = "";
  if (Array.isArray(activities) && activities.length > 0) {
    activities.forEach(activity => {
      const li = document.createElement("li");
      li.textContent = activity;
      activityList.appendChild(li);
    });
  } else {
    activityList.innerHTML = "<li>No activities available for this day.</li>";
  }
}

// Render theory
function renderTheory(theory) {
  theoryContainer.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.textContent = "Theory";
  theoryContainer.appendChild(h2);

  if (typeof theory === "object") {
    for (const sectionTitle in theory) {
      const sectionContent = theory[sectionTitle];
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("theory-section");

      const heading = document.createElement("h3");
      heading.textContent = sectionTitle;
      sectionDiv.appendChild(heading);

      if (typeof sectionContent === "string") {
        const para = document.createElement("p");
        para.textContent = sectionContent;
        sectionDiv.appendChild(para);
      } else if (typeof sectionContent === "object") {
        for (const key in sectionContent) {
          const value = sectionContent[key];

          if (
            typeof value === "object" &&
            "Windows Shortcut" in value &&
            "Mac Shortcut" in value &&
            "Description" in value
          ) {
            // Shortcut table
            const table = document.createElement("table");
            table.classList.add("shortcut-table");

            const thead = document.createElement("thead");
            thead.innerHTML = `
              <tr>
                <th>Function</th>
                <th>Windows Shortcut</th>
                <th>Mac Shortcut</th>
                <th>Description</th>
              </tr>`;
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            for (const func in sectionContent) {
              const rowData = sectionContent[func];
              const tr = document.createElement("tr");
              tr.innerHTML = `
                <td>${ func }</td>
                <td>${ rowData["Windows Shortcut"] }</td>
                <td>${ rowData["Mac Shortcut"] }</td>
                <td>${ rowData["Description"] }</td>`;
              tbody.appendChild(tr);
            }

            table.appendChild(tbody);
            sectionDiv.appendChild(table);
            break;
          } else if (typeof value === "object") {
            const subHeading = document.createElement("h4");
            subHeading.textContent = key;
            sectionDiv.appendChild(subHeading);

            const ul = document.createElement("ul");
            for (const subKey in value) {
              const li = document.createElement("li");
              li.innerHTML = `<strong>${ subKey }:</strong> ${ value[subKey] }`;
              ul.appendChild(li);
            }
            sectionDiv.appendChild(ul);
          }
        }
      }

      theoryContainer.appendChild(sectionDiv);
    }
  } else {
    theoryContainer.textContent = "No detailed theory available.";
  }
}

// Scroll spy and click highlight for nav list
document.addEventListener("DOMContentLoaded", () => {
  const sections = ["topics", "theory", "activity"];
  const listItems = document.querySelectorAll(".idx-list li");
  let current = "topics";

  function onScroll() {
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 150) {
        current = id;
      }
    });
    listItems.forEach(li => {
      const link = li.querySelector("a");
      const target = link?.getAttribute("href")?.substring(1);
      li.classList.toggle("active", target === current);
    });
  }

  window.addEventListener("scroll", onScroll);

  document.querySelectorAll(".idx-list li a").forEach(link => {
    link.addEventListener("click", () => {
      listItems.forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");
    });
  });
});

// Preloader functionality 
window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');

  // Show preloader for at least 5 seconds
  setTimeout(() => {
    // Hide preloader with fade out
    preloader.style.opacity = '0';

    // After transition (0.5s), remove preloader from DOM
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }, 3000);
});
