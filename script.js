const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let submissions = [];

document.addEventListener("DOMContentLoaded", () => {
  loadSubmissions();

  document.getElementById("giftForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      action: "submitForm",
      name: document.getElementById("name").value,
      verb1: document.getElementById("verb1").value,
      verb2: document.getElementById("verb2").value,
      adverb1: document.getElementById("adverb1").value,
      adverb2: document.getElementById("adverb2").value,
      remark: document.getElementById("remark").value
    };

    await fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(formData)
    });

    alert("提交成功！");
    e.target.reset();
    loadSubmissions();
  });

  document.getElementById("generateBtn").addEventListener("click", generateCombinations);
  document.getElementById("assignBtn").addEventListener("click", matchNames);
});

async function loadSubmissions() {
  const res = await fetch(WEB_APP_URL);
  const data = await res.json();
  submissions = data.submissions || [];
  renderSubmissions();
  renderResults(data.drawResults || []);
}

function renderSubmissions() {
  const listDiv = document.getElementById("submissionList");
  listDiv.innerHTML = "<h3>已提交信息</h3>";
  submissions.forEach(s => {
    const div = document.createElement("div");
    div.textContent = `${s.name}：${s.verb1}、${s.verb2}｜${s.adverb1}、${s.adverb2}`;
    listDiv.appendChild(div);
  });
}

function renderResults(drawResults) {
  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";
  drawResults.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.type}：${r.text}`;
    resultsList.appendChild(li);
  });
}

async function generateCombinations() {
  if (submissions.length === 0) {
    alert("没有报名信息！");
    return;
  }

  const allVerbs = submissions.flatMap(s => [s.verb1, s.verb2]);
  const allAdverbs = submissions.flatMap(s => [s.adverb1, s.adverb2]);
  shuffle(allVerbs);
  shuffle(allAdverbs);

  const results = submissions.map((s, i) => {
    const combo = `${s.name} 得到「${allVerbs[i % allVerbs.length]}${allAdverbs[i % allAdverbs.length]}」`;
    return { type: "生成组合", text: combo };
  });

  renderResults(results);
  await saveResults(results);
}

async function matchNames() {
  if (submissions.length < 2) {
    alert("人数不足！");
    return;
  }

  const givers = [...submissions];
  const receivers = [...submissions];
  shuffle(receivers);

  // 避免自己送给自己
  for (let i = 0; i < givers.length; i++) {
    if (givers[i].name === receivers[i].name) {
      const swapIndex = (i + 1) % receivers.length;
      [receivers[i], receivers[swapIndex]] = [receivers[swapIndex], receivers[i]];
    }
  }

  const results = givers.map((g, i) => ({
    type: "匹配名字",
    text: `${g.name} 🎁 送给 ${receivers[i].name}`
  }));

  renderResults(results);
  await saveResults(results);
}

async function saveResults(results) {
  await fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify({ action: "saveResults", results })
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
