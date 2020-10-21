// miniprogram/pages/index.js
const bgMusic = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: 0,
    bgmPlayIcon:'../../images/bgmPlay.png',
    bgmStopIcon:'../../images/bgmStop.png',
    bgmUrl:'',
    bgmStatus:true,
    animationData: {},
    StopPosition:''
  },

  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  submitName() {
    console.log(this.data.name)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'findName',
      // 传给云函数的参数
      data: {
        name: this.data.name
      },
      success(res) {
        console.log('success')
        console.log(res)
        if(res.result.data.length == 0){
          wx.navigateTo({
            url: '../errName/errName',
          })
          return
        }
        let time = new Date();
        let timeString = ("0" + (time.getMonth() + 1)).slice(-2) +("0" + (time.getDate() + 1)).slice(-2);
        // if(timeString == res.result.data[0].birthday){
          wx.navigateTo({
            url: '../birthday/birthday',
          })
          return
        // }else{
        //   wx.navigateTo({
        //     url: '../errDate/errDate',
        //   })
        //   return
        // }
      },
      fail:console.error
    })
  },

  listenerButtonPlay: function (src) {
    var that = this
    console.log(src)
    bgMusic.title = src
    bgMusic.src = src;
    bgMusic.onTimeUpdate(() => { //监听音频播放进度
      // console.log(bgMusic.currentTime)
    })
    bgMusic.onEnded(() => { //监听音乐自然播放结束
      console.log("音乐播放结束");
      bgMusic.title = src
      bgMusic.src = src;
      bgMusic.play(); //播放音乐
      bgMusic.seek(0)
  })
    bgMusic.onError((err) => {
      console.log(err)
    })
    bgMusic.play(); //播放音乐
  },
  audioPause: function () {
    let query = wx.createSelectorQuery()
    var that = this
    bgMusic.pause(); //暂停播放音乐
    let q = query.select('.bgmPlay')
    console.log(q)
    wx.createSelectorQuery().select('.bgmPlay').fields({
      computedStyle: ['margin', 'backgroundColor','transform'],
    },function(res){
      res.transform
      res.translateZ
    }).exec(function(res){
      console.log(res[0].transform)
      that.setData({
        StopPosition:"transform:"+res[0].transform
      })
    })
    console.log('暂停')
    this.setData({
      bgmUrl : this.data.bgmStopIcon,
      bgmStatus : false
    })
  },
  audioPlay:async function () {
    var that = this
    bgMusic.play(); //停止播放
    console.log('继续播放')
    this.setData({
      bgmUrl : this.data.bgmPlayIcon
    })
    let s1 = this.data.StopPosition.indexOf('(');
    let s2 = this.data.StopPosition.indexOf(',');
    let e = this.data.StopPosition.indexOf(',',s2+1);
    console.log(this.data.StopPosition.slice(s1+1,s2))
    console.log(this.data.StopPosition.slice(s2+2,e))

    await this.audioPlayRotate(this.data.StopPosition.slice(s2+2,e),this.data.StopPosition.slice(s1+1,s2))
    // await this.audioPlayRotate(this.data.StopPosition.slice(s1),0)
    console.log("begin")
    this.setData({
      bgmStatus : true
    })
    
  },
  audioPlayRotate(sinValue,cosValue){
    return new Promise((resolve,reject)=>{
      
      let angle
      if(sinValue>=0){
        angle = (Math.acos(cosValue)/Math.PI)*180
      }else if(sinValue<0){
        if(cosValue<0){
          angle = -(Math.acos(cosValue)/Math.PI)*180
          console.log(angle)
        }else{
          angle=(Math.asin(sinValue)/Math.PI)*180
        }
      }
      if(angle<0){
        angle+=360
      }
      console.log(angle)
      this.animate('.bgmStop', [{rotateZ:angle},{rotateZ:360}], (360-angle)/360*4000, function(){
        resolve()
      }.bind(this))
      // this.animate('.bgmStop', [{matrix:(0,1,-1,0 ,0,0)},{matrix:(-0.28369,0.95892,-0.95892,0.28369,0,0)}], 4000, function(){
      //   resolve()
      // }.bind(this))
    })
  },
  //停止播放
  listenerButtonStop: function () {
    bgMusic.stop()
    this.setData({
      bgmUrl : this.data.bgmStopIcon,
      bgmStatus : false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var src = 'https://7365-sekiro-9b60a7-1258913617.tcb.qcloud.la/bgm/%E5%B0%8F%E7%BC%98%20-%208%E6%9C%8831%E6%97%A5.mp3?sign=0bf50e2e2439d35cc0dbde5874093575&t=1602079505'
    this.setData({
      bgmUrl : this.data.bgmPlayIcon,
      bgmStatus : true
    })
    that.listenerButtonPlay(src)
    // that.audioPause()
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    that.listenerButtonStop() //页面卸载时停止播放
    console.log("离开")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})