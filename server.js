const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/analyze", (req, res) => {
  let results = [];

  req.pipe(req.busboy);
  req.busboy.on("file", (fieldname, file, filename) => {
    file
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const top5 = getTop5(results);
        res.send(top5);
      });
  });
});

function getTop5(results) {
  const subjects = ["Subject1", "Subject2", "Subject3", "Subject4", "Subject5"];
  const scores = {};
  for (const subject of subjects) {
    const subjectScores = results.map((result) => Number(result[subject]));
    const sortedScores = subjectScores.sort((a, b) => b - a);
    const top5Scores = sortedScores.slice(0, 5);
    const top5 = top5Scores.map((score) => {
      const index = subjectScores.indexOf(score);
      return results[index];
    });
    scores[subject] = top5;
  }
  return scores;
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
