const sheetUrl = "YOUR_DEPLOYED_WEBAPP_URL";

let isAdmin = false;

// 显示示例（HTML里已初始化搞怪例子，这里无需再生成）
function addExamples() {} 
addExamples();

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
  }catch(err){
    alert("提交失败，请稍后再试");
    console.error(err);
  }
});

// 主持人登录
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pw = document.getElementById('adminPassword').value;
  if(pw==="zxc123456"){
    isAdmin=true;
    document.getElementById('admin-controls').style.display="block";
    alert("登录成功！你现在可以操作主持人功能。");
  }else{
    alert("密码错误！");
  }
});

// 生成组合（每人一组）
document.getElementById('generateBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");
  const res = await fetch(sheetUrl);
  const entries = await res.json();

  let verbs=[], adjectives=[];
  entries.forEach(e=>{ verbs.push(e.verb1,e.verb2); adjectives.push(e.adverb1,e.adverb2); });
  verbs=shuffle(verbs); adjectives=shuffle(adjectives);

  const combinations=[];
  entries.forEach(e=>{
    const v = verbs.pop()||"";
    const a = adjectives.pop()||"";
    combinations.push({ name:e.name, combo:`${a} ${v}` });
  });

  displayResults(combinations,"生成组合（每人一组）结果");
});

// 匹配名字（随机送礼）
document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl);
  const entries = await res.json();

  const names = entries.map(e=>e.name);
  if(names.length<2){ alert("至少需要两位参与者"); return; }

  let receivers = shuffle([...names]);
  for(let i=0;i<names.length;i++){
    if(names[i]===receivers[i]){
      const j=(i+1)%names.length;
      [receivers[i],receivers[j]]=[receivers[j],receivers[i]];
    }
  }

  const pairs = names.map((sender,i)=>({ sender, receiver:rece
