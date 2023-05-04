<template>
  <div v-bind:class="theme.mode == 'light' ? divmain2 : divmain">
    <kanban-title
      :key="titleKey"
      :title="'出货看板'"
      :showTime="true"
      @stop="stopFreshData"
      @start="startFreshData"
    />
    <a-row :gutter="[20, 16]">
      <div style="display: flex; justify-content: space-around">
        <a-col :span="4" v-for="(item, i) in titlesums" :key="i">
          <v-title
            :title="item.title"
            :progress="item.per"
            :sum="item.sum"
            :key="i"
            :id="item.key"
          >
          </v-title>
        </a-col>
      </div>
    </a-row>
    <br />
    <a-row :gutter="[20, 16]">
      <a-col :span="14">
        <a-spin :spinning="month_loading">
          <v-bar
            :title="month + '月-date-'"
            :data="month_main"
            :height="month_date_height"
            :position="'name*qty'"
            :xaxios="'name'"
            :yaxios="'qty'"
            :colortype="'type'"
            :series="[
              {
                quickType: 'line',
                position: 'name*total',
                color: 'totaltype',
              },
              {
                quickType: 'point',
                position: 'name*total',
                color: 'totaltype',
              },
            ]"
            :axisstyle="['name', 'qty', 'total']"
          >
          </v-bar>
        </a-spin>
      </a-col>
      <a-col :span="10">
        <a-row :gutter="[20, 16]">
          <a-col :span="12">
            <a-spin :spinning="month_loading">
              <a-spin :spinning="year_loading">
                <v-bar
                  :title="year + '年每月出货'"
                  :data="year_date"
                  :height="year_date_height"
                  :position="'name*qty'"
                  :xaxios="'name'"
                  :yaxios="'qty'"
                >
                </v-bar>
              </a-spin>
            </a-spin>
          </a-col>
          <a-col :span="12">
            <a-spin :spinning="month_loading">
              <a-spin :spinning="year_loading">
                <v-bar
                  :title="year + '各区域出货'"
                  :data="year_date"
                  :height="year_date_height"
                  :position="'name*qty'"
                  :xaxios="'name'"
                  :yaxios="'qty'"
                >
                </v-bar>
              </a-spin>
            </a-spin>
          </a-col>
        </a-row>
        <a-row :gutter="[20, 16]">
          <a-col>
            <a-spin :spinning="month_loading">
              <a-spin :spinning="year_loading">
                <v-bar
                  :title="month + '月各区域出货'"
                  :data="year_date"
                  :height="year_date_height"
                  :position="'name*qty'"
                  :xaxios="'name'"
                  :yaxios="'qty'"
                >
                </v-bar>
              </a-spin>
              <!-- <v-pie :title="month+'月-family-' " :data="month_family" :height="month_family_height">
                              </v-pie> -->
            </a-spin>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="[20, 16]">
      <a-col>
        <a-spin :spinning="family_loading">
          <v-bar
            :title="month + '月各机种'"
            :data="family_main"
            :height="month_family_height"
            :position="'name*qty'"
            :xaxios="'name'"
            :yaxios="'qty'"
            :colortype="'type'"
          >
          </v-bar>
        </a-spin>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import KanbanTitle from '@/pages/kanban/common/kanban_com.vue'
import { reqPost } from '@/services/base'
import bgImg from './base_bg.jpg'
import VTitle from '@/pages/kanban/common/title_com.vue'
import VBar from '@/pages/kanban/common/bar_com.vue'
import VPie from '@/pages/kanban/common/pie_com.vue'

const DataSet = require('@antv/data-set')
const fullHeight = window.screen.height

