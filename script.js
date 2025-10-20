const sheetUrl = "https://script.google.com/macros/s/AKfycbz6k7HAwZtm-FyNa0tcBmsyUFJCMNibFBPCEnlpHNA2caYf8I7TJRHucN1wgh4_EqC7/exec";
let isAdmin = false;

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
  
  await fetch(sheetUrl + "?action=submit", {
    method: 'POST',
    body: JSON.stringify(data)
  });

  alert("提交成功！"); // 弹窗提醒
  document.getElementById('giftForm').reset();

  // 刷新提交信息列表
  loadSubmissions();
});

// 主持人登录
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

// 生成组合
document.getElementById('generateBtn').addEventListener('click', async () => {
  if(!isAdmin) return;
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
  for(let i=0; i<entries.length; i++){
    combinations.push({
      name: entries[i].name,
      combo: `${adverbs[i % adverbs.length]} ${verbs[i % verbs.length]}`
    });
  }
  await fetch(sheetUrl + "?action=save_combos", {
    method: 'POST',
    body: JSON.stringify(combinations)
  });
  displayResults(combinations);
});

// 随机分配
document.getElementById('assignBtn').addEventListener('click', async () => {
  if(!isAdmin) return;
  const res = await fetch(sheetUrl + "?action=get_combos");
  const combos = await res.json();
  displayResults(combos);
});

// 加载已提交信息
async function loadSubmissions() {
  const res = await fetch(sheetUrl + "?action=get");
  const entries = await res.json();
  const containerId = 'submissionList';
  let container = document.getElementById(containerId);

  // 如果不存在容器就创建
  if(!container){
    container = document.createElement('div');
    container.id = containerId;
    container.innerHTML = "<h3>已提交信息</h3>";
    document.getElementById('form-section').appendChild(container);
  }

  // 清空原有列表
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
}

// 工具函数
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function displayResults(combos){
  const ul = document.getElementById('resultsList');
  ul.innerHTML = '';
  combos.forEach(c=>{
    const li = document.createElement('li');
    li.innerText = `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// 页面加载时显示已有提交信息
window.onload = () => {
  loadSubmissions();
};
