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

console.log("Directory Name:", dirName);
console.log("File Name:", fileName);

let filePath = `${ dirName }/${ fileName }`;
console.log("File Path:", filePath);

// Fetch JSON data
fetch(filePath)
  .then(res => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  })
  .then(data => {
    renderDayData(data);
    console.log("Data:", data);
  })
  .catch(err => {
    console.error("Caught error:", err);
  });

// Main render function
function renderDayData(data) {
  title.textContent = data.title || "No title found";
  dayNo.textContent = "Day " + data.day;

  if (imgContainer && data.img) {
    imgContainer.innerHTML = `<img src="${ data.img }" alt="Day ${ data.day } Image">`;
  }

  intro.textContent = data.intro || "No introduction available for this day.";

  if (topicsList && data.topics) {
    renderTopics(data.topics);
  }

  if (activityList && data.activity) {
    renderActivities(data.activity);
  }

  if (theoryContainer && data.theory) {
    renderTheory(data.theory);
  } else {
    console.warn("No theory data found or .theory container is missing.");
  }
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

// Render theory content
function renderTheory(theory) {
  theoryContainer.innerHTML = "";

  // Add <h2>Theory</h2> once at the top
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
            // Handle shortcut table
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
        <td>${ rowData["Description"] }</td>
      `;
              tbody.appendChild(tr);
            }

            table.appendChild(tbody);
            sectionDiv.appendChild(table);
            break; // Exit loop after rendering the table
          } else if (typeof value === "object") {
            // Handle normal key-value object (like Windows/Mac platforms)
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

document.addEventListener("DOMContentLoaded", () => {
  const sections = ["topics", "theory", "activity"];
  const listItems = document.querySelectorAll(".idx-list li");

  function onScroll() {
    let current = "";

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

  // Optional: set active on click too
  document.querySelectorAll(".idx-list li a").forEach(link => {
    link.addEventListener("click", () => {
      listItems.forEach(li => li.classList.remove("active"));
      link.parentElement.classList.add("active");
    });
  });
});
