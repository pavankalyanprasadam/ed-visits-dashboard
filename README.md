# Emergency Department Visits in the US (2016–2022) — Interactive Analysis Dashboard

An interactive, web-based dashboard for exploring U.S. emergency department (ED) visit estimates from 2016 to 2022 — built as the final project for **Advanced Data Visualization** (M.S. Computer Science, University of Central Missouri).

## What it does

- **Dynamic filtering** by year, sex, age group, and diagnosis — every chart and the data table update instantly
- **Bar charts** showing total visits over the years
- **Pie charts** showing visit proportions by demographic/diagnosis group
- **Line charts** visualizing yearly trends
- **Sortable, searchable data table** reflecting the active filters
- **Export** filtered datasets and charts for stakeholder reporting

## Tech stack

HTML · CSS · JavaScript · [Plotly.js](https://plotly.com/javascript/) (interactive charts) · [PapaParse](https://www.papaparse.com/) (client-side CSV parsing)

Everything runs client-side in the browser — no backend, no build step. Open `index.html` and it works.

## Dataset

Estimates of U.S. emergency department visits, 2016–2022. The dashboard is designed around yearly visit counts broken down by sex, age group, and diagnosis category. A sample dataset in the expected format is included in `data/` — drop in the full CSV to explore the complete series.

## Run it

```bash
# any static file server works; e.g. with Python:
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Project structure

```
├── index.html        # dashboard layout
├── css/styles.css    # styling
├── js/app.js         # filtering logic, chart rendering (Plotly.js)
├── js/data.js        # data loading via PapaParse
└── data/sample.csv   # sample dataset (same schema as full data)
```

## Team

Built by a team of 3 (Pavankalyan Prasadam, Sudhakar Reddy M, Mukesh Kumar P) as the ADV final project.
