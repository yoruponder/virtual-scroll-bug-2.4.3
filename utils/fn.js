export let setPageRem = (psWidth) => {
    let winWidth = document.documentElement.clientWidth;
    var thisWidth = winWidth > 750 ? 750 : winWidth;
    window.zoomSize = (thisWidth / psWidth).toFixed(4) * 100;
    document.getElementsByTagName('html')[0].style.fontSize = zoomSize + 'px';
}

export let number_format = (num) => {
    var source = String(num).split(".");//按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
    return source.join(".");//再将小数部分合并进来
}

export let date_format = (fmt, date) => {  //eg: date_format('yyyy-MM-dd hh:mm', time)
    //author: meizz   
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export let escape2Html = (str) => {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

export let html2escape = (str) => {
    return str.replace(/[<>"&]/g, function (match, pos, originalText) {
        switch (match) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "\"": return "&quot;";
        }
    });
}

export let json2url = (data) => {
    let url = Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
    return url
}

export let checkTwIdCard = idStr => {
    // 依照字母的編號排列，存入陣列備用。
    var letters = new Array('A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
        'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'X', 'Y', 'W', 'Z', 'I', 'O');
    // 儲存各個乘數
    var multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1);
    var nums = new Array(2);
    var firstChar;
    var firstNum;
    var lastNum;
    var total = 0;
    // 撰寫「正規表達式」。第一個字為英文字母，
    // 第二個字為1或2，後面跟著8個數字，不分大小寫。
    var regExpID = /^[a-z](1|2)\d{8}$/i;
    // 使用「正規表達式」檢驗格式
    if (idStr.search(regExpID) == -1) {
        // 基本格式錯誤
        return false;
    } else {
        // 取出第一個字元和最後一個數字。
        firstChar = idStr.charAt(0).toUpperCase();
        lastNum = idStr.charAt(9);
    }
    // 找出第一個字母對應的數字，並轉換成兩位數數字。
    for (var i = 0; i < 26; i++) {
        if (firstChar == letters[i]) {
            firstNum = i + 10;
            nums[0] = Math.floor(firstNum / 10);
            nums[1] = firstNum - (nums[0] * 10);
            break;
        }
    }
    // 執行加總計算
    for (var i = 0; i < multiply.length; i++) {
        if (i < 2) {
            total += nums[i] * multiply[i];
        } else {
            total += parseInt(idStr.charAt(i - 1)) *
                multiply[i];
        }
    }
    // 和最後一個數字比對
    if (total % 10 != 0) {
        return false;
    }
    return true;
}
export let checkHkIdCard = idStr => {
    let reg = new RegExp(/^[A-Z]{1}[0-9]{6}\([A-Z0-9]{1}\)$/);
    return reg.test(idStr);
}
export let checkMail = mail => {
    let reg = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
    return reg.test(mail);
}

export let checkCnName = val => {
    let reg = new RegExp(/[^\u4e00-\u9fa5,，\s—-]/);
    return reg.test(val);
}

export let checkEnName = val => {
    let reg = new RegExp(/[^a-z,，\s—-]/i);
    return reg.test(val);
}

export let checkTwPhone = val => {
    let reg = new RegExp(/^(?:09)(?!4)\d{8}$/);
    return reg.test(val);
}
export let checkHkPhone = val => {
    let reg = new RegExp(/^(?:4|5|6|7|8|9)\d{7}$/);
    return reg.test(val);
}
export let scrollToTag = (dom, time) => {
    if(process.browser){
        // console.log($(dom).offset().top)
        $('html,body').animate({
            scrollTop: $(dom).offset().top
        }, time || 300);
    }
}
export let date2UnixTime = (date_time) => {
    return Math.floor(Date.parse(new Date(date_time.replace(' ', 'T')+'+08:00')) / 1000);
}

export let formatMsgBody = (msg) => {
    let newMsg = Object.assign({}, msg);

    switch (newMsg.type) {
        case 'msg:txt':
            newMsg.body = html2escape(newMsg.body);
            newMsg.body = newMsg.body.replace(/https?:\/\/[^\s]+/g, function (matches) {
                return '<a target="_blank" href="' + matches + '" title="點擊打開連結">' + matches + '</a>';
            });
            newMsg.body = newMsg.body.replace(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug, (str) => {
                return `<span class="str-emoji">${str}</span>`;
            })
            break;
    }
    return newMsg;
}
