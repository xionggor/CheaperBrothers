const sheetUrl = "https://script.google.com/macros/s/AKfycbz6k7HAwZtm-FyNa0tcBmsyUFJCMNibFBPCEnlpHNA2caYf8I7TJRHucN1wgh4_EqC7/exec";
let isAdmin = false;
let isRegistrationOpen = false;

// 提交表单
document.getElementById('giftForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if(!isRegistrationOpen){
    document.getElementById('form-message').innerText = "报名尚未开始或已结束。";
    return;
  }
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
  document.getElementById('form-message').innerText = "提交成功！";
  document.getElementById('giftForm').reset();
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

// 主持人按钮
document.getElementById('startBtn').addEventListener('click', () => {
  if(!isAdmin) return;
  isRegistrationOpen = true;
  document.getElementById('status-message').innerText = "报名已开启！";
});

document.getElementById('endBtn').addEventListener('click', () => {
  if(!isAdmin) return;
  isRegistrationOpen = false;
  document.getElementById('status-message').innerText = "报名已结束！";
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
  // 保存到表格
  await fetch(sheetUrl + "?action=save_combos", {
    method: 'POST',
    body: JSON.stringify(combinations)
  });
  displayResults(combinations);
});

// 随机分配（这里直接用组合分配给每个参与者）
document.getElementById('assignBtn').addEventListener('click', async () => {
  if(!isAdmin) return;
  const res = await fetch(sheetUrl + "?action=get_combos");
  const combos = await res.json();
  displayResults(combos);
});

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
