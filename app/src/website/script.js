const stationNames = [
  "Churchgate",
  "Marine Lines",
  "Charni Road",
  "Grant Road",
  "Mumbai Central",
  "Mahalaxmi",
  "Lower Parel",
  "Prabhadevi",
  "Dadar",
  "Matunga Road",
  "Mahim Junction",
  "Bandra",
  "Khar Road",
  "Santacruz",
  "Vile Parle",
  "Andheri",
  "Jogeshwari",
  "Ram Mandir",
  "Goregaon",
  "Malad",
  "Kandivali",
  "Borivali",
  "Dahisar",
  "Mira Road",
  "Bhayandar",
  "Naigaon",
  "Vasai Road",
  "Nallasopara",
  "Virar",
  "Vaitarna",
  "Saphale",
  "Kelve Road",
  "Palghar",
  "Umroli",
  "Boisar",
  "Vangaon",
  "Dahanu Road",
];

const datalist = document.getElementById("stations-names");
stationNames.forEach((ele) => {
  const options = document.createElement("option");
  options.value = ele;
  // options.textContent = ele;
  datalist.appendChild(options);
});

const stationFrom = document.getElementById("station-from");
const stationTo = document.getElementById("station-to");
const trainsType = document.querySelectorAll(
  'input[name="train-type"]',
);

stationClick(stationFrom);
stationClick(stationTo);
Array.from(trainsType).map((trainType) => stationClick(trainType));

function stationClick(element) {
  const stationInfo = document.getElementById("stations-info");
  element.addEventListener("change", () => {
    const index = stationNames.indexOf(stationFrom.value) -
      stationNames.indexOf(stationTo.value);
    stationInfo.textContent = getPrice(index);
  });
}

// TODO: Pricing object with class, price, after station values
function getPrice(index) {
  const trainTypeChecked = document.querySelector(
    'input[name="train-type"]:checked',
  );
  const type = trainTypeChecked ? trainTypeChecked.value : "second";

  index = Math.abs(index);
  let price = 0;

  if (type === "second") {
    if (index > 29) {
      price = 30;
    } else if (index > 27) {
      price = 25;
    } else if (index > 23) {
      price = 20;
    } else if (index > 17) {
      price = 15;
    } else if (index > 6) {
      price = 10;
    } else if (index > 0) {
      price = 5;
    } else {
      price = 0;
    }
  }

  return price;
}

function getDate() {
  const date = new Date();
  const till = new Date(date.getTime() + 60 * 60 * 1000);
  const tillReturn = new Date(date.getTime());
  tillReturn.setHours(tillReturn.getHours() + 24);

  const format = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return {
    now: date.toLocaleDateString([], format),
    vaild: till.toLocaleString([], format),
    vaildReturn: tillReturn.toLocaleString([], format),
  };
}
