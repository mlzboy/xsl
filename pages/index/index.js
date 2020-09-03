var common = require("../../utils/common.js")
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    temp_xschool:'',
    show_edit:false,
    start_week:1,
    end_week:1,
    day:1,
    start_course:1,
    end_course:1,
    courses:[1,2,3,4,5,6,7,8,9,10,11,12],
    days:["一","二","三","四","五","六","日"],
    showDialog:false,
    array:[1,2,3,4,5],
    weeks:20,
    xschool:"xx学院",
    xdate:'2019-02-10',
    xweek:2,
    term_data:[],
    current_year:2020,
    current_month:9,
    current_day:3,
    term:""
  },
  onShareTimeline: function(res){
    return {
      title: '教师课表',
      query: '/pages/index/index',
      imageUrl: "/static/ganpei2.png"//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
    onShareAppMessage: function(res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('hhhhhaa')
    }
    if (res.from === "menu"){
      console.log("vvvv")
    }
    
    return {
      title: "教师课表",
      path: "pages/index/index"
      
    }
    },
    //控制 pop 的打开关闭
    b:function() {
      this.setData({
        showDialog: !this.data.showDialog
      });
  
    },
  bindKeyInput(e) {
    this.setData({
      temp_xschool: e.detail.value
    })
  },
    edit:function(){
      console.log("edit")
      this.setData({show_edit:true})
    },
    save:function(){
      console.log("save")
      common.save_data_to_localstorage(this.data.xweek,this.data.xdate,this.data.xschool,this.data.weeks)
      this.setData({show_edit:false,xschool:this.data.temp_xschool})
    },
  onReady:function(){
    var date = new Date();
    let term  = "当前是" + (date.getFullYear()-1).toString() + "-" + date.getFullYear().toString() + "第二学年"
    if (date.getMonth()>=8){
      term  = "当前是" + date.getFullYear().toString() + "-" + (date.getFullYear()+1).toString() + "第一学年"
    }
    this.setData({current_year:date.getFullYear(),current_month:date.getMonth()+1,current_day:date.getDate(),term:term})



    var that = this;
  // 获取系统信息
  wx.getSystemInfo({
    success: function (res) {
      // console.log(res);
      // 可使用窗口宽度、高度
      console.log('height=' + res.windowHeight);
      console.log('width=' + res.windowWidth);
      let _h = res.windowHeight - res.windowWidth / 750 * 610
      console.log("second_height",_h)
      // 计算主体部分高度,单位为px
      that.setData({
        // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
        h: _h
      })
    }})
  //_term_data首先从缓存加载，如果没有再生成
   let [_xweek,_xdate,_xschool,_weeks,_term_data] = common.load_data_from_localstorage(this.data.xweek,this.data.xdate,this.data.xschool,this.data.weeks,this.data.term_data);
  //  console.log("_xweek",_xweek)
   console.error("_xdate",_xdate)

  //  console.log("_school",_xschool)
  //  console.log("_weeks",_weeks)
  //  console.log("_term_data",_term_data)
  // _xdate = common.get_today();
  // console.error(_xdate);


    let array = []
    for(let i = 1; i <=20; ++i ){array.push(i)}
    // console.log("zzzzzzzzzzz",_term_data)
    this.setData({array:array,term_data:_term_data,xweek:_xweek,xdate:_xdate,xschool:_xschool,weeks:_weeks})
  },
  bindPickerChange(e) {
    console.log('当前周选择，携带值为', e.detail.value)
    let idx = parseInt(e.detail.value) 
    console.log("idx-----------------", idx)
    console.log(this.data.array[idx])    
    this.setData({
      xweek: this.data.array[idx]
    })
    common.save_data_to_localstorage(this.data.xweek,this.data.xdate,this.data.xschool,this.data.weeks)
    let _term_data = common.gen_data(this.data.xdate, this.data.xweek, this.data.weeks)
    // console.log("zzzzzzzzzzz", _term_data)
    this.setData({ term_data: _term_data })
  },
  bindPickerChange2(e) {
    console.log('总周选择，携带值为', e.detail.value)
    console.log(typeof e.detail.value)
    let idx = parseInt(e.detail.value) 
    console.log("idx-----------------",idx)
    console.log(this.data.array[idx])
    this.setData({
      weeks:this.data.array[idx]
    })
    common.save_data_to_localstorage(this.data.xweek,this.data.xdate,this.data.xschool,this.data.weeks)
    
    let _term_data = common.gen_data(this.data.xdate, this.data.xweek, this.data.weeks)
    // console.log("zzzzzzzzzzz", _term_data)
    this.setData({ term_data: _term_data })
  },

  bindDateChange(e) {
    this.setData({
      xdate: e.detail.value
    })
    console.log("选择日期为", this.data.xdate)
    common.save_data_to_localstorage(this.data.xweek,this.data.xdate,this.data.xschool,this.data.weeks)
    let _term_data = common.gen_data(this.data.xdate, this.data.xweek, this.data.weeks)
    // console.log("zzzzzzzzzzz", _term_data)
    this.setData({ term_data: _term_data })
  },

  bindChange(e) {
    const val = e.detail.value
    console.log("bind....................",val)
    this.setData({
      start_week: val[0]+1,
      end_week: val[1]+1,
      day: val[2]+1,
      start_course: val[3]+1,
      end_course:val[4]+1
    })
  },
//delete local storage
  clear_course:function()
  {
    common.clear_course()
    let _term_data = common.gen_data(this.data.xdate, this.data.xweek, this.data.weeks)
    // console.log("zzzzzzzzzzz", _term_data)
    this.setData({ term_data: _term_data })
  },
  //change local storage gen_data data
  add_course:function()
  {
    console.log("start_week",this.data.start_week)
    console.log("end_week",this.data.end_week)
    console.log("start_course",this.data.start_course)
    console.log("end_course",this.data.end_course)
    console.log("day",this.data.day)
    if (this.data.start_week == undefined || 
        this.data.end_week == undefined ||
        this.data.start_course == undefined ||
        this.data.end_course == undefined ||
        this.data.day == undefined
    )
    {
      this.setData({error_show:"请拨动起讫周 起讫节"})
    }
    let ret = common.add_course(this.data.start_week,this.data.end_week,this.data.day,this.data.start_course,this.data.end_course)
    if (ret == -1)
    {
      this.setData({error_show:"添加课程不成功！ 注意起讫周、起讫节逻辑 "})
      return;
    }
    let _term_data = common.get_data(this.data.xdate, this.data.xweek, this.data.weeks)
    // console.log("zzzzzzzzzzz", _term_data)
    this.setData({ term_data: _term_data ,error_show:''})

  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '校事历-教学日历',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  }
  


})
