// Paste your published Google Sheet CSV link here
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXQTKBJkRbw2Ugl7FNFIQ_1vNx8yuvkJJx-AbFkasg55NqQr4kWbw3Q_l4hQ5v5ciVZVkBpR274CsR/pub?output=csv";

// Which page section each value in the sheet's "Section" column goes into
const SECTION_IDS = {
  "Editors": "editors",
  "Staff": "team",
  "Faculty Advisors": "faculty-advisors"
};

// Makes a line like <p class="name"><b>Name:</b> Jane Doe</p>
function makeLine(className, label, value) {
  const line = document.createElement("p");
  line.className = className;
  const bold = document.createElement("b");
  bold.textContent = label;
  line.append(bold, " " + (value || ""));
  return line;
}

async function loadStaff() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error("Request failed: " + response.status);
    const csvText = await response.text();

    // Turn the CSV into a list of objects, using the first row as column names
    const rows = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

    rows.forEach(person => {
      // Skip rows whose Section doesn't match one of the page sections
      const container = document.getElementById(SECTION_IDS[person.Section?.trim()]);
      if (!container) return;

      const card = document.createElement("div");
      card.className = "staff";

      // Always add the photo so cards without one still keep the round placeholder
      const img = document.createElement("img");
      if (person.Photo) img.src = person.Photo;
      img.alt = person.Name || "";
      card.append(img);

      const content = document.createElement("div");
      content.className = "staff-content";

      content.append(
        makeLine("title", "Role:", person.Role),
        makeLine("name", "Name:", person.Name),
        makeLine("years", "Years on Staff:", person.Years)
      );

      // Email line with a clickable mailto link
      const email = makeLine("email", "Email:", "");
      const link = document.createElement("a");
      link.href = "mailto:" + (person.Email || "");
      link.textContent = person.Email || "";
      email.append(link);
      content.append(email);

      card.append(content);
      container.append(card);
    });
  } catch (error) {
    const message = document.createElement("p");
    message.textContent = "Couldn't load the staff list.";
    document.querySelector(".yearbook-staff").prepend(message);
    console.error(error);
  }
}

loadStaff();