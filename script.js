const TEMPLATE_NAME = "BytePX Formet (1) (2) (2) (1).pptx";

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('resumeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    if (!fileInput.files.length) return alert("Please select a file!");

    // Set loading UI
    uploadBtn.textContent = "Generating...";
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("http://127.0.0.1:5000/upload_resume", { 
            method: "POST", 
            body: formData
        });

        const data = await res.json();
        console.log("Received:", data);

        if (res.ok) {
            document.getElementById("name").value = data.name || "";
        document.getElementById("designation").value = data.designation || "";
        document.getElementById("years").value = data.years || "";
        document.getElementById("forte").value = data.forte1 || "";
        document.getElementById("forte1").value = data.forte2 || "";
        document.getElementById("description").value = data.description || "";

        // ---------- Project 1 ----------
            document.getElementById("p1_title").value = data.p1_title || "";
            document.getElementById("p1_desc").value = data.p1_desc || "";
            // Project 1 Responsibilities without loop
            document.getElementById("p1_resp0").value = (data.p1_resp && data.p1_resp[0]) || "";
            document.getElementById("p1_resp1").value = (data.p1_resp && data.p1_resp[1]) || "";
            document.getElementById("p1_resp2").value = (data.p1_resp && data.p1_resp[2]) || "";
            document.getElementById("p1_resp3").value = (data.p1_resp && data.p1_resp[3]) || "";
            document.getElementById("p1_resp4").value = (data.p1_resp && data.p1_resp[4]) || "";


            // ---------- Project 2 ----------
            document.getElementById("p2_title").value = data.p2_title || "";
            document.getElementById("p2_desc").value = data.p2_desc || "";
            document.getElementById("p2_resp0").value = (data.p2_resp && data.p2_resp[0]) || "";
            document.getElementById("p2_resp1").value = (data.p2_resp && data.p2_resp[1]) || "";
            document.getElementById("p2_resp2").value = (data.p2_resp && data.p2_resp[2]) || "";
            document.getElementById("p2_resp3").value = (data.p2_resp && data.p2_resp[3]) || "";
            document.getElementById("p2_resp4").value = (data.p2_resp && data.p2_resp[4]) || "";
            document.getElementById("p3_resp0").value = (data.p3_resp && data.p3_resp[0]) || "";
            document.getElementById("p3_resp1").value = (data.p3_resp && data.p3_resp[1]) || "";
            document.getElementById("p3_resp2").value = (data.p3_resp && data.p3_resp[2]) || "";
            document.getElementById("p3_resp3").value = (data.p3_resp && data.p3_resp[3]) || "";
            document.getElementById("p3_resp4").value = (data.p3_resp && data.p3_resp[4]) || "";


            // ---------- Project 3 ----------
            document.getElementById("p3_title").value = data.p3_title || "";
            document.getElementById("p3_desc").value = data.p3_desc || "";
            

            // ---------- Technical Skills ----------
            document.getElementById("prog").value = data.prog || "";
            document.getElementById("db").value = data.db || "";
            document.getElementById("tech").value = data.tech || "";
            document.getElementById("report").value = data.report || "";
            document.getElementById("misc").value = data.misc || "";

            // ---------- Education ----------
            document.getElementById("degree").value = data.degree || "";
            document.getElementById("college").value = data.college || "";

            // ---------- Certifications ----------
            document.getElementById("cert1").value = data.cert1 || "";
            document.getElementById("cert2").value = data.cert2 || "";
            document.getElementById("cert3").value = data.cert3 || "";
            document.getElementById("cert4").value = data.cert4 || "";
            document.getElementById("cert5").value = data.cert5 || "";
            document.getElementById("cert6").value = data.cert6 || "";
            document.getElementById("cert7").value = data.cert7 || "";
            document.getElementById("cert8").value = data.cert8 || "";
            document.getElementById("cert9").value = data.cert9 || "";
            document.getElementById("cert10").value = data.cert10 || "";

            uploadBtn.textContent = "Re-Generate";
        } 
        else {
            alert("Error: " + data.error);
            uploadBtn.textContent = "Upload & Parse";
        }

    } catch (err) {
        alert("Something went wrong!");
        uploadBtn.textContent = "Upload & Parse";
    }

    uploadBtn.disabled = false;
});


