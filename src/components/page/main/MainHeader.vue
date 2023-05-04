<template>
  <div :class="isMainPage && 'page'" :style="isMainPage && { minHeight: pageMinHeight + 'px' }" ref="mainpage">
    <a-spin :spinning="loading">
      <div :class="['main-header',]">
        <div class="title" :style="lang == 'us' ? '' : 'letter-spacing: 0.5vh;'" v-if="showtitle">
          <template v-if="title">{{ title }}</template>
          <slot v-else-if="$slots.title" name="title"></slot>
          <template v-else>{{ routeTitle }} </template>

        </div>
        <div class="form">
          <slot name="form"></slot>
          <ef-form-area v-if="formItems" :i18n="i18n" :loading="loading" :items="formItems" :openSubmit="openSubmit"
            @submit="onSubmit" @change="onChange" />
        </div>

        <transition>
          <div v-show="flag" class="weatchercss">
            <div id="he-plugin-standard"></div>
          </div>
        </transition>

        <div class="actions">
          <a-tooltip v-if="group" :title="$t('group')">
            <bars-outlined @click="groupedit" style="color: rgb(255, 0, 0)" />
          </a-tooltip>
          <a-tooltip v-if="weather" :title="$t('weather')">
            <cloud-outlined @click="showweather" style="color: rgb(0, 153, 255)" />
          </a-tooltip>

          <a-tooltip v-if="uploadjson" :title="$t('uploadjson')">
            <a-upload name="file" :multiple="false" @change="upload_json" :file-list="fileList" :show-upload-list="false"
              :action="uploadapi" accept=".json">
              <upload-outlined style="color: rgb(0, 153, 255)" />
            </a-upload>
          </a-tooltip>
          <a-tooltip v-if="downloadjson" :title="$t('downloadjson')">
            <download-outlined @click="download_json" style="color: rgb(0, 153, 255)" />
          </a-tooltip>

          <a-tooltip v-if="fullscreen" :title="$t('fullscreen')">
            <fullscreen-outlined @click="clickFullscreen" style="color: rgb(0, 153, 255)" />
          </a-tooltip>

          <a-tooltip v-if="goback" :title="$t('goback')">
            <rollback-outlined @click="toBack" style="color: rgb(255, 0, 0)" />
          </a-tooltip>

          <slot name="actions"> </slot>

          <ef-size v-if="$props.onResize || size" v-model:value="sSize" />

          <a-tooltip v-if="$props.onAdd" :title="$t('adds')">
            <plus-square-outlined @click="addnew" style="color: rgb(255, 0, 0)" />
          </a-tooltip>


          <action-columns v-if="columns.length > 0" :columns="columns" v-model:visibleColumns="visibleColumns"
            @reset="onColumnsReset" class="action">
            <!-- <template :slot="slot" v-for="slot in slots">
                <slot :name="slot"></slot>
            </template> -->
          </action-columns>

          <a-tooltip v-if="$props.onRefresh" :title="$t('refresh')">
            <loading-outlined @click="refresh" v-if="loading" />
            <reload-outlined @click="refresh" v-else />
          </a-tooltip>
          <a-tooltip v-if="$props.onExportData || dataTableId" :title="$t('exportData')">
            <file-excel-outlined @click="exportData" />
          </a-tooltip>
          <a-tooltip v-if="$props.onExportImage || imageDomId" :title="$t('exportImage')">
            <file-image-outlined @click="exportImage" />
          </a-tooltip>
          <a-tooltip v-if="mainPageId" :title="$t('fullscreen')">
            <fullscreen-exit-outlined v-if="fullScreen" @click="toggleScreen" />
            <fullscreen-outlined v-else @click="toggleScreen" />
          </a-tooltip>
        </div>
      </div>
      <slot />
    </a-spin>
  </div>
</template>


