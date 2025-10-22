const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;
const verbExamples = ["跳","跑","吃","笑","唱","打滚","偷吃","飞"];
const adverbExamples = ["快速地","开心地","轻轻地","大声地","慢慢地","笨拙地","优雅地","悄悄地"];

function addExamples(){
  document.getElementById('verb1-example').textContent = "示例: "+pickRandom(verbExamples,4);
  document.getElementById('verb2-example').textContent = "示例: "+pickRandom(verbExamples,4);
  document.getElementById('adverb1-example').textContent = "示例: "+pickRandom(adverbExamples,4);
  document.getElementById('adverb2-example').textContent = "示例: "+pickRandom(adverbExamples,4);
}
function pickRandom(arr,count){
  return [...arr].sort(()=>0.5-Math.random()).slice(0,count).join(", ");
}
addExamples();

// ------------------------
// 表单提交
// ------------------------
document.getElementById('giftForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const data = {
    action:"submit",
    name:document.getElementById('name').value,
    verb1:document.getElementById('verb1').value,
    verb2:document.getElementById('verb2').value,
    adverb1:document.getElementById('adverb1').value,
    adverb2:document.getElementById('adverb2').value,
    remark:document.getElementById('remark').value
  };
  try{
    await fetch(sheetUrl,{method:"POST",body:JSON.stringify(data)});
    alert("提交成功🎉");
    document.getElementById('giftForm').reset();
    loadSubmissions();
  }catch(err){
    console.error(err); alert("提交失败");
  }
});

// ------------------------
// 主持人登录
// ------------------------
document.getElementById('loginBtn').addEventListener('click',()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功，可操作主持人功能");
  }else alert("密码错误");
});

// ------------------------
// 生成组合（每人一组）
document.getElementById('generateBtn').addEventListener('click',async ()=>{
  if(!isAdmin)return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();

  let verbs=[],adverbs=[];
  entries.forEach(e=>{verbs.push(e.verb1,e.verb2);adverbs.push(e.adverb1,e.adverb2);});
  verbs=shuffle(verbs);adverbs=shuffle(adverbs);

  const combos=[];
  entries.forEach(e=>{
    combos.push({name:e.name,combo:`${adverbs.pop()} ${verbs.pop()}`});
  });
  displayResults(combos,"生成组合（每人一组）结果");
});

// ------------------------
// 匹配名字（随机送礼）
document.getElementById('matchBtn').addEventListener('click',async ()=>{
  if(!isAdmin)return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl,{method:"POST",body:JSON.stringify({action:"match"})});
  const data = await res.json();
  if(data.status!=="ok"){alert(data.message);return;}
  displayResults(data.result,"匹配名字（随机送礼）结果",true);
});

// ------------------------
// 加载已提交信息
// ------------------------
async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container=document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    entries.forEach(e=>{
      const div=document.createElement('div');
      div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 副词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark} | 抽签结果: ${e.gift}`;
      container.appendChild(div);
    });
  }catch(err){console.error(err);}
}

// ------------------------
// 工具函数
// ------------------------
function shuffle(array){for(let i=array.length-1;i>0;i--){const j=Math.floor(Math
