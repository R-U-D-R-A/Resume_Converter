const TEMPLATE_NAME = "/static/template.pptx";

// ================= UPLOAD + PARSE =================
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('resumeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    if (!fileInput.files.length) return alert("Please select a file!");

    uploadBtn.textContent = "Generating...";
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("/upload_resume", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById("name").value = data.name || "";
            document.getElementById("designation").value = data.designation || "";
            document.getElementById("years").value = data.years || "";
            document.getElementById("forte").value = data.forte1 || "";
            document.getElementById("forte1").value = data.forte2 || "";
            document.getElementById("description").value = data.description || "";

            for (let i = 0; i < 5; i++) {
                document.getElementById(`p1_resp${i}`).value = (data.p1_resp && data.p1_resp[i]) || "";
                document.getElementById(`p2_resp${i}`).value = (data.p2_resp && data.p2_resp[i]) || "";
                document.getElementById(`p3_resp${i}`).value = (data.p3_resp && data.p3_resp[i]) || "";
            }

            document.getElementById("p1_title").value = data.p1_title || "";
            document.getElementById("p1_desc").value = data.p1_desc || "";
            document.getElementById("p2_title").value = data.p2_title || "";
            document.getElementById("p2_desc").value = data.p2_desc || "";
            document.getElementById("p3_title").value = data.p3_title || "";
            document.getElementById("p3_desc").value = data.p3_desc || "";

            document.getElementById("prog").value = data.prog || "";
            document.getElementById("db").value = data.db || "";
            document.getElementById("tech").value = data.tech || "";
            document.getElementById("report").value = data.report || "";
            document.getElementById("misc").value = data.misc || "";

            document.getElementById("degree").value = data.degree || "";
            document.getElementById("college").value = data.college || "";

            for (let i = 1; i <= 10; i++) {
                document.getElementById(`cert${i}`).value = data[`cert${i}`] || "";
            }

            uploadBtn.textContent = "Re-Generate";
        } else {
            alert("Error: " + data.error);
            uploadBtn.textContent = "Upload & Parse";
        }

    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
        uploadBtn.textContent = "Upload & Parse";
    }

    uploadBtn.disabled = false;
});


// ================= COLLECT FORM DATA =================
function collectData() {
  return {
    name: cleanInput(document.getElementById("name").value),
    designation: cleanInput(document.getElementById("designation").value),
    experiance: cleanInput(document.getElementById("years").value),
    forte: cleanInput(document.getElementById("forte").value),
    forte1: cleanInput(document.getElementById("forte1").value),
    description: cleanInput(document.getElementById("description").value),

    project1: cleanInput(document.getElementById("p1_title").value),
    Project1description: cleanInput(document.getElementById("p1_desc").value),

    project2: cleanInput(document.getElementById("p2_title").value),
    Project2description: cleanInput(document.getElementById("p2_desc").value),

    project3: cleanInput(document.getElementById("p3_title").value),
    Project3description: cleanInput(document.getElementById("p3_desc").value),

    programinglanguage: cleanInput(document.getElementById("prog").value),
    database: cleanInput(document.getElementById("db").value),
    technologies: cleanInput(document.getElementById("tech").value),
    reportandanalytics: cleanInput(document.getElementById("report").value),
    miscellaneous: cleanInput(document.getElementById("misc").value),

    degree: cleanInput(document.getElementById("degree").value),
    collegename: cleanInput(document.getElementById("college").value),

    ...Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [
        `cert${i+1}`, cleanInput(document.getElementById(`cert${i+1}`).value)
      ])
    )
  };
}


// ================= PPT GENERATION =================
async function fetchArrayBuffer(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Template not found");
  return await res.arrayBuffer();
}

function encodeForPptx(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<a:br/>");
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function updatePptx(data) {
  const buffer = await fetchArrayBuffer(TEMPLATE_NAME);
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/i.test(f));

  for (const filePath of slideFiles) {
    let xml = await zip.file(filePath).async("string");

    Object.keys(data).forEach(key => {
      const pattern = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
      xml = xml.replace(pattern, encodeForPptx(data[key]));
    });

    zip.file(filePath, xml);
  }

  return await zip.generateAsync({ type: "blob" });
}


// ================= GENERATE BUTTON =================
document.getElementById("generateBtn").addEventListener("click", async function () {
  const btn = this;
  const statusEl = document.getElementById("status");

  try {
    btn.disabled = true;
    statusEl.textContent = "Generating PPT...";

    const data = collectData();
    const blob = await updatePptx(data);

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Updated_Resume.pptx";
    a.click();

    statusEl.textContent = "Done! Download started.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error generating PPT";
  } finally {
    btn.disabled = false;
  }
});


// ================= CLEAN =================
function cleanInput(s) {
  if (!s) return "";
  return s.replace(/\*{2,}/g, "").replace(/^\*+|\*+$/g, "").trim();
}
