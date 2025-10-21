const sheetUrl = "你的最新WebApp URL";
let isAdmin = false;

// 搞笑/无下限示例
const verbExamples = ["跳","跑","吃","笑","唱","打滚","偷吃","飞","挖鼻孔","假笑","摸鱼","刷手机","装忙","打嗝"];
const adverbExamples = ["快速地","开心地","轻轻地","大声地","慢慢地","笨拙地","优雅地","悄悄地","尴尬地","心虚地","死命地","若无其事地","边哭边笑地"];

// 添加示例到输入框下方
function addExamples(){
  document.getElementById('verb1-example').textContent = "示例: "+pickRandomExamples(verbExamples,4);
  document.getElementById('verb2-example').textContent = "示例: "+pickRandomExamples(verbExamples,4);
  document.getElementById('adverb1-example').textContent = "示例: "+pickRandomExamples(adverbExamples,4);
  document.getElementById('adverb2-example').textContent = "示例: "+pickRandomExamples(adverbExamples,4);
}
function pickRandomExamples(arr,count){
  const shuffled=[...arr].sort(()=>0.5-Math.random());
  return shuffled.slice(0,count).join("、");
}
addExamples();

// ------------------------
// 提交表单
document.getElementById('giftForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const data={
    name: document.getElementById('name').value,
    verb1: document.getElementById('verb1').value,
    verb2: document.getElementById('verb2').value,
    adverb1: document.getElementById('adverb1').value,
    adverb2: document.getElementById('adverb2').value,
    remark: document.getElementById('remark').value
  };
  try{
    await fetch(sheetUrl+"?action=submit",{method:'POST',body:JSON.stringify(data)});
    alert("提交成功！🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  }catch(err){
    alert("提交失败，请稍后再试");
    console.error(err);
  }
});

// ------------------------
// 主持人登录
document.getElementById('loginBtn').addEventListener('click',()=>{
  const pw=document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功！你现在可以操作主持人功能。");
  }else alert("密码错误！");
});

// ------------------------
// 生成组合（每人一组）
document.getElementById('generateBtn').addEventListener('click',async ()=>{
  if(!isAdmin) return;
  const res=await fetch(sheetUrl+"?action=get");
  const entries=await res.json();

  let verbs=[],adverbs=[];
  entries.forEach(e=>{verbs.push(e.verb1,e.verb2);adverbs.push(e.adverb1,e.adverb2);});
  verbs=shuffle(verbs); adverbs=shuffle(adverbs);

  const combinations=[];
  entries.forEach(e=>{
    const v1=verbs.pop()||"";
    const v2=verbs.pop()||"";
    const a1=adverbs.pop()||"";
    const a2=adverbs.pop()||"";
    combinations.push({name:e.name,combo:`${a1} ${v1}, ${a2} ${v2}`});
  });
  displayResults(combinations);
});

// ------------------------
// 匹配名字（随机送礼，每人一份）
document.getElementById('assignBtn').addEventListener('click',async ()=>{
  if(!isAdmin) return;
  const res=await fetch(sheetUrl+"?action=get");
  const entries=await res.json();

  if(entries.length<2){alert("至少需要2个参与者才能匹配名字！");return;}

  const names=entries.map(e=>e.name);
  let shuffled=shuffle([...names]);

  // 确保没人抽到自己
  for(let i=0;i<names.length;i++){
    if(names[i]===shuffled[i]){
      [shuffled[i],shuffled[(i+1)%names.length]]=[shuffled[(i+1)%names.length],shuffled[i]];
    }
  }

  const combos=[];
  for(let i=0;i<names.length;i++){
    combos.push({name:names[i],combo:shuffled[i]});
  }
  displayResults(combos);
});

// ------------------------
// 加载已提交信息
async function loadSubmissions(){
  try{
    const res=await fetch(sheetUrl+"?action=get");
    const entries=await res.json();
    const container=document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    entries.forEach(e=>{
      const div=document.createElement('div');
      div.style.border="1px solid #ccc";
      div.style.margin="5px 0"; div.style.padding="5px"; div.style.borderRadius="8px"; div.style.backgroundColor="#fff3e0";
      div.innerText=`名字: ${e.name||""} | 动词: ${e.verb1||""}, ${e.verb2||""} | 副词: ${e.adverb1||""}, ${e.adverb2||""} | 备注: ${e.remark||""}`;
      container.appendChild(div);
    });
  }catch(err){console.error("加载提交信息失败:",err);}
}

// ------------------------
// 工具函数
function shuffle(array){for(let i=array.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[array[i],array[j]]=[array[j],array[i]];}return array;}

// ------------------------
// 显示抽签结果
function displayResults(combos){
  const ul=document.getElementById('resultsList');
  ul.innerHTML="";
  combos.forEach(c=>{const li=document.createElement('li'); li.innerText=`${c.name} → ${c.combo}`; ul.appendChild(li);});
}

// 页面加载显示已有提交
window.onload=()=>{loadSubmissions();};