export default {
  name: 'KanbanShip',
  i18n: require('./i18n'),
  data() {
    return {
      titleKey: 0,
      month_loadcount: 0,
      family_loadcount: 0,
      year_count: 0,
      month_title: '',
      year_title: '',
      index1: true,
      bgImg: bgImg,
      mainChartHeight: (fullHeight - 544 - 1) / 2,

      month_date_height: fullHeight / 2 - 150,
      month_family_height: fullHeight / 2 - 335,
      year_date_height: (fullHeight / 2 - 250) / 2,

      month_date: [],
      month_family: [],
      year_date: [],
      year_family: [],

      month_main: [],
      family_main: [],

      divmain2: 'divmain2',
      divmain: 'divmain',
    }
  },
  computed: {
    ...mapState('setting', ['theme']),
    month_loading() {
      return this.month_loadcount > 0
    },
    year_loading() {
      return this.year_count > 0
    },
    family_loading() {
      return this.family_loadcount > 0
    },
    titlesums() {
      return [
        { key: 'month_so', title: this.month + '月SO確認', sum: 0, per: 100 },
        { key: 'month_io', title: this.month + '月投入', sum: 0, per: 45 },
        { key: 'month_turnin', title: this.month + '月存倉', sum: 0, per: 23 },
        { key: 'month_gg', title: this.year + '月GG单', sum: 0, per: 80 },
        { key: 'month_ship', title: this.month + '月出貨', sum: 0, per: 40 },
        { key: 'year_ship', title: this.year + '年出貨', sum: 0, per: 47 },
      ]
    },

    year() {
      return new Date().getFullYear()
    },
    month() {
      return new Date().getMonth() + 1
    },
  },
  created() {
    // bus.$on("actived", msg => {
    //     var index = this.actived_title.findIndex(e => e.split("_")[0] == msg.split("_")[0])
    //     this.actived_title[index] = msg;
    //     this.actived_title.splice(index, 1, msg)

    // })

    this.handles()
  },

  methods: {
    handles() {
      this.handle_year()
      this.handle_month()
      this.handle_family()
    },
    stopFreshData() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    startFreshData() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.handles()
      this.timer = setTimeout(this.startFreshData, 1000)
    },

    handle_year() {
      // var params_family = {
      //     prop: year_prop,
      //     shipDate: this.year + "-01-01" + "," + this.year + "-12-31",
      //     order: "family",
      //     group: "family,familyName",
      //     select: "sum(qty) as QTY,familyName as NAME,family"
      // };
      var params_time = {
        prop: 'ship',
        shipDate: this.year + '-01-01' + ',' + this.year + '-12-31',
        order: 'month',
        group: 'month',
        select: 'sum(qty) as QTY,month as NAME',
      }

      this.year_count = 1
      //year_time
      var total_year_ship = 0
      reqPost('SFCS_RSBU', params_time).then((res) => {
        this.year_count--
        this.year_date = res.data.map((e) => {
          e.qty = Number(e.qty)
          total_year_ship = total_year_ship + e.qty
          return e
        })
        this.titlesums.some((e) => {
          if (e.key == 'year_ship') {
            e.sum = total_year_ship
          }
        })
      })

      // //year_family
      // reqPost("SFCS_RSBU", params_family).then(res => {
      //     this.year_count--;
      //     var temp = res.data.map(e => {
      //         e.qty = Number(e.qty)
      //         return e;
      //     })
      //     const dv2 = new DataSet.View().source(temp)
      //     dv2.transform({
      //         type: 'percent',
      //         field: 'qty',
      //         dimension: 'name',
      //         as: 'percent',
      //     })
      //     this.year_family = dv2.rows;
      // })
    },

    handle_month() {
      var day = new Date(this.year, this.month, 0)
      var first = this.year + '-' + this.month + '-01'
      var second = this.year + '-' + this.month + '-' + day.getDate()

      this.month_count = 2
      var params_io = {
        prop: 'io',
        workTime: first + ',' + second,
        order: 'date',
        group: 'date',
        routeCode: 'LINEIO',
        select: 'inputQty as QTY,date as Name',
      }
      var params_ship = {
        prop: 'ship',
        shipDate: first + ',' + second,
        order: 'date',
        group: 'date',
        select: 'sum(qty)  as QTY,date as Name',
      }
      var params_gg = {
        prop: 'ship',
        shipDate: first + ',' + second,
        order: 'date',
        group: 'date',
        class: 'SYSTEM',
        select: 'sum(qty)  as QTY,date as Name',
      }
      var temp = []
      this.month_main = []
      this.month_loadcount = 3
      var total_month_io = 0
      reqPost('SFCS_RSBU', params_io).then((res) => {
        this.month_loadcount--
        temp = res.data.map((e) => {
          e.qty = Number(e.qty)
          total_month_io = total_month_io + e.qty
          e.total = total_month_io
          e.totaltype = '累计投入'
          e.type = '投入'
          return e
        })
        this.titlesums.map((e) => {
          if (e.key === 'month_io') {
            e.sum = total_month_io
          }
        })
        var total_month_ship = 0
        reqPost('SFCS_RSBU', params_ship).then((res) => {
          this.month_loadcount--
          temp = [
            ...res.data.map((e) => {
              e.qty = Number(e.qty)
              total_month_ship = total_month_ship + e.qty
              e.total = total_month_ship
              e.totaltype = '累计出货'
              e.type = '出貨'
              return e
            }),
            ...temp,
          ]
          this.titlesums.map((e) => {
            if (e.key === 'month_ship') {
              e.sum = total_month_ship
            }
          })
          var total_month_gg = 0
          reqPost('SFCS_RSBU', params_gg).then((res) => {
            this.month_loadcount--
            temp = [
              ...res.data.map((e) => {
                e.qty = Number(e.qty)
                total_month_gg = total_month_gg + e.qty
                e.total = total_month_gg
                e.type = 'GG'
                e.totaltype = '累计GG'
                return e
              }),
              ...temp,
            ]
            this.titlesums.map((e) => {
              if (e.key === 'month_gg') {
                e.sum = total_month_gg
              }
            })

            reqPost('SFCS_RSBU', params_gg).then((res) => {
              this.month_loadcount--
              temp = [
                ...res.data.map((e) => {
                  return {
                    name: e.name,
                    total: 20000,
                    totaltype: '确认数',
                    qty: 0,
                    type: '确认数',
                  }
                }),
                ...temp,
              ]

              const month_maindv = new DataSet.View().source(temp)
              month_maindv.transform({
                type: 'sort-by',
                fields: ['name'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
              })
              this.month_main = month_maindv.rows
            })
          })
        })
      })
    },

    handle_family() {
      var day = new Date(this.year, this.month, 0)
      var first = this.year + '-' + this.month + '-01'
      var second = this.year + '-' + this.month + '-' + day.getDate()

      this.month_count = 2
      var params_io = {
        prop: 'io',
        workTime: first + ',' + second,
        order: 'family',
        group: 'family,familyName',
        routeCode: 'LINEIO',
        select: 'inputQty as QTY,familyName as Name,family',
      }
      var params_ship = {
        prop: 'ship',
        shipDate: first + ',' + second,
        order: 'family',
        group: 'family,familyName',
        select: 'sum(qty)  as QTY,familyName as Name,family',
      }
      var params_gg = {
        prop: 'ship',
        shipDate: first + ',' + second,
        order: 'family',
        group: 'family,familyName',
        class: 'SYSTEM',
        select: 'sum(qty)  as QTY,familyName as Name,family',
      }
      var temp = []
      this.family_main = []
      this.family_loadcount = 3

      reqPost('SFCS_RSBU', params_io).then((res) => {
        this.family_loadcount--
        temp = res.data.map((e) => {
          e.qty = Number(e.qty)
          e.type = '投入'
          return e
        })

        reqPost('SFCS_RSBU', params_ship).then((res) => {
          this.family_loadcount--
          temp = [
            ...res.data.map((e) => {
              e.qty = Number(e.qty)
              e.type = '出貨'
              return e
            }),
            ...temp,
          ]

          reqPost('SFCS_RSBU', params_gg).then((res) => {
            this.family_loadcount--
            temp = [
              ...res.data.map((e) => {
                e.qty = Number(e.qty)
                e.type = 'GG'
                return e
              }),
              ...temp,
            ]

            reqPost('SFCS_RSBU', params_gg).then((res) => {
              this.family_loadcount--
              temp = [
                ...res.data.map((e) => {
                  return {
                    name: e.name,
                    qty: 0,
                    type: '确认数',
                  }
                }),
                ...temp,
              ]

              const family_maindv = new DataSet.View().source(temp)
              family_maindv.transform({
                type: 'sort-by',
                fields: ['name'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
              })
              this.family_main = family_maindv.rows
            })
          })
        })
      })
    },
  },
  components: {
    VTitle,
    VBar,
    VPie,
    KanbanTitle,
  },
}
</script>

<style lang="less" scoped>
.divmain {
  z-index: -10;
  zoom: 1;
  background: url('./bg3.png') no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  padding: 20px;
}
.divmain2 {
  background: @layout-body-background;
}
.extra-wrap {
  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a:not(:first-child) {
      margin-left: 24px;
    }
  }
}
@media screen and (max-width: 992px) {
  .extra-wrap .extra-item {
    display: none;
  }
}
@media screen and (max-width: 576px) {
  .extra-wrap {
    display: none;
  }
}
.page {
  background-color: @layout-body-background;
}
</style>
