import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const PORT = 5000;

// Load dictionary
const words = fs.readFileSync("./words.txt", "utf-8")
  .split("\n")
  .map(w => w.trim().toLowerCase());

// Convert dictionary to set for fast lookup
const wordSet = new Set(words);

// Helper: check if word can be formed from letters
function canFormWord(word, letters) {
  const letterCount = {};

  for (let l of letters) {
    letterCount[l] = (letterCount[l] || 0) + 1;
  }

  for (let char of word) {
    if (!letterCount[char]) return false;
    letterCount[char]--;
  }

  return true;
}

app.get("/unscramble", (req, res) => {
  const { letters } = req.query;

  if (!letters) {
    return res.status(400).json({ error: "No letters provided" });
  }

  const input = letters.toLowerCase();

  // Filter dictionary instead of brute force permutations
  const results = words.filter(word =>
    word.length <= input.length && canFormWord(word, input)
  );

  // Remove duplicates and sort
  const unique = [...new Set(results)];

  unique.sort((a, b) => {
    if (b.length === a.length) return a.localeCompare(b);
    return b.length - a.length;
  });

  res.json({
    count: unique.length,
    words: unique
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});