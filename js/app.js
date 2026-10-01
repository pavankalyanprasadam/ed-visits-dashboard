// ED Visits dashboard — filtering, charting (Plotly.js), table, and export.
const GROUPS = ["Total", "Sex", "Age", "Diagnosis"];
const COLS = ["Year", "Group", "Subgroup", "Visits_thousands"];

let ALL_ROWS = [];
const state = {
  year: "all",
  group: "Total",
  subgroup: "All",
  chart: "bar",
  search: "",
  sortKey: null,
  sortDir: 1
};

const $ = (id) => document.getElementById(id);

function uniqueYears() {
  return [...new Set(ALL_ROWS.map((r) => r.Year))].sort((a, b) => a - b);
}

function subgroupsFor(group) {
  return [...new Set(ALL_ROWS.filter((r) => r.Group === group).map((r) => r.Subgroup))];
}

function matchYear(r) {
  return state.year === "all" || String(r.Year) === String(state.year);
}

function initFilters() {
  $("yearFilter").innerHTML =
    `<option value="all">All years</option>` +
    uniqueYears().map((y) => `<option value="${y}">${y}</option>`).join("");
  $("groupFilter").innerHTML = GROUPS.map(
    (g) => `<option value="${g}">${g === "Total" ? "Total" : "By " + g}</option>`
  ).join("");
  refreshSubgroups();
}

function refreshSubgroups() {
  const subs = subgroupsFor(state.group);
  if (!subs.includes(state.subgroup)) state.subgroup = subs[0];
  $("subgroupFilter").innerHTML = subs
    .map((s) => `<option value="${s}"${s === state.subgroup ? " selected" : ""}>${s}</option>`)
    .join("");
}

function sliceRows() {
  return ALL_ROWS.filter(
    (r) => matchYear(r) && r.Group === state.group && r.Subgroup === state.subgroup
  );
}

function renderChart() {
  const yearLabel = state.year === "all" ? "all years" : state.year;
  let data, title;

  if (state.chart === "pie") {
    // Share by subgroup within the selected group and year(s).
    const agg = {};
    ALL_ROWS.filter((r) => matchYear(r) && r.Group === state.group).forEach((r) => {
      agg[r.Subgroup] = (agg[r.Subgroup] || 0) + r.Visits_thousands;
    });
    data = [{ labels: Object.keys(agg), values: Object.values(agg), type: "pie" }];
    title = `Share by subgroup — ${state.group} (${yearLabel})`;
  } else {
    const byYear = {};
    sliceRows().forEach((r) => {
      byYear[r.Year] = (byYear[r.Year] || 0) + r.Visits_thousands;
    });
    const xs = Object.keys(byYear).sort();
    const ys = xs.map((x) => byYear[x]);
    const isLine = state.chart === "line";
    data = [
      {
        x: xs,
        y: ys,
        type: isLine ? "scatter" : "bar",
        ...(isLine ? { mode: "lines+markers" } : {}),
        name: "Visits (thousands)",
        marker: { color: "#2563eb" }
      }
    ];
    title = `${state.group === "Total" ? "Total visits" : state.group + " — " + state.subgroup} (${yearLabel})`;
  }

  Plotly.newPlot(
    "chart",
    data,
    { title, margin: { t: 50, l: 60, r: 20, b: 50 }, xaxis: { title: "Year" }, yaxis: { title: "Visits (thousands)" } },
    { responsive: true, displaylogo: false }
  );
}

function renderTable() {
  let rows = ALL_ROWS.filter(
    (r) =>
      matchYear(r) &&
      r.Group === state.group &&
      r.Subgroup === state.subgroup &&
      (state.search === "" ||
        Object.values(r).join(" ").toLowerCase().includes(state.search))
  );

  if (state.sortKey) {
    rows = [...rows].sort((a, b) => {
      const va = a[state.sortKey], vb = b[state.sortKey];
      return (va > vb ? 1 : va < vb ? -1 : 0) * state.sortDir;
    });
  }

  const thead =
    "<tr>" +
    COLS.map(
      (c) =>
        `<th data-key="${c}">${c.replace("_thousands", " (k)")}${
          state.sortKey === c ? (state.sortDir === 1 ? " ▲" : " ▼") : ""
        }</th>`
    ).join("") +
    "</tr>";
  const tbody = rows
    .map((r) => `<tr>${COLS.map((c) => `<td>${r[c].toLocaleString()}</td>`).join("")}</tr>`)
    .join("");

  $("dataTable").innerHTML = `<thead>${thead}</thead><tbody>${tbody}</tbody>`;
  $("rowCount").textContent = `${rows.length} row${rows.length === 1 ? "" : "s"}`;

  $("dataTable").querySelectorAll("th").forEach((th) => {
    th.addEventListener("click", () => {
      const k = th.dataset.key;
      if (state.sortKey === k) state.sortDir *= -1;
      else {
        state.sortKey = k;
        state.sortDir = 1;
      }
      renderTable();
    });
  });
}

function exportCSV() {
  const rows = ALL_ROWS.filter(
    (r) => matchYear(r) && r.Group === state.group && r.Subgroup === state.subgroup
  );
  const blob = new Blob([Papa.unparse(rows)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ed_visits_filtered.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function bindEvents() {
  $("yearFilter").addEventListener("change", (e) => {
    state.year = e.target.value;
    render();
  });
  $("groupFilter").addEventListener("change", (e) => {
    state.group = e.target.value;
    refreshSubgroups();
    render();
  });
  $("subgroupFilter").addEventListener("change", (e) => {
    state.subgroup = e.target.value;
    render();
  });
  document.querySelectorAll(".chart-toggle button").forEach((b) => {
    b.addEventListener("click", () => {
      state.chart = b.dataset.chart;
      document
        .querySelectorAll(".chart-toggle button")
        .forEach((x) => x.classList.toggle("active", x === b));
      renderChart();
    });
  });
  $("searchBox").addEventListener("input", (e) => {
    state.search = e.target.value.toLowerCase();
    renderTable();
  });
  $("exportBtn").addEventListener("click", exportCSV);
}

function render() {
  renderChart();
  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  loadData((rows) => {
    ALL_ROWS = rows;
    initFilters();
    bindEvents();
    render();
  });
});
