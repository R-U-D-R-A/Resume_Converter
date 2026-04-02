const TEMPLATE_NAME = "/static/template.pptx";

// ================= UPLOAD =================
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('resumeFile');
    const uploadBtn = document.getElementById('uploadBtn');

    if (!fileInput.files.length) return alert("Select a file");

    uploadBtn.textContent = "Processing...";
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const res = await fetch("/upload_resume", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload failed");

        // Fill form
        document.getElementById("name").value = data.name || "";
        document.getElementById("designation").value = data.designation || "";
        document.getElementById("years").value = data.years || "";
        document.getElementById("forte").value = data.forte1 || "";
        document.getElementById("forte1").value = data.forte2 || "";
        document.getElementById("description").value = data.description || "";

        for (let i = 0; i < 5; i++) {
            document.getElementById(`p1_resp${i}`).value = data.p1_resp?.[i] || "";
            document.getElementById(`p2_resp${i}`).value = data.p2_resp?.[i] || "";
            document.getElementById(`p3_resp${i}`).value = data.p3_resp?.[i] || "";
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

    } catch (err) {
        alert(err.message);
        uploadBtn.textContent = "Upload";
    }

    uploadBtn.disabled = false;
});


// ================= PPT =================
async function fetchArrayBuffer(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Template file not found (check /static)");
    return await res.arrayBuffer();
}

function encodeForPptx(text) {
    return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<a:br/>");
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function updatePptx(data) {
    const buffer = await fetchArrayBuffer(TEMPLATE_NAME);
    const zip = await JSZip.loadAsync(buffer);

    const slides = Object.keys(zip.files).filter(f =>
        /^ppt\/slides\/slide\d+\.xml$/i.test(f)
    );

    if (slides.length === 0) throw new Error("Slides not found");

    for (const path of slides) {
        let xml = await zip.file(path).async("string");

        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
            xml = xml.replace(regex, encodeForPptx(data[key]));
        });

        zip.file(path, xml);
    }

    return await zip.generateAsync({ type: "blob" });
}


// ================= GENERATE =================
document.getElementById("generateBtn").addEventListener("click", async () => {
    const btn = document.getElementById("generateBtn");
    const status = document.getElementById("status");

    try {
        btn.disabled = true;
        status.textContent = "Generating PPT...";

        const data = collectData();
        const blob = await updatePptx(data);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Resume.pptx";
        a.click();

        status.textContent = "Download started ✅";

    } catch (err) {
        console.error(err);
        status.textContent = err.message;
    }

    btn.disabled = false;
});


// ================= CLEAN =================
function cleanInput(s) {
    return (s || "").replace(/\*{2,}/g, "").trim();
}