// map form IDs -> placeholder keys
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

    project1responsibilities: cleanInput(document.getElementById("p1_resp0").value),
    project1responsibilities1: cleanInput(document.getElementById("p1_resp1").value),
    project1responsibilities2: cleanInput(document.getElementById("p1_resp2").value),
    project1responsibilities3: cleanInput(document.getElementById("p1_resp3").value),
    project1responsibilities4: cleanInput(document.getElementById("p1_resp4").value),

    // PROJECT 2
    project2: cleanInput(document.getElementById("p2_title").value),
    Project2description: cleanInput(document.getElementById("p2_desc").value),

    project2responsibilities: cleanInput(document.getElementById("p2_resp0").value),
    project2responsibilities1: cleanInput(document.getElementById("p2_resp1").value),
    project2responsibilities2: cleanInput(document.getElementById("p2_resp2").value),
    project2responsibilities3: cleanInput(document.getElementById("p2_resp3").value),
    project2responsibilities4: cleanInput(document.getElementById("p2_resp4").value),

    // PROJECT 3
    project3: cleanInput(document.getElementById("p3_title").value),
    Project3description: cleanInput(document.getElementById("p3_desc").value),

    project3responsibilities: cleanInput(document.getElementById("p3_resp0").value),
    project3responsibilities1: cleanInput(document.getElementById("p3_resp1").value),
    project3responsibilities2: cleanInput(document.getElementById("p3_resp2").value),
    project3responsibilities3: cleanInput(document.getElementById("p3_resp3").value),
    project3responsibilities4: cleanInput(document.getElementById("p3_resp4").value),

    programinglanguage: cleanInput(document.getElementById("prog").value),
    database: cleanInput(document.getElementById("db").value),
    technologies: cleanInput(document.getElementById("tech").value),
    reportandanalytics: cleanInput(document.getElementById("report").value),
    miscellaneous: cleanInput(document.getElementById("misc").value),

    degree: cleanInput(document.getElementById("degree").value),
    collegename: cleanInput(document.getElementById("college").value),

    cert1: cleanInput(document.getElementById("cert1").value),
    cert2: cleanInput(document.getElementById("cert2").value),
    cert3: cleanInput(document.getElementById("cert3").value),
    cert4: cleanInput(document.getElementById("cert4").value),
    cert5: cleanInput(document.getElementById("cert5").value),
    cert6: cleanInput(document.getElementById("cert6").value),
    cert7: cleanInput(document.getElementById("cert7").value),
    cert8: cleanInput(document.getElementById("cert8").value),
    cert9: cleanInput(document.getElementById("cert9").value),
    cert10: cleanInput(document.getElementById("cert10").value)
  };
}

// small cleaning: remove long runs of '*' and trim
function cleanInput(s) {
  if (!s) return "";
  // remove sequences of 3+ stars or weird leading/trailing stars and trim spaces
  return s.replace(/\*{2,}/g, "").replace(/^\*+|\*+$/g, "").trim();
}

// convert a text into XML-safe string with PowerPoint line-breaks (<a:br/>)
function encodeForPptx(text) {
  if (text == null) return "";
  // Replace CRLF -> LF, then escape XML entities, then replace LF with <a:br/>
  const t = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const escaped = t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<a:br/>");
}

async function fetchArrayBuffer(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load: " + path + " (status " + res.status + ")");
  return await res.arrayBuffer();
}

async function updatePptx(data, statusEl) {
  const buffer = await fetchArrayBuffer(TEMPLATE_NAME);
  const zip = await JSZip.loadAsync(buffer);

  // slide files are typically in ppt/slides/slideN.xml
  const slideFiles = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/i.test(f));
  if (slideFiles.length === 0) throw new Error("No slide XML files found in PPTX.");

  // For each slide, do replacements
  for (const filePath of slideFiles) {
    let xml = await zip.file(filePath).async("string");

    // Replace each placeholder key with encoded value
    Object.keys(data).forEach(key => {
      const encoded = encodeForPptx(data[key] || "");
      const pattern = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
      xml = xml.replace(pattern, encoded);
    });

    // write back modified xml
    zip.file(filePath, xml);
  }

  // generate final pptx blob
  const outBlob = await zip.generateAsync({ type: "blob" });
  return outBlob;
}

// utility to escape regex-special chars in placeholder keys (defensive)
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* UI wiring */
document.getElementById("generateBtn").addEventListener("click", async function () {
  const btn = this;
  const statusEl = document.getElementById("status");

  try {
    btn.disabled = true;
    statusEl.style.color = "#fff";
    statusEl.textContent = "Generating... ⏳";

    const data = collectData();

    const blob = await updatePptx(data, statusEl);

    // download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Updated_Resume.pptx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    statusEl.textContent = "Done! ✅ Download started.";
  } catch (err) {
    console.error(err);
    statusEl.style.color = "#ffdddd";
    statusEl.textContent = "Error: " + (err.message || "Failed to generate PPTX");
  } finally {
    btn.disabled = false;
  }
});
