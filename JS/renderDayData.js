let h1 = document.querySelector("h1");
let h2 = document.querySelector("h2");

fetch('TechnologyData/keyboard.json') // Use relative path
  .then(res => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json(); // Parse JSON here
  })
  .then(data => {
    console.log(data);
    h1.textContent = data.title || "No title found";
    h2.textContent = "Day: " + data.day;
  })
  .catch(err => {
    console.error("Caught error:", err);
  });