<script>
import efSize from './Size'
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
import { mapState, mapGetters } from 'vuex'
import { getRoutesMatch } from '@/utils/routerUtil'
import FormArea from './FormArea'
import html2canvas from 'html2canvas'
import { saveToXls, saveToImage } from '@/utils/util'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'MainHeader',
  i18n: {
    messages: {
      cn: {
        refresh: '刷新',
        exportData: '导出数据',
        exportImage: '导出图片',
        fullscreen: '全屏',
        goback: '返回',
        warn: '对不起，您的浏览器不支持全屏模式',
        adds: '新增',
        weather: '天气',
        group: '编辑组',
        uploadjson: '上传Json',
        downloadjson: '下载Json',
      },
      tw: {
        refresh: '刷新',
        exportData: '導出數據',
        exportImage: '导出圖片',
        fullscreen: '全屏',
        goback: '返回',
        warn: '對不起，您的瀏覽器不支持全屏模式',
        adds: '新增',
        weather: '天氣',
        group: '編輯組',
        uploadjson: '上傳Json',
        downloadjson: '下载Json',
      },
      us: {
        refresh: 'Refresh',
        exportData: 'Export data',
        exportImage: 'Export image',
        fullscreen: 'Full screen',
        goback: 'Go Back',
        warn: 'Sorry, your browser does not support full screen mode',
        adds: 'Add',
        weather: 'Weather',
        group: 'Group Edit',
        uploadjson: 'Upload Json',
        downloadjson: 'Download Josn',
      },
    },
  },
  components: {
    EfFormArea: FormArea, efSize,
  },

  props: {
    loading: Boolean,
    isMainPage: { type: Boolean, default: false },
    size: String,
    title: String,
    minHeight: Number,
    mainPageId: String,
    dataTableId: null,
    imageDomId: null,
    formItems: Array,
    openSubmit: Boolean,
    i18n: null,
    goback: Boolean,
    adds: Boolean,
    weather: Boolean,
    group: Boolean,
    uploadjson: Boolean,
    downloadjson: Boolean,
    fullscreen: Boolean,
    showtitle: { type: Boolean, default: true },
    columns: { type: Array, default: () => ([]) },
    onResize: Function,
    onRefresh: Function,
    onExportData: Function,
    onExportImage: Function,
    onAdd: Function,
  },
  data() {
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      fullScreen: false,
      conditions: {},
      sSize: this.size || 'middle',
      flag: false,
      fileList: [],
      visibleColumns: this.columns || [],
    }
  },
  computed: {
    ...mapState('setting', [
      'layout',
      'showPageTitle',
      'pageWidth',
      'pageMinHeight',
    ]),
    ...mapGetters('setting', ['lang']),
    slots() {
      console.log(Object.keys(this.$slots).filter((slot) => slot !== 'title'))
      return []
    },
    routeTitle() {
      const routes = getRoutesMatch(this.$route.fullPath)
      const route = routes && routes.pop()
      return route && route.name
    },
    uploadapi() {
      return process.env.VUE_APP_API_BASE_URL + '/file/upload'
    },
  },
  created() {
    if (this.weather) {
      window.WIDGET = {
        CONFIG: {
          layout: '2',
          // "width": "450",
          // "height": "150",
          background: '1',
          dataColor: 'FFFFFF',
          language: 'zh',
          key: '3418f28424f8492d86e9ab79644cd3a4',
        },
      }
        ; (function (d) {
          var c = d.createElement('link')
          c.rel = 'stylesheet'
          c.href = '/weather/he-standard.css'
          var s = d.createElement('script')
          s.src = '/weather/he-standard.js'
          var sn = d.getElementsByTagName('script')[0]
          sn.parentNode.insertBefore(c, sn)
          sn.parentNode.insertBefore(s, sn)
        })(document)
    }

    this.addListener()
  },
  beforeUnmount() {
    this.removeListener()
  },
  watch: {
    sSize(newVal) {
      this.$emit("resize", newVal)
      $emit(this, "update:size", newVal)
    },
    visibleColumns(newVal) {
      $emit(this, "update:columns", [...newVal])
    },
  },
  methods: {
    onColumnsReset(conditions) {
      $emit(this, 'reset', conditions)
    },
    upload_json(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      this.fileList = fileList
      fileList.map((file) => {
        if (file.response) {
          $emit(this, 'uploadjson', file.response.id)
        }
      })
    },
    download_json() {
      $emit(this, 'downloadjson')
    },
    clickFullscreen() {
      $emit(this, 'fullscreen')
    },
    groupedit() {
      $emit(this, 'group')
    },

    addnew() {
      $emit(this, 'add')
    },

    toBack() {
      history.go(-1)
    },
    showweather() {
      this.flag = !this.flag
    },
    onSubmit(formValues, formOptions) {
      $emit(this, 'submit', formValues, formOptions)
    },
    onChange(formValues, formOptions) {
      $emit(this, 'change', formValues, formOptions)
    },
    exportData() {
      $emit(this, 'exportData')
      this.dataTableId && saveToXls(this.dataTableId)
    },
    exportImage() {
      // $emit(this, 'exportImage')
      // this.imageDomId && saveToImage(this.imageDomId)

      html2canvas(document.getElementById(this.$props.imageDomId), {
        useCORS: true,
      }).then((canvas) => {
        if (navigator.msSaveBlob) {
          // IE10+
          let blob = canvas.msToBlob()
          return navigator.msSaveBlob(blob, name)
        } else {
          let imageurl = canvas.toDataURL('image/png')
          //这里需要自己选择命名规则
          let imagename = ''
          this.fileDownload(imageurl, imagename)
        }
      })
    },
    fileDownload(downloadUrl, downloadName) {
      let aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.href = downloadUrl
      aLink.download = `${downloadName}.jpg`
      // 触发点击-然后移除
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },

    refresh() {
      $emit(this, 'refresh', this.conditions)
    },
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen()
      } else {
        this.inFullScreen()
      }
    },
    inFullScreen() {
      const el = document.getElementById(this.$props.mainPageId) //this.$props.page || this.$refs.main
      el.classList.add('beauty-scroll')
      if (el.requestFullscreen) {
        el.requestFullscreen()
        return true
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
        return true
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
        return true
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
        return true
      }
      this.$message.warn(this.$t('warn'))
      el.classList.remove('beauty-scroll')
      return false
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.$refs.main.classList.remove('beauty-scroll')
    },
    addListener() {
      document.addEventListener('fullscreenchange', this.fullScreenListener)
      document.addEventListener(
        'webkitfullscreenchange',
        this.fullScreenListener
      )
      document.addEventListener('mozfullscreenchange', this.fullScreenListener)
      document.addEventListener('msfullscreenchange', this.fullScreenListener)
    },
    removeListener() {
      document.removeEventListener('fullscreenchange', this.fullScreenListener)
      document.removeEventListener(
        'webkitfullscreenchange',
        this.fullScreenListener
      )
      document.removeEventListener(
        'mozfullscreenchange',
        this.fullScreenListener
      )
      document.removeEventListener(
        'msfullscreenchange',
        this.fullScreenListener
      )
    },
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen
      }
    },
  },
  emits: [
    'uploadjson',
    'submit',
    'change',
    'downloadjson',
    'fullscreen',
    'group',
    'adds',
    'update:columns',
    'update:size'],
}
</script>

<style lang="less" scoped>
.weatchercss {
  position: absolute;
  top: 43px;
  right: 0;
  z-index: 999;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.page {
  padding: 24px;
  border-radius: 4px;
  background-color: @base-bg-color;
}

.main-header {
  display: flex;
  border-radius: 4px;
  transition: all 0.3s;
  margin: 0 0 12px 12px;

  &.middle {
    padding: 12px 16px;
  }

  &.small {
    padding: 8px 12px;
    border: 1px solid @border-color;
    border-bottom: 0;

    .title {
      font-size: 16px;
    }
  }

  .title {
    transition: all 0.3s;
    margin-top: 4px;
    font-size: 18px;
    color: @title-color;
    font-weight: 700;
  }

  .form {
    flex: 1;
    text-align: right;
    margin: 0 24px;
  }

  .actions {
    margin-top: 4px;
    text-align: right;
    font-size: 17px;
    color: @text-color;

    * {
      margin: 0 4px;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>