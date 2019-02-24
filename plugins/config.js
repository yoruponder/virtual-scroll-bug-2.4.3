import { setPageRem, date_format } from "_UTIL_/fn";

export default ({ app, store }, inject) => {
  let config = {
    client: 'mobile',
  };
  inject('config', config);

  let time_stamp = new Date();
  let server_time = {
    time: Math.ceil(time_stamp.getTime() / 1000),
    date: date_format('yyyy-MM-dd hh:mm:ss', time_stamp)
  }
  inject('server_time', server_time);


  //nuxt實例化 設置用戶信息 客户端初始化只執行一次
  if(process.browser){
    setPageRem(750);

    window.pc_game_list = [];
    window.mobile_game_list = [];
    window.web_game_list = [];
    window.steam_game_list = [];

    // console.time('test')
    for (let i in gameList) {
      let data = { ...gameList[i], i: i.replace('_', '') };
      switch (gameList[i].o) {
        case 'pc':
          window.pc_game_list.push(data);
          break;
        case 'mobile':
          window.mobile_game_list.push(data);
          break;
        case 'web':
          window.web_game_list.push(data);
          break;
        case 'steam':
          window.steam_game_list.push(data);
          break;
      }
    }
    // console.timeEnd('test');

  }
}