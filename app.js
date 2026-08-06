// fair-split — proportional bill splitting.
// State is one plain object; render() is the only thing that touches the DOM tree.

const state = {
  people: [
    { name: "Person 1", items: [{ label: "", amount: 0 }] },
  ],
  tax: 0,
  tip: 0,
};

const peopleEl = document.getElementById("people");
const resultsEl = document.getElementById("results");

function subtotal(person) {
  return person.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
}

// Distribute tax+tip proportionally. Leftover cents (from rounding) go to the
// largest share so the totals always reconcile to the exact bill.
function computeShares() {
  const subs = state.people.map(subtotal);
  const base = subs.reduce((a, b) => a + b, 0);
  const extras = (Number(state.tax) || 0) + (Number(state.tip) || 0);
  if (base === 0) return subs.map(() => 0);

  const raw = subs.map((s) => s + (s / base) * extras);
  const rounded = raw.map((v) => Math.round(v * 100) / 100);
  const drift = Math.round((base + extras - rounded.reduce((a, b) => a + b, 0)) * 100) / 100;
  if (drift !== 0) {
    const biggest = rounded.indexOf(Math.max(...rounded));
    rounded[biggest] = Math.round((rounded[biggest] + drift) * 100) / 100;
  }
  return rounded;
}

function render() {
  peopleEl.innerHTML = "";
  state.people.forEach((person, pi) => {
    const card = document.createElement("div");
    card.className = "person";

    const name = document.createElement("input");
    name.type = "text";
    name.value = person.name;
    name.setAttribute("aria-label", "Person name");
    name.addEventListener("input", (e) => { person.name = e.target.value; renderResults(); });
    card.appendChild(name);

    person.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "item";

      const label = document.createElement("input");
      label.type = "text";
      label.placeholder = "Item (e.g. jollof rice)";
      label.value = item.label;
      // ponytail: named for SR users; placeholder alone is not a name
      label.setAttribute("aria-label", `Item name for ${person.name || "person"}`);
      label.addEventListener("input", (e) => { item.label = e.target.value; });

      const amount = document.createElement("input");
      amount.type = "number";
      amount.min = "0";
      amount.step = "0.01";
      amount.placeholder = "0.00";
      amount.value = item.amount || "";
      amount.setAttribute("aria-label", `Item cost for ${person.name || "person"}`);
      amount.addEventListener("input", (e) => { item.amount = e.target.value; renderResults(); });

      row.append(label, amount);
      card.appendChild(row);
    });

    const addItem = document.createElement("button");
    addItem.type = "button";
    addItem.className = "small";
    addItem.textContent = "+ item";
    addItem.setAttribute("aria-label", `Add item for ${person.name || "person"}`);
    addItem.addEventListener("click", () => {
      person.items.push({ label: "", amount: 0 });
      render();
    });
    card.appendChild(addItem);

    peopleEl.appendChild(card);
  });
  renderResults();
}

function renderResults() {
  const shares = computeShares();
  const total = shares.reduce((a, b) => a + b, 0);
  resultsEl.innerHTML = "<h2>Who owes what</h2>";
  state.people.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${p.name || "(unnamed)"}</span><strong>${shares[i].toFixed(2)}</strong>`;
    resultsEl.appendChild(row);
  });
  const totalRow = document.createElement("div");
  totalRow.className = "row";
  totalRow.innerHTML = `<span>Total</span><strong>${total.toFixed(2)}</strong>`;
  resultsEl.appendChild(totalRow);
}

document.getElementById("add-person").addEventListener("click", () => {
  state.people.push({ name: `Person ${state.people.length + 1}`, items: [{ label: "", amount: 0 }] });
  render();
});

document.getElementById("tax").addEventListener("input", (e) => { state.tax = e.target.value; renderResults(); });
document.getElementById("tip").addEventListener("input", (e) => { state.tip = e.target.value; renderResults(); });

render();
