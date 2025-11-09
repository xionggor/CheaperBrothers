// 注意：sheetUrl 换成你的新版 Web 应用地址！
const sheetUrl = "https://script.google.com/macros/s/AKfycbxoJ7SH0V2wVpMHcDFXF9PuN-vP3QXi90qiCKORu1nZJNx-4BvK_YodPmjw35Unqac/exec";
let isAdmin = false;

const VERB_LIBRARY = [
  "跑","吃","唱","睡","跳","画","写","看","听","喝",
  "抱","送","拍","游","爬","扔","搬","整理","剪","熬"
];
const ADVERB_LIBRARY = [
  "开心地","缓慢地","神秘地","优雅地","疯狂地","悄悄地","认真地",
  "大声地","温柔地","兴奋地","安静地","随意地","小心地","愉快地",
  "快速地","坚定地","羞怯地","甜美地","慵懒地","稳重地"
];

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function populatePlaceholders(){
  const verbsShuffled = shuffle(VERB_LIBRARY.slice());
  const verbPick = verbsShuffled.slice(0, 4);
  const verb1Examples = verbPick.slice(0,2);
  const verb2Examples = verbPick.slice(2,4);
  const advShuffled = shuffle(ADVERB_LIBRARY.slice());
  const advPick = advShuffled.slice(0, 4);
  const adv1Examples = advPick.slice(0,2);
  const adv2Examples = advPick.slice(2,4);
  const verb1Input = document.getElementById('verb1');
  const verb2Input = document.getElementById('verb2');
  const adv1Input = document.getElementById('adverb1');
  const adv2Input = document.getElementById('adverb2');
  if(verb1Input) verb1Input.placeholder = `示例：${verb1Examples.join('，')}`;
  if(verb2Input) verb2Input.placeholder = `示例：${verb2Examples.join('，')}`;
  if(adv1Input) adv1Input.placeholder = `示例：${adv1Examples.join('，')}`;
  if(adv2Input) adv2Input.placeholder = `示例：${adv2Examples.join('，')}`;
}

document.getElementById('giftForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value.trim(),
    verb1: document.getElementById('verb1').value.trim(),
    verb2: document.getElementById('verb2').value.trim(),
    adverb1: document.getElementById('adverb1').value.trim(),
    adverb2: document.getElementById('adverb2').value.trim(),
    remark: document.getElementById('remark').value.trim()
  };
  try{
    await fetch(sheetUrl, { method:'POST', body:JSON.stringify(data) });
    showToast("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
    populatePlaceholders();
  }catch(err){
    showToast("提交失败，请稍后再试", true);
    console.error(err);
  }
});

document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    showToast("登录成功！你现在可以操作主持人功能。");
  }else{
    showToast("密码错误！", true);
  }
});

document.getElementById('generateBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return showToast("请先登录主持人账号", true);
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
  renderCombinations(combinations);
});

document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return showToast("请先登录主持人账号", true);
  const res = await fetch(sheetUrl);
  const entries = await res.json();
  const names = entries.map(e=>e.name);
  if(names.length<2){ showToast("至少需要两位参与者"); return; }
  let receivers, tries=0, maxTries=20;
  do {
    receivers = shuffle([...names]);
    tries++;
    if(tries>maxTries) break;
  } while(receivers.some((r,i)=>r===names[i]));
  if(receivers.some((r,i)=>r===names[i])){
    for(let i=0;i<names.length;i++){
      if(names[i]===receivers[i]){
        const j=(i+1)%names.length;
        [receivers[i], receivers[j]]=[receivers[j], receivers[i]];
      }
    }
  }
  const pairs = names.map((sender,i)=>({ sender, receiver:receivers[i] }));
  renderMatches(pairs);
});

