const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// 提交表单
document.getElementById('giftForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if (!name) return alert("请输入名字");
  await fetch(sheetUrl, {
    method: 'POST',
    body: JSON.stringify({ type: 'submission', list: [{ name }] })
  });
  document.getElementById('name').value = "";
  loadSubmissions();
});

// 主持人登录
document.getElementById('adminLoginBtn').addEventListener('click', () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "1234") {
    isAdmin = true;
    document.getElementById('adminControls').style.display = "block";
    alert("主持人登录成功");
  } else {
    alert("密码错误");
  }
});

// 生成组合
document.getElementById('generateComboBtn').addEventListener('click', async () => {
  if (!isAdmin) return alert("请先登录主持人");
  const response = await fetch(sheetUrl);
  const data = await response.json();
  const names = data.submissions.map(s => s.name);
  if (names.length < 2) return alert("人数不足，无法生成组合");

  const shuffled = shuffle([...names]);
  const combos = shuffled.map((name, i) => ({
    name,
    combo: shuffled[(i + 1) % shuffled.length]
  }));

  displayResults(combos, 'comboList', false);
  await saveResultsToSheet('combo', combos);
  loadSubmissions();
});

// 随机送礼
document.getElementById('matchNamesBtn').addEventListener('click', async () => {
  if (!isAdmin) return alert("请先登录主持人");
  const response = await fetch(sheetUrl);
  const data = await response.json();
  const names = data.submissions.map(s => s.name);
  if (names.length < 2) return alert("人数不足");

  const shuffled = shuffle([...names]);
  const gifts = shuffled.map((sender, i) => ({
    sender,
    receiver: shuffled[(i + 1) % shuffled.length]
  }));

  displayResults(gifts, 'matchList', true);
  await saveResultsToSheet('gift', gifts);
  loadSubmissions();
});

// 清空结果
document.getElementById('clearBtn').addEventListener('click', async () => {
  if (!isAdmin) return alert("请先登录主持人");
  if (!confirm("确定要清空所有结果吗？")) return;
  await fetch(sheetUrl, {
    method: 'POST',
    body: JSON.stringify({ type: 'clear' })
  });
  document.getElementById('comboList').innerHTML = "";
  document.getElementById('matchList').innerHTML = "";
  loadSubmissions();
});

// 加载提交信息
async function loadSubmissions() {
  try {
    const res = await fetch(sheetUrl);
    const data = await res.json();
    const ul = document.getElementById('submittedList');
    ul.innerHTML = "";

    if (data.submissions.length) {
      data.submissions.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item.name;
        ul.appendChild(li);
      });
    }

    // 显示保存的结果
    displayResults(data.combos, 'comboList', false);
    displayResults(data.gifts, 'matchList', true);

  } catch (err) {
    console.error("加载失败", err);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayResults(list, ulId, isGift = false) {
  const ul = document.getElementById(ulId);
  ul.innerHTML = "";
  list.forEach(c => {
    const li = document.createElement('li');
    li.innerText = isGift ? `${c.sender} 🎁 → ${c.receiver}` : `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

async function saveResultsToSheet(type, list) {
  await fetch(sheetUrl, {
    method: 'POST',
    body: JSON.stringify({ type, list })
  });
}

window.onload = () => {
  loadSubmissions();
};
