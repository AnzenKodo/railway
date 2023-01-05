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

const price = {
  "Second": {
    29: 30,
    27: 25,
    23: 20,
    17: 15,
    6: 10,
    0: 5,
  },
  "First": {
    31: 245,
    30: 240,
    29: 225,
    27: 210,
    25: 195,
    23: 170,
    22: 165,
    21: 160,
    20: 150,
    18: 145,
    15: 140,
    9: 105,
    6: 70,
    0: 50,
  },
  "AC": {
    26: 115,
    24: 105,
    21: 100,
    18: 95,
    12: 70,
    9: 50,
    4: 35,
  },
};
const websiteName = "ExpressEscape";
const upi = "aman.0830-7@waicici";

function getInfo() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("name")) return;

  const form = document.querySelector("form");
  form.hidden = true;

  let trainReturn = "";
  if (params.get("return")) {
    trainReturn =
      `<p><strong>Return Vaild Till:</strong> ${getDate().vaildReturn}</p>`;
  }
  const price = getPrice(
    params.get("station-from"),
    params.get("station-to"),
    params.get("class"),
    params.get("return"),
  );

  const info = document.getElementById("info");
  info.hidden = false;
  info.innerHTML = `<p><strong>Name:</strong> ${params.get("name")}</p>
  <p class="user-id"><strong>ID:</strong> ${
    Math.floor(Math.random() * 9999999999)
  }</p>
  <p><strong>Age:</strong> ${getAge(params.get("dob"))}
  <p><strong>Gender:</strong> ${params.get("sex")}
  <p><strong>Station From:</strong> ${params.get("station-from")}</p> 
  <p><strong>Station To:</strong> ${params.get("station-to")}</p>
  <p><strong>In:</strong> ${params.get("class")} Class</p>
  <p><strong>Booked At:</strong> ${getDate().now}</p>
  <p><strong>Valid Till:</strong> ${getDate().vaild}</p>
  ${trainReturn}  
  <p><strong>Price:</strong> ${price} Rupees</p>
  <div id="pay-info">
    <h2>Pay with UPI</h2>
    <p><strong>Scan QR Code</strong></p>
    <img src="${
    getQR(price, params.get("station-from"), params.get("station-to"))
  }" alt="UPI QR Code">
    <p>OR</p>
    <p><strong>UPI ID:</strong> <code>${upi}</code></p>
    <button id="paid">Paid</button>
  </div>
  `;

  const paid = document.getElementById("paid");
  const pay = document.getElementById("pay-info");
  paid.addEventListener("click", () => {
    pay.innerHTML = `<h2 class="paid-successful">Payment Successful</h2>
    <p><strong>Ticket ID:</strong> ${
      Math.floor(Math.random() * 999999999999999)
    }</p>
    <button id="print">Print PDF</button>`;

    const print = document.getElementById("print");
    print.addEventListener("click", () => window.print());
  });
}
getInfo();

function getQR(price, stationFrom, stationTo) {
  return `https://upiqr.in/api/qr?name=${websiteName}&vpa=${upi}&amount=${
    price + ".00"
  }&note=${
    `Train Ticket from ${stationFrom} to ${stationTo}`.substring(0, 50)
  }`;
}

function getPrice(stationFrom, stationTo, trainClass, trainReturn) {
  const index = stationNames.indexOf(stationFrom) -
    stationNames.indexOf(stationTo);

  const ticketPrice = Object.entries(price[trainClass])
    .filter((arr) => Math.abs(index) > arr[0])
    .at(-1)[1];

  if (trainReturn) return ticketPrice * 2;
  return ticketPrice;
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

function getAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const datalist = document.getElementById("stations-names");
stationNames.forEach((ele) => {
  const options = document.createElement("option");
  options.value = ele;
  // options.textContent = ele;
  datalist.appendChild(options);
});

const today = new Date();
const todayString = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate(),
);
const userDOB = document.getElementById("dob");
userDOB.max = todayString.toISOString().substring(0, 10);

const sendOTP = document.getElementById("send-otp");
const otpBox = document.getElementById("otp-box");
const otpTimer = document.getElementById("otp-timer");
const phone = document.getElementById("phone");

sendOTP.addEventListener("click", () => {
  const vaildPhone = document.querySelector("#phone:valid");
  if (!vaildPhone) {
    otpTimer.innerHTML =
      "<span class=\"warning\">Please enter 'Phone Number' in given format.</span>";
    return;
  }

  let min = 1;
  let sec = 0;
  sendOTP.disabled = true;
  sendOTP.title = "Please wait for the OTP to arrive";
  phone.disabled = true;

  const timer = setInterval(() => {
    sec--;

    if (sec < 0) {
      min--;
      sec = 59;
    }

    otpTimer.innerHTML =
      `Valid Till <span class="warning">${min}:${sec}<br></span>`;

    if (min < 0) {
      clearInterval(timer);
      otpBox.innerHTML = "";
      otpTimer.innerHTML = "";
      sendOTP.disabled = false;
      phone.disabled = false;
      sendOTP.title = "";
    }
  }, 1000);

  getOTP(timer);
});

function getOTP(timer) {
  const otpLabel = document.createElement("label");
  otpLabel.innerHTML = "OTP";
  otpLabel.setAttribute("for", "opt");
  otpBox.appendChild(otpLabel);

  const otp = document.createElement("input");
  otp.type = "tel";
  otp.id = "otp";
  otp.placeholder = "0000";
  otp.setAttribute("maxlength", "4");
  otp.required = true;
  otpBox.appendChild(otp);

  otp.addEventListener("input", (ele) => {
    const restForm = document.getElementById("rest-form");

    if (ele.target.value.length !== 4) return restForm.hidden = true;

    clearInterval(timer);
    otpTimer.innerHTML = "";
    otpBox.innerHTML = "";
    restForm.hidden = false;
  });
}
