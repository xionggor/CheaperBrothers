const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// 表单提交
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
    await fetch(sheetUrl, { method:'POST', body: JSON.stringify(data) });
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  } catch(err) { alert("提交失败"); console.error(err); }
});

// 主持人登录
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功！");
  }else{ alert("密码错误！"); }
});

// 生成组合
document.getElementById('generateBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();
  let verbs=[], adverbs=[];
  entries.filter(e=>e.type==="submission").forEach(e=>{ verbs.push(e.verb1,e.verb2); adverbs.push(e.adverb1,e.adverb2); });
  verbs=shuffle(verbs); adverbs=shuffle(adverbs);

  const combinations = entries.filter(e=>e.type==="submission").map(e=>{
    const v = verbs.pop()||"";
    const a = adverbs.pop()||"";
    return {name:e.name, combo:`${a} ${v}`};
  });
  displayResults(combinations, "generateResultsList", false);
  saveResultsToSheet("组合结果", combinations.map(c=>`${c.name} → ${c.combo}`));
});

// 随机送礼
document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();
  const names = entries.filter(e=>e.type==="submission").map(e=>e.name);
  if(names.length<2){ alert("至少需要两位参与者"); return; }

  let receivers = shuffle([...names]);
  for(let i=0;i<names.length;i++){ if(names[i]===receivers[i]){
    const j=(i+1)%names.length;
    [receivers[i],receivers[j]]=[receivers[j],receivers[i]];
  }}
  const pairs = names.map((sender,i)=>({sender,receiver:receivers[i]}));
  displayResults(pairs,"matchResultsList",true);
  saveResultsToSheet("送礼结果", pairs.map(c=>`${c.sender} 🎁 → ${c.receiver}`));
});

// 清空结果
document.getElementById('clearResultsBtn').addEventListener('click', ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  document.getElementById('generateResultsList').innerHTML="";
  document.getElementById('matchResultsList').innerHTML="";
  fetch(sheetUrl,{method:'POST',body:JSON.stringify({type:"clearResults"})});
  alert("抽签结果已清空！");
});

// 加载已提交信息和结果
async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    entries.filter(e=>e.type==="submission").forEach(e=>{
      const div=document.createElement('div');
      div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 形容词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });

    // 加载结果
    const generate = entries.filter(e=>e.type==="组合结果");
    const match = entries.filter(e=>e.type==="送礼结果");
    const gUl=document.getElementById("generateResultsList");
    const mUl=document.getElementById("matchResultsList");
    if(generate.length){ gUl.innerHTML=""; generate.forEach(g=>{ const li=document.createElement('li'); li.innerText=g.list; gUl.appendChild(li); }); }
    if(match.length){ mUl.innerHTML=""; match.forEach(m=>{ const li=document.createElement('li'); li.innerText=m.list; mUl.appendChild(li); }); }

  }catch(err){ console.error("加载失败",err);}
}

// 工具函数
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function displayResults(list, ulId, isGift=false){
  const ul = document.getElementById(ulId);
  ul.innerHTML="";
  list.forEach(c=>{
    const li = document.createElement('li');
    li.innerText = isGift ? `${c.sender} 🎁 → ${c.receiver}` : `${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// 保存结果到 Google Sheet
async function saveResultsToSheet(type,list){
  await fetch(sheetUrl,{method:'POST',body:JSON.stringify({type, list})});
}

// 页面加载
window.onload=()=>{ loadSubmissions(); };
