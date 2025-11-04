// 修改说明：在原有功能基础上加入 accordion 控制逻辑（折叠面板）并把界面中的“形容词”文本改为“副词”，其它功能不变。

const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// ------------------------
// 表单提交
// ------------------------
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
  }catch(err){
    showToast("提交失败，请稍后再试", true);
    console.error(err);
  }
});

// ------------------------
// 主持人登录
// ------------------------
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

// ------------------------
// 生成组合（每人一组）
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

  // render to left column
  renderCombinations(combinations);
});

// ------------------------
// 匹配名字（随机送礼）
document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return showToast("请先登录主持人账号", true);

  const res = await fetch(sheetUrl);
  const entries = await res.json();

  const names = entries.map(e=>e.name);
  if(names.length<2){ showToast("至少需要两位参与者", true); return; }

  // 更稳健的方案：多次洗牌直到没有人送自己（或达到尝试次数）
  let receivers;
  const maxTries = 20;
  let tries = 0;
  do {
    receivers = shuffle([...names]);
    tries++;
    if(tries>maxTries) break;
  } while(receivers.some((r,i)=>r===names[i]));

  // 如果仍然有 self-assign，作为最后手段进行局部交换
  if(receivers.some((r,i)=>r===names[i])){
    for(let i=0;i<names.length;i++){
      if(names[i]===receivers[i]){
        const j = (i+1)%names.length;
        [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
      }
    }
  }

  const pairs = names.map((sender,i)=>({ sender, receiver:receivers[i] }));
  // render to right column
  renderMatches(pairs);
});

// ------------------------
// 加载报名信息
async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    // 显示最新在上方：reverse 遍历
    entries.slice().reverse().forEach(e=>{
      const div=document.createElement('div');
      div.className = 'submission-item';
      div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 副词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
      container.appendChild(div);
    });
  }catch(err){ console.error("加载提交信息失败:",err);}
}

// ------------------------
// 工具函数
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// ------------------------
// 渲染：生成组合（左列）
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

// 渲染：匹配名字（右列）
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

// ------------------------
// 页面提示：简易 toast（右上角）
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

// ------------------------
// Accordion（折叠面板）逻辑
(function initAccordion(){
  const toggles = document.querySelectorAll('.accordion-toggle');
  toggles.forEach(btn=>{
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    // Ensure initial state
    btn.setAttribute('aria-expanded', 'false');
    if(panel) panel.hidden = true;

    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if(!expanded){
        // open
        btn.setAttribute('aria-expanded','true');
        panel.hidden = false;
        // animate height
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        // close
        btn.setAttribute('aria-expanded','false');
        panel.style.maxHeight = panel.scrollHeight + 'px'; // set to current to trigger transition
        // force repaint then collapse
        requestAnimationFrame(()=> {
          panel.style.maxHeight = '0px';
        });
        // after transition, set hidden
        panel.addEventListener('transitionend', function te(){
          panel.hidden = true;
          panel.style.maxHeight = null;
          panel.removeEventListener('transitionend', te);
        });
      }
    });

    // accessibility: allow Enter / Space to toggle
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();

// 页面加载
window.onload=()=>{ loadSubmissions(); };
