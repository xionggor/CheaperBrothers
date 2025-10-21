const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// 示例词语
const verbExamples = ["跳", "跑", "吃", "笑", "唱"];
const adverbExamples = ["快速地", "开心地", "轻轻地", "大声地", "慢慢地"];

// 给输入框右边添加示例
function addExamples() {
  document.getElementById('verb1').placeholder = "示例: " + verbExamples.join(", ");
  document.getElementById('verb2').placeholder = "示例: " + verbExamples.join(", ");
  document.getElementById('adverb1').placeholder = "示例: " + adverbExamples.join(", ");
  document.getElementById('adverb2').placeholder = "示例: " + adverbExamples.join(", ");
}
addExamples();

// 提交表单
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
    await fetch(sheetUrl + "?action=submit", {
      method: 'POST',
      body: JSON.stringify(data)
    });
    alert("提交成功！");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  } catch (err) {
    alert("提交失败，请稍后再试");
    console.error(err);
  }
});

// 主持人登录
document.getElementById('loginBtn').addEventListener('click', () => {
  const pw = document.getElementById('adminPassword').value;
  if (pw === "zxc123456") {
    isAdmin = true;
    document.getElementById('admin-controls').style.display = "block";
    alert("登录成功！你现在可以操作主持人功能。");
  } else {
    alert("密码错误！");
  }
});

// 生成组合，保证不重复使用动词和副词
document.getElementById('generateBtn').addEventListener('click', async () => {
  if (!isAdmin) return;
  const res = await fetch(sheetUrl + "?action=get");
  const entries = await res.json();

  let verbs = [];
  let adverbs = [];
  entries.forEach(e => {
    verbs.push(e.verb1, e.verb2);
    adverbs.push(e.adverb1, e.adverb2);
  });
  verbs = shuffle(verbs);
  adverbs = shuffle(adverbs);

  const combinations = [];
  entries.forEach((e) => {
    const v1 = verbs.pop() || "";
    const v2 = verbs.pop() || "";
    const a1 = adverbs.pop() || "";
    const a2 = adverbs.pop() || "";
    combinations.push({
      name: e.name,
      combo: `${a1} ${v1}, ${a2} ${v2}`
    });
  });

  displayResults(combinations, "生成组合结果");
  saveResults(combinations);
});

// 匹配名字（随机送礼）
document.getElementById('matchBtn').addEventListener('click', async () => {
  if (!isAdmin) return;
  const res = await fetch(sheetUrl + "?action=get");
  const entries = await res.json();

  let givers = shuffle([...entries]);
  let receivers = shuffle([...entries]);

  // 防止自己抽到自己
  for (let i = 0; i < givers.length; i++) {
    if (givers[i].name === receivers[i].name) {
      const swapIndex = (i + 1) % receivers.length;
      [receivers[i], receivers[swapIndex]] = [receivers[swapIndex], receivers[i]];
    }
  }

  const pairs = givers.map((g, i) => ({
    name: g.name,
    combo: `送礼给 ${receivers[i].name}`
  }));

  displayResults(pairs, "匹配名字结果");
  saveResults(pairs);
});

// 保存结果到 Google Sheet
async function saveResults(data) {
  try {
    await fetch(sheetUrl + "?action=saveResults", {
      method: 'POST',
      body: JSON.stringify({ results: data })
    });
  } catch (err) {
    console.error("保存结果失败:", err);
  }
}

// 加载已提交信息
async function loadSubmissions() {
  try {
    const res = await fetch(sheetUrl + "?action=get");
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML = "<h3>已提交信息</h3>";

    entries.forEach(e => {
      const div = document.createElement('div');
      div.style.border = "1px solid #ccc";
      div.style.margin = "5px 0";
      div.style.padding = "5px";
      div.style.borderRadius = "8px";
      div.style.backgroundColor = "#fff3e0";
      div.innerText = `名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 副词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("加载提交信息失败:", err);
  }
}

// 加载抽签结果
async function loadResults() {
  try {
    const res = await fetch(sheetUrl + "?action=getResults");
    const data = await res.json();
    displayResults(data, "最新结果");
  } catch (err) {
    console.error("加载抽签结果失败:", err);
  }
}

// 工具函数：数组随机打乱
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 显示抽签结果
function displayResults(combos, title = "结果") {
  const ul = document.getElementById('resultsList');
  ul.innerHTML = `<h3>${title}</h3>`;
  combos.forEach(c => {
    const li = document.createElement('li');
    li.innerText = `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// 页面加载时显示已有提交信息和结果
window.onload = () => {
  loadSubmissions();
  loadResults();
};
