let events = []; // 所有事件数组

// 预置示例事件
const defaultEvents = [
    { type: "anniversary", title: "HHXX表白日", date: new Date("2025-01-14T00:00:00.000Z") },
    { type: "anniversary", title: "XX生日", date: new Date("1998-08-04T00:00:00.000Z") },
    { type: "days", title: "XX生日10000天", date: new Date("1998-08-04T00:00:00.000Z"), offset: 10000 }
  ];
  
  // 初始化
  window.onload = function() {
    const saved = localStorage.getItem("events");
    if (saved) {
      // localStorage 有数据就加载
      events = JSON.parse(saved).map(e => {
        e.date = new Date(e.date); // 确保 date 是 Date 对象
        return e;
      });
    } else {
      // localStorage 没数据，写入示例事件
      events = defaultEvents;
      saveEvents();
    }
    renderEvents();
  };

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

// —— 周年倒计时 —— 
function calculateAnniversary(eventDate) {
  const today = new Date();
  let targetDate = new Date(eventDate);
  let anniversary = 1;

  targetDate.setFullYear(today.getFullYear());
  anniversary = today.getFullYear() - eventDate.getFullYear() + 1;

  if (targetDate < today) {
    //anniversary++;
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  const daysLeft = Math.ceil((targetDate - today) / (1000*60*60*24));
  return { daysLeft, anniversary };
}

function addAnniversary() {
  const title = document.getElementById("titleAnniversary").value.trim();
  const date = document.getElementById("dateAnniversary").value;
  if (!title || !date) return alert("请输入标题和日期！");

  events.push({ type: "anniversary", title, date: new Date(date) });
  saveEvents();
  renderEvents();

  document.getElementById("titleAnniversary").value = "";
  document.getElementById("dateAnniversary").value = "";
}

// —— 指定天数倒计时 —— 
function calculateDaysCountdown(startDate, offset) {
  const today = new Date();
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + offset - 1);

  const diffDays = Math.ceil((targetDate - today) / (1000*60*60*24));
  return diffDays;
}

function addDaysCountdown() {
  const title = document.getElementById("titleDays").value.trim();
  const date = document.getElementById("dateDays").value;
  const offset = parseInt(document.getElementById("dayOffset").value, 10);

  if (!title || !date || isNaN(offset)) return alert("请输入完整信息！");
  events.push({ type: "days", title, date: new Date(date), offset });
  saveEvents();
  renderEvents();

  document.getElementById("titleDays").value = "";
  document.getElementById("dateDays").value = "";
  document.getElementById("dayOffset").value = "";
}

// 删除事件
function deleteEvent(index) {
  events.splice(index,1);
  saveEvents();
  renderEvents();
}

// 渲染事件
function renderEvents() {
  const list = document.getElementById("eventList");
  list.innerHTML = "";

  events.forEach((e, index) => {
    let text = "";
    if (e.type === "anniversary") {
      const res = calculateAnniversary(e.date);
      text = `📅 ${e.title} - 第 ${res.anniversary} 周年，距离还有 ${res.daysLeft} 天`;
    } else if (e.type === "days") {
      const diffDays = calculateDaysCountdown(e.date, e.offset);
      const targetDate = new Date(e.date);
      targetDate.setDate(targetDate.getDate() + e.offset - 1);
      text = `📅 ${e.title} - 目标日期 ${targetDate.toISOString().slice(0,10)}，距离还有 ${diffDays} 天`;
    }

    const li = document.createElement("li");
    li.innerHTML = `<span>${text}</span> <button onclick="deleteEvent(${index})">删除</button>`;
    list.appendChild(li);
  });
}

// 实时刷新倒计时
setInterval(renderEvents, 1000);
