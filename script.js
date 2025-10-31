const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";
let isAdmin = false;
// ------------------------
// 表单提交
document.getElementById('giftForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = {
    type:'form',
    name: document.getElementById('name').value,
    verb1: document.getElementById('verb1').value,
    verb2: document.getElementById('verb2').value,
    adverb1: document.getElementById('adverb1').value,
    adverb2: document.getElementById('adverb2').value,
    remark: document.getElementById('remark').value
  };

  try{
    await fetch(sheetUrl,{method:'POST', body:JSON.stringify(data)});
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  }catch(err){ alert("提交失败"); console.error(err); }
});

// ------------------------
// 主持人登录
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功！");
  }else alert("密码错误！");
});

// ------------------------
// 加载数据
async function loadData(){
  try{
    const res = await fetch(sheetUrl);
    const data = await res.json();
    return data;
  }catch(err){ console.error(err); return {form:[], combo:[], gift:[]}; }
}

// ------------------------
// 加载已提交信息
async function loadSubmissions(){
  const data = await loadData();
  const container = document.getElementById('submissionList');
  container.innerHTML="<h3>已提交信息</h3>";
  data.form.forEach(e=>{
    const div = document.createElement('div');
    div.innerText=`名字: ${e.name} | 动词: ${e.verb1},${e.verb2} | 形容词: ${e.adverb1},${e.adverb2} | 备注: ${e.remark}`;
    container.appendChild(div);
  });
}

// ------------------------
// 工具
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// ------------------------
// 显示结果
function displayCombinations(list){
  const ul=document.getElementById('comboList'); ul.innerHTML='';
  list.forEach(c=>{
    const li=document.createElement('li'); li.innerText=`${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

function displayGifts(list){
  const ul=document.getElementById('giftList'); ul.innerHTML='';
  list.forEach(c=>{
    const li=document.createElement('li'); li.innerText=`${c.sender} 🎁 送给 → ${c.receiver}`;
    ul.appendChild(li);
  });
}

// ------------------------
// 按钮操作
document.getElementById('generateBtn').addEventListener('click', async ()=>{
  if(!isAdmin){ alert("请先登录"); return; }
  const data = await loadData();
  const entries = data.form;
  let verbs=[], adverbs=[];
  entries.forEach(e=>{ verbs.push(e.verb1,e.verb2); adverbs.push(e.adverb1,e.adverb2); });
  verbs=shuffle(verbs); adverbs=shuffle(adverbs);

  const combinations=[];
  entries.forEach(e=>{
    const v = verbs.pop()||"";
    const a = adverbs.pop()||"";
    combinations.push({name:e.name, combo:`${a} ${v}`});
  });

  displayCombinations(combinations);
  await fetch(sheetUrl,{method:'POST', body:JSON.stringify({type:'combo', list:combinations})});
});

document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin){ alert("请先登录"); return; }
  const data = await loadData();
  const entries = data.form;
  const names = entries.map(e=>e.name);
  if(names.length<2){ alert("至少需要两位参与者"); return; }

  let receivers=shuffle([...names]);
  for(let i=0;i<names.length;i++){
    if(names[i]===receivers[i]){
      const j=(i+1)%names.length; [receivers[i],receivers[j]]=[receivers[j],receivers[i]];
    }
  }

  const pairs = names.map((sender,i)=>({sender, receiver:receivers[i]}));
  displayGifts(pairs);
  await fetch(sheetUrl,{method:'POST', body:JSON.stringify({type:'gift', list:pairs})});
});

document.getElementById('clearBtn').addEventListener('click', async ()=>{
  displayCombinations([]); displayGifts([]);
  await fetch(sheetUrl,{method:'POST', body:JSON.stringify({type:'combo', list:[]})});
  await fetch(sheetUrl,{method:'POST', body:JSON.stringify({type:'gift', list:[]})});
});

// ------------------------
// 页面加载
window.onload=()=>{ loadSubmissions(); loadData().then(data=>{ displayCombinations(data.combo); displayGifts(data.gift); }); };
✅ 这个版本完整可用：
