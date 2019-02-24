<template>
  <div class="channel-page">
    <div class="channel-hd">
      <span class="left-icon"><van-icon name="arrow-left"/></span>
      <div class="chd-right">
        <div class="input">
          <van-icon name="search"/>
          <span>遊戲名稱</span>
        </div>
        <span class="btn">搜索</span>
      </div>
    </div>
    <van-tabs class="game-tab" v-model="active" :duration="0">
      <van-tab title="熱門遊戲" />
      <van-tab title="線上遊戲"/>
      <van-tab title="手機遊戲"/>
      <van-tab title="Steam專區"/>
    </van-tabs>

    <div v-if="type == 'hot'" class="game-box">
      <van-cell-group>
        <template v-if="0">
          <van-cell class="tle-name" title="熱門手機遊戲"/>
          <van-cell v-for="(v,i) in recommend_data.mobile" :key="`h${v.i}_${i}`" :title="v.n" />
        </template>
        
        <template v-if="0">
          <van-cell class="tle-name" title="熱門線上遊戲"/>
          <van-cell v-for="(v,i) in recommend_data.pc" :key="`h${v.i}_${i}`" :title="v.n"/>
        </template>
        <van-cell to="/game/search"><p class="txt-center orange">找不到遊戲？搜尋一下試一試</p></van-cell>
      </van-cell-group>
    </div>

    <div v-else class="game-box all-game">
      <van-cell-group>
        <no-ssr>
          <virtual-list wclass="virtual-list" :size="zoom_size * .88" :remain="13" :offset="bar_offset">

            <template v-if="game_list">
              <template v-for="(v,i) in idx_game_list">
                <van-cell class="tle-name" :title="i" :key="i"/>
                <van-cell v-for="v2 in v" :key="`${i}_${v2.i}`" :title="v2.n"/>
              </template>
            </template>

            <van-cell><p class="txt-center orange">找不到遊戲？搜尋一下試一試</p></van-cell>
          </virtual-list>
        </no-ssr>
      </van-cell-group>
    </div>
    <ul class="index-bar" v-if="type != 'hot'">
      <li v-for="(v, i) in idx_game_bar" :key="i" @click="clickIdxBar(v)">{{v.letter}}</li>
    </ul>

  </div>
</template>

<script>
import "_SCSS_/game/type.scss";

export default {
  asyncData({ params }) {
    let title = {
      pc: '線上遊戲-遊戲幣、道具、帳號、點數卡、代練-香港8591寶物交易網', 
      mobile: '手機遊戲-代儲、賬號、遊戲幣、代練、禮包-香港8591寶物交易網', 
      hot: '熱門遊戲-手機遊戲、電腦遊戲最新排名-香港8591寶物交易網',
      steam: 'steam專區-提供steam所有遊戲代購/預付卡-香港8591寶物交易網'
    };
    let keyword = {
      pc: '線上遊戲,角色扮演,pc線上遊戲,rpg,遊戲', 
      mobile: '手遊,手機遊戲,安卓遊戲,ios遊戲,手遊交易,安卓,ios,8591手遊', 
      hot: process.env.keywords,
      steam: 'steam, steam中文, steam 儲值, 蒸汽卡, steam點數,steam特價, steam代購, steam下載, steam送禮, steam巴哈,steam代儲, 蒸氣卡,爭氣卡, steam禮物卡, steam 春季特賣, steam 夏季特價,steam好友,steam ptt,steam序號'
    };
    let description = {
      pc: '提供RO仙境傳說Online、新楓之穀、黑色沙漠、英雄聯盟lol等所有線上遊戲道具、遊戲幣、商城道具、點數卡、帳號、代練等所有遊戲寶物的買賣資訊，線上遊戲交易首選8591！', 
      mobile: '提供RO仙境傳說：守護永恆的愛、楓之穀M、黑色沙漠Mobile、天堂M、Fate/Grand Order、石器時代 M等所有安卓/ios手機遊戲代儲、賬號、遊戲幣、代練、禮包等所有遊戲寶物的買賣資訊，安卓/ios手機遊戲交易首選8591！', 
      hot: '遊戲虛寶買賣就上8591，花最少的錢玩最好的遊戲，100%實名認證，百萬玩家信賴，安全保障',
      steam: '香港最專業的steam遊戲代購平臺，steam點數卡/蒸氣卡/預付卡比官網更低，支持steam中文，官方正版，開通steam好友功能，支援steam送禮，春夏季特賣同步活動',
    };

    let data = { pc: 1, mobile: 2, hot: 0, steam: 3 };
    
    return {
      active: data[params.type],
      title: title[params.type], 
      keyword: keyword[params.type], 
      description: description[params.type]
    };
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.keyword },
        { hid: 'description', name: 'description', content: this.description }
      ],
    }
  },
  data() {
    return {
      type: this.$route.params.type,
      loading: 1,
      game_list: '',
      zoom_size: 0,
      bar_offset: 0,
    }
  },
  computed: {
    type_cn_name() {
      let data = { pc: '線上遊戲', mobile: '手機遊戲', hot: '熱門遊戲', steam: 'Steam專區' };
      return data[this.type];
    },
    idx_game_list() {
      if(process.browser && this.type != 'hot'){
        let letter_json = {A:[],B:[],C:[],D:[],E:[],F:[],G:[],H:[],I:[],J:[],K:[],L:[],M:[],N:[],O:[],P:[],Q:[],R:[],S:[],T:[],U:[],V:[],W:[],X:[],Y:[],Z:[],'#':[]};
        for(let v of window[`${this.type}_game_list`]){
          let tag = v.l;

          if(/\d+/g.test(tag)){ //數字時
            letter_json['#'].push(v);
            continue;
          }
          if(!letter_json.hasOwnProperty(tag.toUpperCase())){
            continue;
          }

          letter_json[tag.toUpperCase()].push(v);
        }
        let data = {};
        for(let i in letter_json){
          if(letter_json[i].length){
            data[i] = letter_json[i];
          }
        }
        return data;
      }else{
        return '';
      }
    },
    idx_game_bar() {
      if(process.browser && this.type != 'hot'){
        let tmp_arr = [];
        let now_offset = 0;

        for(let letter in this.idx_game_list){
          let now = this.idx_game_list[letter];
          let data = {letter, offset: now_offset};
          tmp_arr.push(data);
          now_offset += (now.length + 1) * .88 * this.zoom_size;
        }

        return tmp_arr;
      }else{
        return '';
      }
    }
  },
  methods: {
    getData() {
      this.game_list = window[`${this.type}_game_list`];
    },
    clickIdxBar(v) {
      this.bar_offset = v.offset;
      console.log(`點擊當前tab ---> 名稱:${v.letter}, offset:${v.offset}`);
      this.$toast(v.letter);
    }
  },
  mounted() {
    this.zoom_size = zoomSize;
    this.getData();
  },
  watch: {
    active() {
      let data = {0: 'hot', 2: 'mobile', 1: 'pc', 3: 'steam'};
      this.$router.push({path: `/game/${data[this.active]}`, query:{nohistory: 1}});
    }
  }
}
</script>