// 保存“生成组合”到表格，并自动刷新显示
document.getElementById("saveCombinationBtn").addEventListener("click", async () => {
  let arr = [];
  document.querySelectorAll("#combinationList .result-item").forEach(div=>{
    let txt = div.innerText.trim();
    let parts = txt.split("→");
    arr.push({name:parts[0].trim(), combo:(parts[1]||"").trim()});
  });
  if(arr.length === 0) { showToast("无组合可保存", true); return; }
  let res = await fetch(sheetUrl, {
    method: "POST",
    body: JSON.stringify({type:"saveCombination", data: arr}),
  });
  let json = await res.json();
  showToast(json.status === "ok" ? "组合已保存！" : ("保存失败："+json.message), json.status !== "ok");
  loadComboResult(); // 自动刷新
});

// 保存“匹配名单”到表格，并自动刷新显示
document.getElementById("saveMatchingBtn").addEventListener("click", async () => {
  let arr = [];
  document.querySelectorAll("#matchList .result-item").forEach(div=>{
    let txt = div.innerText.trim();
    let m = txt.match(/^(.+?)\s*🎁\s*送给\s*→\s*(.+)$/);
    if(m) arr.push({sender:m[1].trim(), receiver:m[2].trim()});
  });
  if(arr.length === 0) { showToast("无匹配可保存", true); return; }
  let res = await fetch(sheetUrl, {
    method: "POST",
    body: JSON.stringify({type:"saveMatching", data: arr}),
  });
  let json = await res.json();
  showToast(json.status === "ok" ? "匹配名单已保存！" : ("保存失败："+json.message), json.status !== "ok");
  loadGiftMatching(); // 自动刷新
});

async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML="";
    entries.slice().reverse().forEach(e=>{
      const div=document.createElement('div');
      div.className = 'submission-item';
      div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 副词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });
  }catch(err){ console.error("加载提交信息失败:",err);}
}

function renderCombinations(list){
  const container = document.getElementById('combinationList');
  container.innerHTML = '';
  if(!list || list.length===0){
    container.innerHTML = '<div class="empty">尚无生成结果</div>';
    return;
  }
  list.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'result-item';
    row.innerText = `${item.name} → ${item.combo}`;
    container.appendChild(row);
  });
}

function renderMatches(list){
  const container = document.getElementById('matchList');
  container.innerHTML = '';
  if(!list || list.length===0){
    container.innerHTML = '<div class="empty">尚无匹配结果</div>';
    return;
  }
  list.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'result-item';
    row.innerText = `${item.sender} 🎁 送给 → ${item.receiver}`;
    container.appendChild(row);
  });
}

function showToast(message, isError=false, timeout=3000){
  let toast = document.getElementById('site-toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'site-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = isError ? 'toast error' : 'toast';
  toast.style.opacity = '1';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(()=>{ toast.style.opacity = '0'; }, timeout);
}

(function initAccordion(){
  const toggles = document.querySelectorAll('.accordion-toggle');
  toggles.forEach(btn=>{
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    btn.setAttribute('aria-expanded', 'false');
    if(panel) panel.hidden = true;
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if(!expanded){
        btn.setAttribute('aria-expanded','true');
        panel.hidden = false;
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        btn.setAttribute('aria-expanded','false');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(()=> {
          panel.style.maxHeight = '0px';
        });
        panel.addEventListener('transitionend', function te(){
          panel.hidden = true;
          panel.style.maxHeight = null;
          panel.removeEventListener('transitionend', te);
        });
      }
    });
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();

// 刷新自动显示Combo和GiftMatching
async function loadComboResult(){
  try{
    const res = await fetch(sheetUrl + '?type=combo');
    const records = await res.json();
    renderCombinations(records);
  }catch(err){ console.error("加载组合结果失败:",err);}
}

async function loadGiftMatching(){
  try{
    const res = await fetch(sheetUrl + '?type=matching');
    const records = await res.json();
    renderMatches(records);
  }catch(err){ console.error("加载匹配名单失败:",err);}
}

window.onload=()=>{
  populatePlaceholders();
  loadSubmissions();
  loadComboResult();
  loadGiftMatching();
};
