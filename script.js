function searchTopic() {
    let topic = document.getElementById("searchInput").value.trim();
    let resultDiv = document.getElementById("result");

    if (topic === "") {
        resultDiv.innerHTML = "❌ Please enter a topic.";
        return;
    }

    resultDiv.innerHTML = "🔎 Fetching study material...";

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
        .then(res => res.json())
        .then(data => {
            if (!data.extract) {
                resultDiv.innerHTML = "❌ Topic not found.";
                return;
            }

            let imageHTML = getImageHTML(topic, data);
            let equations = getEquations(topic);
            let caseStudy = getCaseStudy(topic);

            resultDiv.innerHTML = `
                <h2>${data.title}</h2>

                ${imageHTML}

                <h3>📘 Concept Explanation</h3>
                <p>${simplifyText(data.extract)}</p>

                ${equations}

                <h3>🧠 Real-Life Application / Case Study</h3>
                <p>${caseStudy}</p>

                <h3>📌 Exam-Oriented Points</h3>
                <ul>
                    <li>Important for conceptual understanding</li>
                    <li>Frequently asked in exams</li>
                    <li>Applied in real-world systems</li>
                </ul>

                <a href="${data.content_urls.desktop.page}" target="_blank">
                    🔗 Reference Source
                </a>
            `;
        })
        .catch(() => {
            resultDiv.innerHTML = "❌ Error fetching data.";
        });
}

function simplifyText(text) {
    return text.split(". ").slice(0, 3).join(". ") + ".";
}

function getImageHTML(topic, data) {
    // If Wikipedia provides an image
    if (data.thumbnail && data.thumbnail.source) {
        return `
            <img src="${data.thumbnail.source}" alt="${topic}" class="topic-img">
        `;
    }

    // Fallback: Unsplash (free, no API key)
    return `
        <img src="https://source.unsplash.com/600x300/?${topic},science" 
             alt="${topic}" class="topic-img">
    `;
}

function getEquations(topic) {
    topic = topic.toLowerCase();

    if (topic.includes("electromagnet")) {
        return `
        <h3>📐 Important Equations</h3>
        <ul>
            <li>Magnetic Field: <b>B = μ₀ n I</b></li>
            <li>Force: <b>F = B I L</b></li>
        </ul>
        `;
    }

    if (topic.includes("ohm")) {
        return `
        <h3>📐 Important Equations</h3>
        <ul>
            <li>Ohm’s Law: <b>V = IR</b></li>
        </ul>
        `;
    }

    if (topic.includes("newton")) {
        return `
        <h3>📐 Important Equations</h3>
        <ul>
            <li>Second Law: <b>F = ma</b></li>
        </ul>
        `;
    }

    return `
        <h3>📐 Important Equations</h3>
        <p>No standard equations available.</p>
    `;
}

function getCaseStudy(topic) {
    topic = topic.toLowerCase();

    if (topic.includes("electromagnet")) {
        return "Electromagnets are used in industrial cranes to lift heavy iron loads. The magnetic field exists only when current flows, giving full control.";
    }

    if (topic.includes("ohm")) {
        return "Ohm’s Law helps engineers design safe electrical circuits by controlling voltage and current.";
    }

    if (topic.includes("photosynthesis")) {
        return "Photosynthesis enables plants to produce food, forming the base of all food chains.";
    }

    return "This topic plays a vital role in both academic studies and practical applications.";
}