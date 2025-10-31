const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// ------------------------
// 表单提交
// ------------------------
document.getElementById('giftForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    verb1: document.getElementById('verb1').value,
    verb2: document.getElementById('verb2').value,
    adverb1: document.getElementById('adverb1').value,
    adverb2: document.getElementById('adverb2').value,
    remark: document.getElementById('remark').value
  };

  try {
    await fetch(sheetUrl, { method: 'POST', body: JSON.stringify(data) });
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  } catch (err) {
    alert("提交失败，请稍后再试");
    console.error(err);
  }
});

// ------------------------
// 主持人登录
// ------------------------
document.getElementById('loginBtn').addEventListener('click', () => {
  const pw = document.getElementById('adminPassword').value;
  console.log("点击登录按钮"); // 测试
  if (pw === "zxc123456") {
    isAdmin = true;
    document.getElementById('admin-controls').style.display = "block";
    alert("登录成功！你现在可以操作主持人功能。");
  } else {
    alert("密码错误！");
  }
});

// ------------------------
// 生成组合
// ------------------------
document.getElementById('generateBtn').addEventListener('click', async () => {
  if (!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl);
  const entries = await res.json();

  let verbs = [], adverbs = [];
  entries.forEach(e => { verbs.push(e.verb1, e.verb2); adverbs.push(e.adverb1, e.adverb2); });
  verbs = shuffle(verbs); adverbs = shuffle(adverbs);

  const combinations = [];
  entries.forEach(e => {
    const v = verbs.pop() || "";
    const a = adverbs.pop() || "";
    combinations.push({ name: e.name, combo: `${a} ${v}` });
  });

  displayResults(combinations, "generateResultsList", false);
  saveResultsToSheet("组合结果", combinations.map(c => `${c.name} → ${c.combo}`));
});

// ------------------------
// 随机送礼
// ------------------------
document.getElementById('matchBtn').addEventListener('click', async () => {
  if (!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl);
  const entries = await res.json();
  const names = entries.map(e => e.name);

  if (names.length < 2) { alert("至少需要两位参与者"); return; }

  let receivers = shuffle([...names]);

  // 确保没人送自己
  for (let i = 0; i < names.length; i++) {
    if (names[i] === receivers[i]) {
      const j = (i + 1) % names.length;
      [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }
  }

  const pairs = names.map((sender, i) => ({ sender, receiver: receivers[i] }));
  displayResults(pairs, "matchResultsList", true);
  saveResultsToSheet("送礼结果", pairs.map(c => `${c.sender} 🎁 → ${c.receiver}`));
});

// ------------------------
// 清空结果
// ------------------------
document.getElementById('clearResultsBtn').addEventListener('click', () => {
  if (!isAdmin) return alert("请先登录主持人账号");

  document.getElementById('generateResultsList').innerHTML = "";
  document.getElementById('matchResultsList').innerHTML = "";
  clearResultsFromSheet();
  alert("抽签结果已清空！");
});

// ------------------------
// 加载已提交信息
// ------------------------
async function loadSubmissions() {
  try {
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML = "<h3>已提交信息</h3>";
    entries.forEach(e => {
      const div = document.createElement('div');
      div.innerText = `名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 形容词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });
    loadResultsFromSheet();
  } catch (err) {
    console.error("加载提交信息失败:", err);
  }
}

// ------------------------
// 工具函数
// ------------------------
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ------------------------
// 显示结果
// ------------------------
function displayResults(list, containerId, isGift = false) {
  const ul = document.getElementById(containerId);
  ul.innerHTML = "";
  list.forEach(c => {
    const li = document.createElement('li');
    li.innerText = isGift ? `${c.sender} 🎁 → ${c.receiver}` : `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// ------------------------
// 保存结果到 Google Sheet
// ------------------------
async function saveResultsToSheet(type, list) {
  try {
    await fetch(sheetUrl, { method: 'POST', body: JSON.stringify({ type, list }) });
  } catch (err) {
    console.error("保存结果失败:", err);
  }
}

// ------------------------
// 清空 Google Sheet 中的结果
// ------------------------
async function clearResultsFromSheet() {
  try {
    await fetch(sheetUrl, { method: 'POST', body: JSON.stringify({ type: "clearResults" }) });
  } catch (err) {
    console.error("清空结果失败:", err);
  }
}

// ------------------------
// 加载保存的结果
// ------------------------
async function loadResultsFromSheet() {
  try {
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const generate = entries.filter(e => e.type === "组合结果");
    const match = entries.filter(e => e.type === "送礼结果");

    const generateContainer = document.getElementById("generateResultsList");
    const matchContainer = document.getElementById("matchResultsList");

    if (generate.length) {
      generateContainer.innerHTML = "";
      generate.forEach(g => {
        const li = document.createElement('li');
        li.innerText = g.list;
        generateContainer.appendChild(li);
      });
    }

    if (match.length) {
      matchContainer.innerHTML = "";
      match.forEach(m => {
        const li = document.createElement('li');
        li.innerText = m.list;
        matchContainer.appendChild(li);
      });
    }
  } catch (err) {
    console.error("加载抽签结果失败:", err);
  }
}

// 页面加载
window.onload = () => { loadSubmissions(); };
