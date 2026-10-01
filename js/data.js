// Data loading for the ED Visits dashboard.
// Tries data/sample.csv first (so a full dataset can be dropped into data/),
// falls back to the embedded synthetic sample when opened via file://.
const SAMPLE_CSV = "Year,Group,Subgroup,Visits_thousands\n2016,Total,All,141238\n2016,Sex,Female,76583\n2016,Sex,Male,64655\n2016,Age,0-17,26385\n2016,Age,18-24,13547\n2016,Age,25-44,38941\n2016,Age,45-64,30270\n2016,Age,65+,32092\n2016,Diagnosis,Injury,34723\n2016,Diagnosis,Respiratory,20440\n2016,Diagnosis,Cardiovascular,15946\n2016,Diagnosis,Digestive,13242\n2016,Diagnosis,Other,56884\n2017,Total,All,140931\n2017,Sex,Female,76177\n2017,Sex,Male,64754\n2017,Age,0-17,24665\n2017,Age,18-24,14602\n2017,Age,25-44,39823\n2017,Age,45-64,30397\n2017,Age,65+,31442\n2017,Diagnosis,Injury,34584\n2017,Diagnosis,Respiratory,18280\n2017,Diagnosis,Cardiovascular,17716\n2017,Diagnosis,Digestive,14604\n2017,Diagnosis,Other,55743\n2018,Total,All,137273\n2018,Sex,Female,74718\n2018,Sex,Male,62555\n2018,Age,0-17,25716\n2018,Age,18-24,12776\n2018,Age,25-44,38531\n2018,Age,45-64,30145\n2018,Age,65+,30103\n2018,Diagnosis,Injury,32747\n2018,Diagnosis,Respiratory,18214\n2018,Diagnosis,Cardiovascular,16588\n2018,Diagnosis,Digestive,12873\n2018,Diagnosis,Other,56847\n2019,Total,All,136645\n2019,Sex,Female,75296\n2019,Sex,Male,61349\n2019,Age,0-17,24951\n2019,Age,18-24,13689\n2019,Age,25-44,38410\n2019,Age,45-64,29626\n2019,Age,65+,29966\n2019,Diagnosis,Injury,32613\n2019,Diagnosis,Respiratory,19004\n2019,Diagnosis,Cardiovascular,16353\n2019,Diagnosis,Digestive,12936\n2019,Diagnosis,Other,55738\n2020,Total,All,123144\n2020,Sex,Female,67433\n2020,Sex,Male,55711\n2020,Age,0-17,22061\n2020,Age,18-24,13143\n2020,Age,25-44,33665\n2020,Age,45-64,26748\n2020,Age,65+,27524\n2020,Diagnosis,Injury,29976\n2020,Diagnosis,Respiratory,17647\n2020,Diagnosis,Cardiovascular,13687\n2020,Diagnosis,Digestive,12615\n2020,Diagnosis,Other,49217\n2021,Total,All,138005\n2021,Sex,Female,74973\n2021,Sex,Male,63032\n2021,Age,0-17,24145\n2021,Age,18-24,14927\n2021,Age,25-44,38450\n2021,Age,45-64,30066\n2021,Age,65+,30414\n2021,Diagnosis,Injury,34276\n2021,Diagnosis,Respiratory,20205\n2021,Diagnosis,Cardiovascular,15909\n2021,Diagnosis,Digestive,12585\n2021,Diagnosis,Other,55027\n2022,Total,All,138193\n2022,Sex,Female,74807\n2022,Sex,Male,63386\n2022,Age,0-17,25804\n2022,Age,18-24,13891\n2022,Age,25-44,38976\n2022,Age,45-64,29367\n2022,Age,65+,30153\n2022,Diagnosis,Injury,34191\n2022,Diagnosis,Respiratory,19720\n2022,Diagnosis,Cardiovascular,15578\n2022,Diagnosis,Digestive,12809\n2022,Diagnosis,Other,55892";

function normalize(rows) {
  return (rows || [])
    .filter(r => r.Year !== undefined && r.Year !== null && r.Year !== "")
    .map(r => ({
      Year: Number(r.Year),
      Group: String(r.Group),
      Subgroup: String(r.Subgroup),
      Visits_thousands: Number(r.Visits_thousands)
    }));
}

function loadData(onReady) {
  const fallback = () => onReady(normalize(Papa.parse(SAMPLE_CSV, { header: true }).data));
  try {
    Papa.parse("data/sample.csv", {
      download: true,
      header: true,
      complete: (res) => {
        const rows = normalize(res.data);
        if (rows.length) onReady(rows); else fallback();
      },
      error: fallback
    });
  } catch (e) { fallback(); }
}
