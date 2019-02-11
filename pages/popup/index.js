Page({
  data: {
    showDialog: false
  },
  zz:function(){

  },
  //控制 pop 的打开关闭
  b() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },

})
