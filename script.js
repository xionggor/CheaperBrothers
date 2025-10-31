const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec"; 
let isAdmin = false;

// 表单提交
document.getElementById('giftForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    verb1: document.getElementById('verb1').value,
    verb2: document.getElementById('verb2').value,
    adverb1: document.getElementById('adverb1').value,
    adverb2: document.getElementById('adverb2').value,
    remark: document.getElementById('remark').value
  };
  try{
    await fetch(sheetUrl, { method:'POST', body:JSON.stringify(data) });
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  }catch(err){ alert("提交失败，请稍后再试"); console.error(err); }
});

// 主持人登录
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功！你现在可以操作主持人功能。");
  }else{ alert("密码错误！"); }
});

// 生成组合
document.getElementById('generateBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();
  let verbs=[], adverbs=[];
  entries.forEach(e=>{ verbs.push(e.verb1,e.verb2); adverbs.push(e.adverb1,e.adverb2); });
  verbs=shuffle(verbs); adverbs=shuffle(adverbs);
  const combinations=[];
  entries.forEach(e=>{
    const v = verbs.pop()||"";
    const a = adverbs.pop()||"";
    combinations.push({ name:e.name, combo:`${a} ${v}` });
  });
  displayResults(combinations,"combo");
});

// 随机送礼
document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();
  const names = entries.map(e=>e.name).filter(n=>n);
  if(names.length<2){ alert("至少需要两位参与者"); return; }

  let receivers = shuffle([...names]);
  for(let i=0;i<names.length;i++){
    if(names[i]===receivers[i]){
      const j=(i+1)%names.length;
      [receivers[i],receivers[j]]=[receivers[j],receivers[i]];
    }
  }
  const pairs = names.map((sender,i)=>({ sender, receiver:receivers[i] }));
  displayResults(pairs,"gift");
});

// 清空结果
document.getElementById('clearBtn').addEventListener('click', ()=>{
  document.getElementById('comboList').innerHTML="";
  document.getElementById('giftList').innerHTML="";
  localStorage.removeItem("comboResults");
  localStorage.removeItem("giftResults");
});

// 显示结果
function displayResults(list,type){
  const ul = type==="combo"?document.getElementById('comboList'):document.getElementById('giftList');
  ul.innerHTML="";
  list.forEach(c=>{
    const li=document.createElement('li');
    li.innerText=type==="combo"?`${c.name} → ${c.combo}`:`${c.sender} 🎁 送给 → ${c.receiver}`;
    ul.appendChild(li);
  });

  if(type==="combo"){
    localStorage.setItem("comboResults", JSON.stringify(Array.from(ul.children).map(li=>li.innerText)));
  }else{
    localStorage.setItem("giftResults", JSON.stringify(Array.from(ul.children).map(li=>li.innerText)));
  }
}

// 加载报名信息 + 本地结果
async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    entries.forEach(e=>{
      if(e.name){
        const div=document.createElement('div');
        div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 形容词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
        container.appendChild(div);
      }
    });
  }catch(err){ console.error("加载提交信息失败:",err);}
}

// 工具函数
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// 页面加载恢复本地结果
window.onload=()=>{
  loadSubmissions();
  const comboResults = JSON.parse(localStorage.getItem("comboResults")||"[]");
  const giftResults = JSON.parse(localStorage.getItem("giftResults")||"[]");
  comboResults.forEach(text=>{ const li=document.createElement("li"); li.innerText=text; document.getElementById("comboList").appendChild(li); });
  giftResults.forEach(text=>{ const li=document.createElement("li"); li.innerText=text; document.getElementById("giftList").appendChild(li); });
};
