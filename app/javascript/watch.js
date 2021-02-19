function stopWatch() {
  const time = document.getElementById("time");
  const start = document.getElementById("start");
  const rap = document.getElementById("rap");
  const japanStandardTime = 32400000
  
  let timerId;
  let startTime;
  let stoppingTime = 0;

  const nowTime = () => {
    // 呼び出されたときにid="time"のHTMLテキストを10ミリ秒間隔で更新
    const now = new Date(Date.now() - startTime + stoppingTime - japanStandardTime);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliSeconds = String(now.getMilliseconds()).padStart(3, '0');
    time.innerHTML = `${hours}:${minutes}:${seconds}.${milliSeconds}`;

    timerId = setTimeout(nowTime, 10);
  }
  
  // 即時関数を定義して初期状態で呼び出し
  function stopWatchInitial() {
    // id="rap"ボタンののHTMLからinactiveというclassを除く
    rap.classList.add("inactive");
  };
  
  function stopWatchRun() {
    // id="rap"のHTMLにinactiveというclassをつける
    rap.classList.remove("inactive");
  };
  
  // この時点で呼び出すことで初期状態で呼び出されている状態になる
  stopWatchInitial();

  function addRap() {
    const moment = require("moment");
    const time = document.getElementById("time").innerHTML;
    const formData = new FormData();
    formData.append("watch", time);
    const XHR = new XMLHttpRequest();
    XHR.open("POST", "/watches", true);
    XHR.responseType = "json";
    XHR.send(formData);
    XHR.onload = () => {
      if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      } else if (XHR.readyState === XHR.DONE && XHR.status === 200) {
        const content = XHR.response.watch;
        const table = document.getElementById("time-table");
        const createMoment = moment(content.created_at, 'YYYY-MM-DD-T-HH:mm:ssZ')
        const createTime = createMoment.format('YYYY/MM/DD')
        const HTML = `
          <tr>
            <td class="date">${createTime}</td>
            <td class="time">${content.watch}</td>
            <td class="name">admin</td>
            <td class="event">free style</td>
            <td class="distance">200m</td>
          </tr>`;
        table.insertAdjacentHTML("afterbegin", HTML);
      }
    };
  }
  
  // id="start"ボタンがクリックされたときの挙動
  start.addEventListener('click', (e) => {
    // inputタグのvalue属性が"START"のときの挙動
    if (start.value == 'START') {
      // ボタンの表示変更
      start.value = 'STOP';
      rap.value = 'RAP';
      stopWatchRun(); 
      startTime = new Date();
      nowTime();
      e.preventDefault();

    // inputタグのvalue属性が"STOP"のときの挙動
    } else if (start.value == 'STOP') {
      start.value = 'START';
      rap.value = 'RESET';
      clearTimeout(timerId)
      stoppingTime += Date.now() - startTime;
      e.preventDefault();
    }
  });
  
  // id="rap"のボタンがクリックされたときの挙動
  rap.addEventListener('click', (e) => {
    // inputタグのvalue属性が"RESET"のときの挙動
    if (rap.value == 'RESET') {
      rap.value = 'RAP';
      stopWatchInitial();
      stoppingTime = 0;
      time.innerHTML = "00:00:00.000";
      e.preventDefault();

    // inputタグのvalue属性が"RAP"のときの挙動
    } else if (rap.classList.contains("inactive")) {
      return null;
    } else if (rap.value == 'RAP') {
      addRap();
      e.preventDefault();
    }
  });
}

window.addEventListener('load', stopWatch)