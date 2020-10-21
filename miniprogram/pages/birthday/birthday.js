// miniprogram/pages/birthday/birthday.js
const canvas = wx.createCanvasContext('myCanvas')
const bgMusic = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:0,
    windowWidth: 0,
    imgTest: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/zhangyanmeng/',
    imgPuzzle: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/zhangyanmeng/',
    startLeft: 0,
    startTop: 0,
    HBList: [],
    HBId: 0,
    complete: true,
    audio:'stop',
    puzzle: [{
        id: 0,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 1,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 2,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 3,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 4,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 5,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 6,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 7,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
      {
        id: 8,
        url: '',
        left: 0,
        top: 0,
        zindex: 1
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getHBList',
      // 传给云函数的参数
      data: {
        userId: 0
      },
      success: (res) => {
        console.log('success')
        console.log(res)
        let List = []
        for (let i = 0; i < res.result.data.length; i++) {
          List.push({
            name: res.result.data[i].name,
            happybirthday: res.result.data[i].happybirthday
          })
        }
        this.setData({
          HBList: List,
          imgTest: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/' + List[0].name + '/',
          imgPuzzle: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/' + List[0].name + '/'
        })
        console.log(this.data.HBList)
      },
      fail: console.error
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let p = this.data.puzzle
    for (let i = 0; i < p.length; i++) {
      p[i].zindex = Math.floor((Math.random() * 10) + 1)
    }
    this.setData({
      windowWidth: wx.getSystemInfoSync().windowWidth,
      puzzle: p
    })
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

  },

  up(){
    this.setData({
      pageNum:this.data.pageNum-1
    })
  },

  down(){
    this.setData({
      pageNum:this.data.pageNum+1
    })
  },

  test(e) {
    this.setData({
      startLeft: ((e.touches[0].clientX - e.currentTarget.offsetLeft) / this.data.windowWidth * 750),
      startTop: ((e.touches[0].clientY - e.currentTarget.offsetTop) / this.data.windowWidth * 750)
    })
  },

  test1(e) {
    let p = this.data.puzzle
    let temporary = p[e.currentTarget.id]
    if (Math.abs(temporary.left - temporary.id % 3 * 250) < 50 && Math.abs(temporary.top - Math.floor(temporary.id / 3) * 250) < 50) {
      temporary.left = temporary.id % 3 * 250
      temporary.top = Math.floor(temporary.id / 3) * 250
      temporary.zindex = 0
      p[e.currentTarget.id] = temporary
      this.setData({
        puzzle: p
      })
      var end = true
      for (let i = 0; i < p.length; i++) {
        if (Math.abs(p[i].left - p[i].id % 3 * 250) > 50 || Math.abs(p[i].top - Math.floor(p[i].id / 3) * 250) > 50) {
          end = false
          console.log(i)
          break
        }
      }
      if (end) {
        this.finish()
      }
    }
  },

  move(e) {
    let p = this.data.puzzle
    let temporary = p[e.currentTarget.id]
    temporary.left = (e.touches[0].clientX / this.data.windowWidth * 750 - this.data.startLeft);
    temporary.top = (e.touches[0].clientY / this.data.windowWidth * 750 - this.data.startTop);
    if (temporary.left > 500) {
      temporary.left = 500
    } else if (temporary.left < 0) {
      temporary.left = 0
    }
    if (temporary.top > 500) {
      temporary.top = 500
    } else if (temporary.top < 0) {
      temporary.top = 0
    }
    p[e.currentTarget.id] = temporary
    this.setData({  
      puzzle: p
    })
  },

  finish() {
    console.log("FINISH")
    var that = this
    bgMusic.title = this.data.HBList[this.data.HBId].happybirthday
    bgMusic.src = this.data.HBList[this.data.HBId].happybirthday;
    console.log(this.data.HBList[this.data.HBId].happybirthday)
    bgMusic.onTimeUpdate(() => { //监听音频播放进度
      // console.log(bgMusic.currentTime)
    })
    bgMusic.onEnded(() => { //监听音乐自然播放结束
      console.log("音乐播放结束");
      bgMusic.stop()
      that.setData({
        audio:'rePlay'
      })
    })
    bgMusic.onError((err) => {
      console.log(err)
    })
    bgMusic.play(); //播放音乐
    if (this.data.HBId < this.data.HBList.length - 1) {
      let p = this.data.puzzle
      for (let i = 0; i < p.length; i++) {
        p[i].zindex = Math.floor((Math.random() * 10) + 1)
        p[i].left = 0
        p[i].top = 0
      }
      this.setData({
        windowWidth: wx.getSystemInfoSync().windowWidth,
        puzzle: p
      })
      this.setData({
        HBId: this.data.HBId + 1,
        complete: false,
        imgTest: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/' + this.data.HBList[this.data.HBId + 1].name + '/',
        puzzle: p
      })
    }
   

    setTimeout(() => {
      // this.setData({
      //   imgPuzzle: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/' + this.data.HBList[this.data.HBId].name + '/',
      //   complete: true
      // })
    }, 5000)
    console.log(this.data.imgTest)
  },

  Next() {
    this.setData({
      imgPuzzle: 'cloud://sekiro-9b60a7.7365-sekiro-9b60a7-1258913617/puzzle/' + this.data.HBList[this.data.HBId].name + '/',
      complete: true
    })
  },

  audio(){
    if(this.data.audio =='stop'){
      this.setData({
        audio:"start"
      })
      bgMusic.pause()
    }else if(this.data.audio =='start'){
      this.setData({
        audio:"stop"
      })
      bgMusic.play();
    }else{
      this.setData({
        audio:"stop"
      })
      let that = this
      bgMusic.title = this.data.HBList[this.data.HBId].happybirthday
      bgMusic.src = this.data.HBList[this.data.HBId].happybirthday;
      bgMusic.onEnded(() => { //监听音乐自然播放结束
        console.log("音乐播放结束");
        bgMusic.stop()
        that.setData({
          audio:'rePlay'
        })
      })
      bgMusic.play();
      // bgMusic.seek(0)
      

    }
  }

})