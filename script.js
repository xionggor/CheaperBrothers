const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// 示例词语
const verbExamples = ["跳", "跑", "吃", "笑", "唱", "打滚", "偷吃", "飞"];
const adverbExamples = ["快速地", "开心地", "轻轻地", "大声地", "慢慢地", "笨拙地", "优雅地", "悄悄地"];

// 显示示例
function addExamples() {
  document.getElementById('verb1-example').textContent = "示例: " + pickRandomExamples(verbExamples, 4);
  document.getElementById('verb2-example').textContent = "示例: " + pickRandomExamples(verbExamples, 4);
  document.getElementById('adverb1-example').textContent = "示例: " + pickRandomExamples(adverbExamples, 4);
  document.getElementById('adverb2-example').textContent = "示例: " + pickRandomExamples(adverbExamples, 4);
}

function pickRandomExamples(arr, count){
  const shuffled = [...arr].sort(()=>0.5 - Math.random());
  return shuffled.slice(0, count).join(", ");
}

addExamples();

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
    await fetch(sheetUrl + "?action=submit", {
      method: 'POST',
      body: JSON.stringify(data)
    });
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  } catch(err){
    alert("提交失败，请稍后再试");
    console.error(err);
  }
});

// ------------------------
// 主持人登录
// ------------------------
document.getElementById('loginBtn').addEventListener('click', () => {
  const pw = document.getElementById('adminPassword').value;
  if(pw === "zxc123456"){
    isAdmin = true;
    document.getElementById('admin-controls').style.display = "block";
    alert("登录成功！你现在可以操作主持人功能。");
  } else {
    alert("密码错误！");
  }
});

// ------------------------
// 生成组合（每人一组）
// ------------------------
document.getElementById('generateBtn').addEventListener('click', async () => {
  if(!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl + "?action=get");
  const entries = await res.json();

  // 收集所有动词和副词
  let verbs = [];
  let adverbs = [];
  entries.forEach(e => {
    verbs.push(e.verb1, e.verb2);
    adverbs.push(e.adverb1, e.adverb2);
  });

  verbs = shuffle(verbs);
  adverbs = shuffle(adverbs);

  const combinations = [];

  // 每人只生成一组组合
  entries.forEach(e => {
    const v = verbs.pop() || "";
    const a = adverbs.pop() || "";
    combinations.push({
      name: e.name,
      combo: `${a} ${v}`
    });
  });

  displayResults(combinations, "生成组合（每人一组）结果");
});

// ------------------------
// 匹配名字（随机送礼）
// ------------------------
document.getElementById('assignBtn').addEventListener('click', async () => {
  if(!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl + "?action=get");
  const entries = await res.json();

  const names = entries.map(e => e.name);
  let receivers = shuffle([...names]);

  // 确保没人送自己
  for (let i = 0; i < names.length; i++) {
    if (names[i] === receivers[i]) {
      const j = (i + 1) % names.length;
      [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }
  }

  const pairs = names.map((sender, i) => ({
    sender,
    receiver: receivers[i]
  }));

  displayResults(pairs, "匹配名字（随机送礼）结果", true);
});

// ------------------------
// 加载报名信息
// ------------------------
async function loadSubmissions() {
  try {
    const res = await fetch(sheetUrl + "?action=get");
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML = "<h3>已提交信息</h3>";

    entries.forEach(e => {
      const div = document.createElement('div');
      div.innerText = `名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 副词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });
  } catch(err){
    console.error("加载提交信息失败:", err);
  }
}

// ------------------------
// 工具函数
// ------------------------
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// ------------------------
// 显示结果
// ------------------------
function displayResults(list, title, isGift = false){
  const ul = document.getElementById('resultsList');
  ul.innerHTML = `<h3>${title}</h3>`;

  list.forEach(c => {
    const li = document.createElement('li');
    li.innerText = isGift ? `${c.sender} 🎁 送给 → ${c.receiver}` : `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// ------------------------
// 页面加载时执行
// ------------------------
window.onload = () => {
  loadSubmissions();
};
