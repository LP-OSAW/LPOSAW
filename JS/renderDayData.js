let h1 = document.querySelector("h1");
let h2 = document.querySelector("h2");

const params = new URLSearchParams(window.location.search);
const dirName = params.get("dir");
const fileName = params.get("file");

console.log("Directory Name:", dirName);
console.log("File Name:", fileName);

let filePath = `${dirName}/${fileName}`; // Use relative path
console.log("File Path:", filePath);


fetch(`${dirName}/${fileName}`) // Use relative path
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

