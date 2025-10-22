// 🔹 Web App URL
const sheetUrl = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

let isAdmin = false;

// 🔹 示例词语（搞怪动词 + 搞怪形容词）
const verbExamples = [
  "挖鼻孔","打滚撒欢","偷吃圣诞糖","装死","飘起来","拍屁屁",
  "假装唱歌","假笑晃脑袋","掏耳朵给猫听","翻白眼吐舌头","舔手指",
  "和空气握手","撒娇翻滚","当乌龟爬行","假装飘走","摔个四脚朝天",
  "咬自己的脚趾","对墙壁挥拳","模仿外星人","假装隐身","倒立挠头",
  "疯狂甩头发","一边跳舞一边吃冰淇淋","背着猫溜达","假装弹钢琴",
  "吃空气","把袜子当帽子戴","边哭边唱歌","疯狂敲键盘","用脚画圈",
  "打嗝跳跃","假装变身超级英雄","向天吼叫","拿枕头打自己","像鸭子走路",
  "蹦蹦跳跳撞墙","在地上打滚","模仿机器人","假装飞行","舔冰箱门",
  "用头顶西瓜","像青蛙一样蹲跳","吹口哨旋转360度","对镜子讲话","装作不会说话",
  "做鬼脸","拿勺子敲桌子","假装踩到香蕉皮","背着书跑","一边吃糖一边哭"
];

const adjectiveExamples = [
  "悄悄的","尴尬的","疯狂的","像没事人一样的","炸裂的","崩溃的",
  "鬼畜的","一脸问号的","带点绝望的","边哭边笑的","强颜欢笑的",
  "偷偷摸摸的","像企鹅一样的","理直气壮的","假装快乐的","咬牙切齿的",
  "飞快的","缓慢的","像蜗牛一样的","超级猖狂的","做作的","抽风般的",
  "乱七八糟的","忍不住的","瑟瑟发抖的","夸张的","像猫一样灵活的","自顾自的",
  "胡乱挥舞的","咯咯笑着的","边吃边跳的","像风一样的","无厘头的","像小丑般的",
  "夸夸其谈的","像吸血鬼一样的","边滚边叫的","奇怪的","像僵尸般慢慢的",
  "像火箭般冲刺的","边跳边唱的","像外星人一样的","疯狂翻滚的","神经质的",
  "梦游般的","像鹦鹉模仿的","乱喊乱叫的","像章鱼一样摆动的","无节操的","边哭边笑的"
];

// 🔹 显示示例
function addExamples() {
  document.getElementById('verb1-example').textContent = "示例: " + pickRandomExamples(verbExamples, 4);
  document.getElementById('verb2-example').textContent = "示例: " + pickRandomExamples(verbExamples, 4);
  document.getElementById('adverb1-example').textContent = "示例: " + pickRandomExamples(adjectiveExamples, 4);
  document.getElementById('adverb2-example').textContent = "示例: " + pickRandomExamples(adjectiveExamples, 4);
}

function pickRandomExamples(arr, count){
  const shuffled = [...arr].sort(()=>0.5 - Math.random());
  return shuffled.slice(0, count).join(", ");
}

addExamples();

// ------------------------
// 表单提交
// ------------------------
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

// ------------------------
// 主持人登录
// ------------------------
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

// ------------------------
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

// ------------------------
// 匹配名字（随机送礼）
document.getElementById('matchBtn').addEventListener('click', async ()=>{
  if(!isAdmin) return alert("请先登录主持人账号");

  const res = await fetch(sheetUrl);
  const entries = await res.json();

  const names = entries.map(e=>e.name);
  if(names.length<2){ alert("至少需要两位参与者"); return; }

  let receivers = shuffle([...names]);

  // 确保没人送自己
  for(let i=0;i<names.length;i++){
    if(names[i]===receivers[i]){
      const j=(i+1)%names.length;
      [receivers[i],receivers[j]]=[receivers[j],receivers[i]];
    }
  }

  const pairs = names.map((sender,i)=>({ sender, receiver:receivers[i] }));
  displayResults(pairs,"匹配名字（随机送礼）结果",true);
});

// ------------------------
// 加载报名信息
async function loadSubmissions(){
  try{
    const res = await fetch(sheetUrl);
    const entries = await res.json();
    const container = document.getElementById('submissionList');
    container.innerHTML="<h3>已提交信息</h3>";
    entries.forEach(e=>{
      const div=document.createElement('div');
      div.innerText=`名字: ${e.name} | 动词: ${e.verb1}, ${e.verb2} | 形容词: ${e.adverb1}, ${e.adverb2} | 备注: ${e.remark}`;
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
// 显示结果
function displayResults(list,title,isGift=false){
  const ul=document.getElementById('resultsList');
  ul.innerHTML=`<h3>${title}</h3>`;
  list.forEach(c=>{
    const li=document.createElement('li');
    li.innerText=isGift?`${c.sender} 🎁 送给 → ${c.receiver}`:`${c.name} → ${c.combo}`;
    ul.appendChild(li);
  });
}

// 页面加载
window.onload=()=>{ loadSubmissions(); };
