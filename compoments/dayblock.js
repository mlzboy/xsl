// compoments/dayblock.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idata: {
      type: Array, value: [0,0,1,0,1,0,0,0,0,1,0,1]
      },
    is_today:{
      type:Boolean,value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready:function(){

this.setData({idata:this.properties.idata,is_today:this.properties.is_today})


  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
