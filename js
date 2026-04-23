const API = "http://localhost:5000/unscramble";

async function unscramble() {
  const input = document.getElementById("input").value.trim();
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("count");
  const loading = document.getElementById("loading");

  if (!input) {
    alert("Enter letters!");
    return;
  }

  resultsEl.innerHTML = "";
  countEl.textContent = "";
  loading.classList.remove("hidden");

  try {
    const res = await fetch(`${API}?letters=${input}`);
    const data = await res.json();

    loading.classList.add("hidden");

    countEl.textContent = `Found ${data.count} words`;

    data.words.forEach((word, index) => {
      const li = document.createElement("li");

      if (index === 0) {
        li.innerHTML = `<b>${word} (longest)</b>`;
      } else {
        li.textContent = word;
      }

      resultsEl.appendChild(li);
    });

  } catch (err) {
    loading.classList.add("hidden");
    alert("Error connecting to server");
  }
}

function clearInput() {
  document.getElementById("input").value = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("count").textContent = "";
}

// Enter key support
document.getElementById("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    unscramble();
  }
});