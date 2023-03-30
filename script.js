document.querySelector("#csv-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const csvFile = document.querySelector("#csv-file").files[0];
  const formData = new FormData();
  formData.append("file", csvFile);

  fetch("/analyze", {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      const top5Table = document.querySelector("#top-5");
      top5Table.innerHTML =
        "<tr><th>Rank</th><th>Roll No.</th><th>Name</th><th>Subject1</th><th>Subject2</th><th>Subject3</th><th>Subject4</th><th>Subject5</th><th>Total</th></tr>";

      for (const subject in data) {
        const top5 = data[subject];
        for (let i = 0; i < top5.length; i++) {
          const rank = i + 1;
          const row = document.createElement("tr");
          row.innerHTML = `<td>${rank}</td><td>${top5[i].RollNo}</td><td>${top5[i].Name}</td><td>${top5[i].Subject1}</td><td>${top5[i].Subject2}</td><td>${top5[i].Subject3}</td><td>${top5[i].Subject4}</td><td>${top5[i].Subject5}</td><td>${top5[i].Total}</td>`;
          top5Table.appendChild(row);
        }
      }

      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
