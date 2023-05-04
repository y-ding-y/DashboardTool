<template>
  <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
    <div v-if="curdiv" :style="[styleclick]"></div>
    {{ maincontent }}
    <div id="myDiv">
      <video
        v-if="showvideo"
        ref="videsref"
        muted
        id="myVideo"
        class="video-js vjs-big-play-centered vjs-fluid"
        controls
        preload="auto"
        :width="ss.width + 'px'"
      >
        <source type="video/mp4" :src="scrs" />
      </video>
    </div>
  </div>
</template>

<script>
//  import merge from 'deepmerge'
export default {
  inject: ['reload'],
  props: {
    ss: {
      type: Object,
      default: () => ({
        left: 10,
        top: 10,
        width: 100,
        height: 100,
        fontSize: 20,
      }),
    },
    curdiv: { type: Boolean, default: false },
  },
  sockets: {
    // welcom: function (data) {
    //     console.log("welcome data 数据返回 = >", data);
    // },
  },
  data() {
    return {
      isshow: true,
      result: null,
      click_style:{},
      temp_nodejsemit: '',
      //maincontent: this.$props.ss.content,
      animated: this.ss.inanimate,
      refreshData: null,
      scrs: '',
      player: null,
      showvideo: true,
    }
  },
  watch: {
    isshow(vnew, vold) {
      if (this.isshow) {
        this.animated = this.ss.inanimate
      } else if (vnew != vold && !this.isshow) {
        this.animated = this.ss.outanimate
      }
    },
    datebind(vnew, vold) {
      if (this.datebind && vnew != vold) {
        this.handle_search()
      } else {
        this.result = this.ss.content
      }
    },
    datedetail() {
      this.handle_search()
    },
    datesource() {
      this.handle_search()
    },
    datarefresh() {
      if (this.datarefresh) {
        this.refreshData = setInterval(() => {
          this.handle_search()
        }, Number(this.ss.refreshdatatime) * 1000 * 60)
      } else {
        clearInterval(this.refreshData)
        this.refreshData = null
      }
    },
    videourl() {
      //  this.player.dispose();
      this.showvideo = false
      this.handle_show()
    },
  },
  created() {
    this.handle_show()
    if (this.datebind) {
      if (this.datarefresh) {
        this.refreshData = setInterval(() => {
          this.handle_search()
        }, Number(this.ss.refreshdatatime) * 1000 * 60)
      } else {
        this.handle_search()
      }
    }
    this.isshow = this.ss.isshow
    if (this.ss.isshow) {
      this.animated = this.ss.inanimate
    } else {
      this.animated = this.ss.outanimate
    }
  },
  beforeUnmount() {
    clearInterval(this.refreshData)
    this.refreshData = null
  },
  computed: {
    videourl() {
      return this.ss.videourl
    },
    maincontent() {
      if (this.ss.datebind) {
        return this.result
      } else if (this.ss.content) {
        return this.ss.content
      } else {
        return ''
      }
    },
    datarefresh() {
      return this.ss.refreshdata
    },
    datebind() {
      return this.ss.datebind
    },
    datesource() {
      return this.ss.datesource
    },
    datedetail() {
      return this.ss[this.ss.datesource]
    },
    icons() {
      return process.env.VUE_APP_API_WEB_URL
    },
    styleSet: function () {
      var style = {
        //   border: this.curdiv ? '5px solid blue' : '0px',
        position: 'absolute',
        top: this.ss.top + 'px',
        left: this.ss.left + 'px',
        width: this.ss.width + 'px',
        height: this.ss.height + 'px',
        fontSize: this.ss.fontSize + 'px',
        lineHeight: this.ss.height + 'px',
        zIndex: this.ss.zindex,
        color: this.ss.color,
        textAlign: this.ss.textAlign,
        letterSpacing: this.ss.spacing + 'px',
        fontWeight: this.ss.fontweight,
        textDecoration: this.ss.decoration,
        fontStyle: this.ss.fontstyle,
        //transform:this.ss.transform
      }
      //console.log(merge(this.ss, style))
      return style
    },
    styleclick() {
      var style = {
        border: this.curdiv ? '5px solid blue' : '0px',
        position: 'absolute',
        width: this.ss.width + 'px',
        height: this.ss.height + 'px',
      }
      return style
    },
  },
  methods: {
    handle_search() {
      let dtype = this.ss.datetype
      let dsource = this.ss.datesource
      switch (dsource) {
        case 'phpapi':
          this.handle_phpapi(dsource, dtype)
          break
        case 'publicdata':
          this.handle_publicdata(dsource, dtype)
          break
        default:
          break
      }
    },

    handle_phpapi(dsource, dtype) {
      let temp = eval('(' + this.ss[dsource] + ')')
      if (temp.url != '') {
        this.$funAxios
          .reqPost(temp.url, temp.params)
          .then((res) => {
            if (typeof res.data == dtype) {
              this.result = res.data
            } else {
              this.$message.error(this.ss.componentname + '数据格式错误')
            }
          })
          .catch((error) => {
            console.log(error)
            this.result = null
            this.$message.error(this.ss.componentname + 'NetWork Error')
          })
      }
    },

    handle_publicdata(dsource, dtype) {
      let temp = eval('(' + this.ss[dsource] + ')')
      let publicdatatab = Array(this.$localForage.getItem('3dpublicdata'))
      Promise.all(publicdatatab).then((value) => {
        if (value[0] != null) {
          if (value[0].length > 0) {
            if (dtype == 'string') {
              var table = value[0][Number(temp.key)].tabledata
              this.result = table[Number(temp.row) - 1][temp.colname]
            } else if (dtype == 'array') {
              this.result = value[0][Number(temp.key)].tabledata
            }
          }
        }
      })
    },
    handle_show() {
      this.scrs = this.icons + '/file/' + this.videourl
      this.showvideo = true
      this.$nextTick(() => {
        if (document.getElementById('myDiv').childNodes.length == 0) {
          this.scrs = this.icons + '/file/' + this.videourl
          document.getElementById('myDiv').appendChild(this.$refs.videsref)
        }
        this.player = this.$video(
          this.$refs.videsref,
          { playbackRates: [0.25, 0.5, 1, 1.5, 2, 4, 8, 16], autoplay: true },
          function onPlayerReady() {
            this.play()
            this.on('ended', function () {
              this.play()
            })
          }
        )
      })
    },
  },
}
</script>
