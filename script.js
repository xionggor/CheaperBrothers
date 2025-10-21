const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyYsUncYkvvc89BsFNb3u5Gesczdy5gtnK5ZQWjJ7u2mnQmSPaTddPQPojorl4HmY8/exec";

// 提交报名
async function submitForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email) return alert("请填写完整信息");

  const payload = { name, email, message };
  const res = await fetch(`${WEB_APP_URL}?action=submitForm`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const result = await res.json();
  if (result.status === "success") {
    alert("提交成功！");
    loadData();
  }
}

// 获取所有报名资料
async function loadData() {
  const res = await fetch(`${WEB_APP_URL}?action=getAllData`);
  const list = await res.json();
  const container = document.getElementById("submittedData");
  container.innerHTML = "";

  list.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} (${item.email}) - ${item.message}`;
    container.appendChild(div);
  });
}

// 主持人登录
async function adminLogin() {
  const password = prompt("请输入主持人密码：");
  const res = await fetch(`${WEB_APP_URL}?action=adminLogin&password=${password}`);
  const ok = await res.json();
  if (ok === true) {
    document.getElementById("adminPanel").style.display = "block";
    alert("登录成功");
  } else {
    alert("密码错误");
  }
}

// 生成组合
async function generateGroups() {
  const res = await fetch(`${WEB_APP_URL}?action=generateGroups`);
  const data = await res.json();
  if (data.status === "success") {
    alert("组合已生成");
    showResults();
  } else {
    alert(data.message);
  }
}

// 生成匹配
async function generateMatches() {
  const res = await fetch(`${WEB_APP_URL}?action=generateMatches`);
  const data = await res.json();
  if (data.status === "success") {
    alert("匹配结果已生成");
    showResults();
  } else {
    alert(data.message);
  }
}

// 显示抽签结果
async function showResults() {
  const res = await fetch(`${WEB_APP_URL}?action=getResults`);
  const data = await res.json();

  const groupDiv = document.getElementById("groupResults");
  const matchDiv = document.getElementById("matchResults");

  groupDiv.innerHTML = data.groups.map(g => `<div>${g}</div>`).join("");
  matchDiv.innerHTML = data.matches.map(m => `<div>${m}</div>`).join("");
}

// 页面加载时自动载入数据与结果
window.onload = () => {
  loadData();
  showResults();
};
