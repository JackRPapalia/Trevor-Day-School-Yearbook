// Paste your published Google Sheet CSV link here
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXQTKBJkRbw2Ugl7FNFIQ_1vNx8yuvkJJx-AbFkasg55NqQr4kWbw3Q_l4hQ5v5ciVZVkBpR274CsR/pub?output=csv";

// Which page section each value in the sheet's "Section" column goes into
// (left side = text in the sheet, right side = id of the <section> in staff.html)
const SECTION_IDS = {
  "Editors": "editors",
  "Staff": "team",
  "Faculty Advisors": "faculty-advisors"
};

// Makes a line like <p class="name"><b>Name:</b> Jane Doe</p>
function makeLine(className, label, value) {
  const line = document.createElement("p"); // The paragraph that holds the whole line
  line.className = className; // CSS class, e.g. "name" or "email"
  const bold = document.createElement("b"); // Bold tag for the label
  bold.textContent = label; // Label text, e.g. "Name:"
  line.append(bold, " " + (value || "")); // Add the label, then the value (or nothing if the cell is blank)
  return line; // Hand the finished line back to the caller
}

// Downloads the staff sheet and adds a card for each person to the staff page
async function loadStaff() {
  try {
    const response = await fetch(SHEET_URL); // Request the sheet as CSV
    if (!response.ok) throw new Error("Request failed: " + response.status); // Jump to the catch block if the request failed
    const csvText = await response.text(); // Read the response as plain text

    // Turn the CSV into a list of objects, using the first row as column names
    // (header: true uses row 1 as keys like person.Name; skipEmptyLines ignores blank rows)
    const rows = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

    // Build one card for each row (person) in the sheet
    rows.forEach(person => {
      // Skip rows whose Section doesn't match one of the page sections
      // (?.trim() removes stray spaces and avoids an error if the cell is empty)
      const container = document.getElementById(SECTION_IDS[person.Section?.trim()]);
      if (!container) return;

      // Outer white card for this person
      const card = document.createElement("div");
      card.className = "staff"; // Styled by .staff in style.css

      // Always add the photo so cards without one still keep the round placeholder
      const img = document.createElement("img");
      if (person.Photo) img.src = person.Photo; // Photo URL from the sheet's "Photo" column
      img.alt = person.Name || ""; // Alt text for screen readers, using the person's name
      card.append(img); // Photo goes on the left side of the card

      // Text column next to the photo
      const content = document.createElement("div");
      content.className = "staff-content"; // Styled by .staff-content in style.css

      // Role, name, and years lines
      content.append(
        makeLine("title", "Role:", person.Role), // From the "Role" column
        makeLine("name", "Name:", person.Name), // From the "Name" column
        makeLine("years", "Years on Staff:", person.Years) // From the "Years" column
      );

      // Email line with a clickable mailto link
      const email = makeLine("email", "Email:", ""); // Label only; the link is added below
      const link = document.createElement("a");
      link.href = "mailto:" + (person.Email || ""); // Clicking opens the visitor's email app
      link.textContent = person.Email || ""; // Shows the email address as the link text
      email.append(link); // Put the link after the "Email:" label
      content.append(email); // Add the email line to the text column

      // Put the finished card into its section on the page
      card.append(content); // Text column goes to the right of the photo
      container.append(card); // Add the card to the Editors, Staff, or Faculty Advisors section
    });
  } catch (error) {
    // If the sheet can't be loaded, show a message at the top of the staff list
    const message = document.createElement("p");
    message.textContent = "Couldn't load the staff list.";
    document.querySelector(".yearbook-staff").prepend(message); // prepend = add as the first item
    console.error(error); // Log the full error in the browser console for debugging
  }
}

// Build the staff list as soon as the script loads
loadStaff();
