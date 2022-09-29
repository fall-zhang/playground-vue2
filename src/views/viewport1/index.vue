<template>
  <div class="gridsand" id="gridsand">
    <!-- 拓扑图 弹框信息 -->
    <div id="toolTip" class="toolTip">
      <span style="font-size: 20px">{{ stname }}</span
      ><br />
      <span style="padding-right: 85%">万千瓦</span>
      <div id="echartToolTip" style="height: 90%; width: 100%"></div>
    </div>
    <div class="left" v-show="showTypeFlag === '1'">
      <div class="filter-wrap">
        <div class="title">
          <span>图元选择</span>
        </div>
      </div>
      <div class="content">
        <div
          :class="['substaion', { active: subActive == index }]"
          v-for="(item, index) in stationPrimitiveList"
          :key="item.name"
        >
          {{ item.name }}
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div style="display: flex; width: 98vw; overflow: hidden">
      <div class="middle" id="middle-wrap" style="flex: 1 0">
        <div class="middle-box echart-render-box" id="echart-render-box">
          <div class="filter-box">
            <div class="filter-item">
              <span class="filter-item-label">类型：</span>
              <a-select
                dropdownClassName="dropdownClassName"
                default-value="0"
                style="width: 80px"
                @change="showTypeFlagChange"
              >
                <a-select-option value="0"> 全网 </a-select-option>
                <a-select-option value="1"> GIS </a-select-option>
              </a-select>
              <span class="filter-item-label">层级：</span>
              <a-select
                style="width: 90px"
                v-model="stHierarchy"
                @change="handleChange"
              >
                <a-select-option
                  v-for="item in [
                    [1, '一级'],
                    [2, '二级'],
                    [3, '三级']
                  ]"
                  :key="item[0]"
                  :value="item[0]"
                >
                  {{ item[1] }}
                </a-select-option>
              </a-select>
            </div>
            <div class="filter-item">
              <span class="filter-item-label">时间：</span>
              <a-date-picker
                v-model="selectTime"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                @change="handleSubTime"
                show-time
              />
            </div>
            <div class="filter-item" style="width: 20%">
              <span class="filter-item-label">选择的变电站：</span>
              <a-select
                allowClear
                mode="multiple"
                dropdownClassName="dropdownClassName"
                :open="false"
                v-model="selectStIdArr"
                placeholder="请选择"
                style="width: auto"
              >
                <a-select-option
                  v-for="item in selectedSubArr"
                  :key="item.ID"
                  :value="item.KEY"
                >
                  {{ item.VALUE }}
                </a-select-option>
              </a-select>
            </div>
            <div class="filter-item" style="float: right">
              <span class="filter-item-label">线路着色：</span>
              <a-radio-group
                name="radioGroup"
                v-model="renderLineByLoad"
                @change="handleChangeRenderMap"
              >
                <a-radio-button value="dydj"> 电压等级 </a-radio-button>
                <a-radio-button value="ycLineQCLoad"> 负载率 </a-radio-button>
              </a-radio-group>
              <span class="filter-item-label" style="margin-left: 5px"
                >图元着色：</span
              >
              <a-radio-group
                name="radioGroup"
                v-model="renderTyByTense"
                @change="handleChangeRenderTy"
              >
                <a-radio-button value="realTense"> 实时态 </a-radio-button>
                <a-radio-button value="maintenanceState">
                  检修态
                </a-radio-button>
              </a-radio-group>

              <a-checkbox
                v-show="renderTyByTense === 'realTense'"
                v-model="realTime"
                @change="handleChangeRealTime"
                style="margin-left: 5px"
                ><span class="filter-item-label"> 实时刷新</span>
              </a-checkbox>
            </div>
          </div>
          <div class="echart-content">
            <!-- 放大-缩小 -->
            <a-icon
              style="
                font-size: 25px;
                position: absolute;
                z-index: 4;
                right: 0;
                top: 0;
              "
              :type="fullscreenType"
              @click="handleFullscreen"
            />
            <div style="width: 100%; height: 100%" v-if="showTypeFlag === '0'">
              <div id="showView">
                <!-- <ShowGraph id="graph" ref="showGraph"></ShowGraph> -->
              </div>
            </div>
            <!-- 拖拽 到浮层上 -->
            <div class="echart-content-float" id="echart-content-float">
              <span @click="closeFloat" class="closeFloat">X</span>
              <div class="box" id="select_subtion">
                <img
                  id="imgSrcFloat"
                  style="display: block; margin: auto; margin-bottom: 10px"
                />
                <a-select
                  allowClear
                  showSearch
                  v-model="stId"
                  placeholder="请选择"
                  style="width: 240px"
                  :filterOption="false"
                  @search="
                    (val) => {
                      stSelectData = $Common.searchfilter(val, 'stSelectData')
                    }
                  "
                  @change="handleSubstationChange"
                >
                  <a-select-option
                    v-for="item in stSelectData"
                    :key="item.ID"
                    :value="item.ID"
                  >
                    {{ item.VALUE }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <!-- 图列 -->
            <div id="legend" style="width: 30%" v-show="showLegend">
              <span style="font-size: 18px">图例</span>
              <!-- 电压等级 -->
              <div v-show="renderLineByLoad == 'dydj'">
                <p><span>线路</span></p>
                <!-- <p class="line"><span>500kV</span><span style="background:#0073aa;"></span></p> -->

                <p class="line">
                  <span>220kV</span><span style="background: #16d9a3"></span>
                </p>
                <p class="line">
                  <span>110kV</span><span style="background: #dbcf7e"></span>
                </p>
                <p class="line">
                  <span>35kV</span><span style="background: #fca223"></span>
                </p>
              </div>
              <!-- 负载率 -->
              <div v-show="renderLineByLoad == 'ycLineQCLoad'">
                <p><span>线路</span></p>
                <p class="line">
                  <span>&lt;80%</span><span style="background: #16d9a3"></span>
                </p>
                <p class="line">
                  <span>80%~90%</span>
                  <span style="background: #dbcf7e"> </span>
                </p>
                <p class="line">
                  <span>&gt;90%</span>
                  <span style="background: #e85d56"> </span>
                </p>
              </div>
              <div>
                <p><span>变电站</span></p>
              </div>
              <div>
                <p><span>电厂</span></p>
              </div>
            </div>
            <a-spin :spinning="echartMapLoad" style="height: 100%; width: 100%">
              <div
                id="echartBeforeFail"
                style="height: 100%; width: 100%"
              ></div>
            </a-spin>
          </div>
        </div>
        <div
          style="width: 100%"
          @click="
            showUnderInfo =
              showUnderInfo === 1 || showUnderInfo === '1' ? '0' : '1'
          "
        >
          <div
            style="
              height: 25px;
              width: 100%;
              cursor: pointer;
              text-align: center;
              background-color: rgba(19, 89, 104, 0.45);
            "
          >
            <div v-if="showUnderInfo === 1 || showUnderInfo === '1'">
              <i class="el-icon-arrow-down"></i>
              <i class="el-icon-arrow-down"></i>
              <i class="el-icon-arrow-down"></i>
            </div>
            <div v-if="showUnderInfo === 0 || showUnderInfo === '0'">
              <i class="el-icon-arrow-up"></i>
              <i class="el-icon-arrow-up"></i>
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
        <div
          class="middle-box"
          id="account-info"
          v-show="showUnderInfo === 1 || showUnderInfo === '1'"
        >
          <div class="filter-wrap">
            <div class="title">
              <span>设备信息</span>
            </div>
            <div class="btn-box" v-show="!isHideEchartLine">
              <p
                v-for="item in subInfoList"
                :key="item.TR_ID"
                :class="{ active: subType == item.TR_ID }"
                @click="handleChangeSub(item)"
              >
                <span>{{ item.设备名称 }}</span>
              </p>
            </div>
            <div class="risk-box">
              风险定级：
              <span
                v-show="riskLevel"
                :style="'color:' + riskLevelColor(riskLevel)"
                ><em>{{ riskLevel }}</em
                >级</span
              >
            </div>
            <div class="risk-level">
              <span style="color: #ffcd00; font-size: 14px">风险判定依据:</span>
              <span>{{ riskLevelDetailInfo }}</span>
            </div>

            <div
              class="lengend"
              style="height: 100%; float: right; cursor: pointer"
            ></div>
            <div
              class="lengend"
              style="height: 100%; float: right; cursor: pointer"
            ></div>
          </div>
          <div class="content">
            <!-- 风险信息 -->
            <div class="info-wrap" style="padding: 0px">
              <a-descriptions :column="2" v-show="!showPt">
                <a-descriptions-item
                  v-for="item in subInfoItem"
                  :key="item.name"
                  :label="item.name"
                >
                  {{ item.value }}
                </a-descriptions-item>
              </a-descriptions>
              <!-- 陪停设备 -->
              <div style="width: 100%" v-show="showPt">
                <span
                  style="
                    text-align: center;
                    display: block;
                    color: rgba(92, 236, 255, 1);
                    font-size: 14px;
                    font-weight: bold;
                  "
                  >影响设备</span
                >
                <a-table
                  :columns="overhaulColumns"
                  :scroll="{ y: 120 }"
                  :data-source="overhaulPlanList"
                  bordered
                  :pagination="false"
                >
                </a-table>
              </div>
            </div>
            <!-- 图表 -->
            <!--  { isHideEchartLine: isHideEchartLine } -->
            <div class="echarts-wrap">
              <a-spin
                :spinning="echartLineLoad"
                style="height: 100%; width: 100%"
              >
                <div
                  id="echartHistoryLine"
                  style="width: 100%; height: 100%"
                ></div>
              </a-spin>
            </div>
          </div>
        </div>
      </div>
      <!-- key 冲突问题定位 -->
      <div
        class="right"
        style="flex: 0 0 440px"
        :class="fullscreenType === 'fullscreen' ? '' : 'fullscreen'"
        id="right-wrap"
      >
        <!--  检修申请单 -->
        <div class="right-box">
          <div class="filter-wrap">
            <div class="title">
              <span>检修申请单</span>
            </div>
            <a-range-picker
              style="float: right; width: 240px"
              v-model="selectRangeTime"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleChangeOverTime"
            >
              <a-icon slot="suffixIcon" type="caret-down" />
            </a-range-picker>
          </div>
          <div class="content" style="position: relative; overflow: hidden">
            <div class="filter-box">
              <div class="filter-item" style="width: calc(100% - 235px)">
                <span class="filter-item-label">变电站：</span>
                <!-- {{selectSubstation}} -->
                <a-select
                  v-model="filterOverFormBySubId"
                  :maxTagCount="1"
                  mode="tags"
                  style="min-width: 120px"
                  :allowClear="false"
                  @change="handleSubData"
                >
                  <a-select-option
                    v-for="item in selectSubstation"
                    :key="item.YJH_OBJ_ID"
                    :value="item.ID"
                  >
                    {{ item.VALUE }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="filter-item">
                <span class="filter-item-label">排序：</span>
                <a-select
                  v-model="sortName"
                  style="width: 96px"
                  @change="handleSortByName"
                >
                  <a-select-option
                    v-for="item in [
                      { value: 'SUBSORT', label: '变电站' },
                      { value: 'SQGZKSSJ', label: '申请时间' },
                      { value: 'COMPANYSORT', label: '申请单位' }
                    ]"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="filter-item btn-box">
                <span
                  :class="{ active: sortBtn == 'asc' }"
                  @click="handleSort('asc')"
                  >升</span
                >
                <span
                  :class="{ active: sortBtn == 'desc' }"
                  @click="handleSort('desc')"
                  >降</span
                >
              </div>
            </div>
            <div class="filter-content">
              <div
                :class="[
                  'filter-content-item',
                  {
                    'active-arrow':
                      overhaulItemObjIdArr.indexOf(item.OBJID) >= 0,
                    'active-click': item.OBJID == overhaulItemObjId
                  }
                ]"
                v-for="(item, index) in overhaulForm"
                :key="index + '-' + item.OBJID"
                @click="handleSelectOverhaulForm(item)"
              >
                <div class="filter-content-item-bg-arrow"></div>
                <div class="filter-content-item-bg"></div>
                <p class="filter-content-item-title">
                  <span>{{ item.JHBH }}</span>
                  <span
                    >{{ item.TYDW }}
                    <em
                      @click.stop="handleEditOverForm(item)"
                      style="font-style: normal; margin-left: 5px"
                      >编辑</em
                    >
                  </span>
                </p>
                <p class="filter-content-item-time">
                  <span>
                    <em v-show="item.NJH_MATE == 0">年</em>
                    <em v-show="item.NJH_MATE == 1" class="success"
                      >年(正常)</em
                    >
                    <em v-show="item.NJH_MATE == 2" class="warn">年(提前)</em>
                    <em v-show="item.NJH_MATE == 3" class="warn">年(延后)</em>
                    <em v-show="item.YJH_MATE == 0">月</em>
                    <em v-show="item.YJH_MATE == 1" class="success"
                      >月(正常)</em
                    >
                    <em v-show="item.YJH_MATE == 2" class="warn">月(当月)</em>
                    <em v-show="item.YJH_MATE == 3" class="warn">月(跨月)</em>
                  </span>
                  <span>{{ item.SQGZKSSJ }} 至 {{ item.SQGZJSSJ }}</span>
                </p>
                <p class="filter-content-item-info">
                  <span style="font-weight: bold; display: block"
                    >工作内容：</span
                  >
                  <span v-html="item.GZNR" style="color: #fff"></span>
                </p>
                <p class="filter-content-item-info">
                  <span style="font-weight: bold; display: block"
                    >停电范围：</span
                  >
                  <span v-html="item.TDFW" style="color: #fff"></span>
                </p>
                <p class="filter-content-item-footer">
                  <span>{{ item.SQDW }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--  电网风险单 -->
        <div class="right-box relate-power">
          <div class="filter-wrap">
            <div class="title">
              <span>电网风险单</span>
            </div>
          </div>
          <div class="content">
            <div class="filter-content">
              <div
                :class="[
                  'filter-content-item',
                  'active-arrow',
                  'active-click',
                  { 'active-click': item.OBJID == gridRiskItemObjId }
                ]"
                v-for="item in gridRiskForm"
                :key="item.OBJID"
                @click="handleGridRiskForm(item)"
              >
                <div class="filter-content-item-bg-arrow"></div>
                <div class="filter-content-item-bg"></div>
                <p class="filter-content-item-title" style="text-align: center">
                  <span>{{ item.ZT }}</span>
                </p>
                <p class="filter-content-item-time">
                  <span>{{ item.KSSJ }} 至 {{ item.JSSJ }}</span>
                </p>
                <p class="filter-content-item-info">
                  <span style="font-weight: bold; display: block"
                    >风险内容：</span
                  >
                  <span v-html="item.SY" style="color: #fff"></span>
                </p>
                <p class="filter-content-item-info">
                  <span style="font-weight: bold; display: block"
                    >风险分析：</span
                  >
                  <span v-html="item.FXFX" style="color: #fff"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="overFormVisible"
      :maskClosable="false"
      title="关联设备"
      @ok="handleSaveObj"
      @cancel="handleCancelObj"
    >
      <div style="text-align: right">
        <a-button type="primary" @click="handleAddObjList">添加</a-button>
      </div>
      <a-row style="color: #fff; text-align: center; font-size: 16px">
        <a-col :span="8">类型</a-col>
        <a-col :span="12">名称</a-col>
        <a-col :span="4">操作</a-col>
      </a-row>
      <a-row
        style="color: #fff; text-align: center; margin-top: 10px"
        v-for="(item, index) in overFormObjList"
        :key="index"
      >
        <a-col :span="8">
          <a-select
            v-model="item.type"
            @change="handleChangeSubOrLine"
            style="width: 120px"
          >
            <a-select-option value="SUBSTATION">变电站</a-select-option>
            <a-select-option value="LINE">线路</a-select-option>
            <a-select-option value="TRANSFORMER">主变</a-select-option>
            <a-select-option value="BUSLINE">母线</a-select-option>
            <a-select-option value="BREAKER">开关</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="12">
          <!-- {{ nameList }} -->
          <a-select
            v-model="item.name"
            showSearch
            :filterOption="false"
            @search="
              (val) => {
                nameList = $Common.searchfilter(val, 'nameList')
              }
            "
            style="width: 100%"
          >
            <a-select-option
              v-for="item in nameList"
              :key="item.KEY"
              :value="item.ID"
            >
              {{ item.VALUE }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button
            @click="
              () => {
                overFormObjList.splice(index, 1)
              }
            "
            type="danger"
            >删除
          </a-button>
        </a-col>
      </a-row>
    </a-modal>

    <a-modal
      v-model="overhaulPlanInfo"
      :width="900"
      :maskClosable="false"
      :title="titleInfo"
      :footer="null"
    >
      <a-descriptions :column="2" style="min-height: 300px">
        <a-descriptions-item
          v-for="item in planInfoList"
          :key="item.name"
          :label="item.name"
        >
          {{ item.value }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <a-modal
      :title="GISTitle"
      :width="1200"
      :visible="cellDetailVisible"
      @cancel="cellDetailVisible = false"
    >
      <div style="display: flex">
        <div
          style="color: white; width: 50%; height: 600px; padding: 10px"
          id="echartToolTipGIS"
        ></div>
        <div style="color: white; width: 50%; height: 600px">
          <el-image
            style="width: 100%; height: 100%"
            :src="s11"
            :preview-src-list="[s11]"
          >
          </el-image>
        </div>
      </div>
      <div class="drawer-footer" style="background-color: #051e2e">
        <a-button
          :style="{ marginRight: '8px' }"
          @click="cellDetailVisible = false"
        >
          取消
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
const stationPrimitiveList = [
  { name: '500kV变电站', imgName: '500kV' },
  { name: '220kV变电站', imgName: '220kV' },
  { name: '110kV变电站', imgName: '110kV' },
  { name: '35kV变电站', imgName: '35kV' },
  { name: '220kV线路', imgName: '220kV_line' },
  { name: '110kV线路', imgName: '110kV_line' },
  { name: '35kV线路', imgName: '35kV_line' }
]
const overhaulColumns = [
  {
    title: '检修编号',
    dataIndex: 'JHBH',
    align: 'center',
    width: 120
  },
  {
    title: '设备类型',
    dataIndex: 'TYPE',
    align: 'center',
    width: 40
  },
  {
    title: '设备名称',
    dataIndex: 'SNAME',
    align: 'center',
    width: 160
  },
  {
    title: '影响类型',
    dataIndex: 'YXLX',
    align: 'center',
    width: 40
  }
]
const planColumns = []
export default {
  name: 'Gridsand',
  // components: { ShowGraph },
  data() {
    return {
      showUnderInfo: '0',
      cellDetailVisible: false,
      initEchartDetailCell: {},
      GISTitle: '曲线分析图',
      showTypeFlag: '0', // 全页面展示图形类别：0-全网拓扑（默认），1-GIS
      websock: null,
      lockReconnect: false, // 是否真正建立连接
      timeout: 20 * 1000, // 20秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      // 左侧图元
      stationPrimitiveList,
      subActive: null,
      // 中间
      stId: '',
      subId: '',
      s_id: '',
      s_type: '',
      stname: '',
      selectStIdArr: [],
      selectedSubArr: [],
      stHierarchy: 1,
      stSelectData: [],
      selectTime: '',
      subType: '',
      type: '',
      riskLevel: '',
      riskLevelDetailInfo: '',
      subInfoList: [],
      subInfoItem: null,
      renderLineByLoad: 'dydj',
      renderTyByTense: 'realTense',
      echartMapData: [],
      tooltipInfoList: null,
      echartBeforeFail: null,
      echartMapLoad: false,
      fullscreenType: 'fullscreen',
      beforeOption: {
        title: {
          text: '',
          subtext: '单位:万千瓦',
          color: '#fff',
          subtextStyle: {
            align: 'left'
          }
        },
        geo: {
          // 这个是重点配置区
          map: '江苏', // 表示中国地图
          show: true,
          roam: true,
          zoom: 100,
          scaleLimit: {
            min: 10
          },
          center: [119.037533569, 31.67188623535],
          label: {
            normal: {
              show: false, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0)'
              }
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              areaColor: 'rgba(0, 0, 0, 0)',
              opcity: 0
            }
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              areaColor: 'rgba(0, 0, 0, 0)',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0)',
              opcity: 0
            }
          }
        },
        series: []
      },
      echartLineLoad: false,
      echartHistoryLine: null,
      isHideEchartLine: false,
      echartHistoryLineOption: {
        color: ['#37A2FF', '#80FFA5', '#FFBF00'],
        textStyle: {
          color: '#fff'
        },
        title: {
          text: '历史同期负载率曲线',
          left: 'center',
          textStyle: {
            color: 'rgba(92, 236, 255, 1)',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['去年', '今年'],
          textStyle: {
            color: '#fff'
          },
          right: 10,
          top: 10
        },
        grid: {
          left: '3%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: { show: false },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#116d97'
              }
            },
            boundaryGap: false,
            data: [1, 2, 3, 4]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位:万千瓦',
            nameLocation: 'end',
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#116d97'
              }
            }
          }
        ],
        series: [
          {
            name: '去年',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 1
            },
            showSymbol: false,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#37A2FF'
                },
                {
                  offset: 1,
                  color: 'rgba(0, 0, 0,0.1)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            connectNulls: null,
            data: []
          },
          {
            name: '今年',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 1
            },
            showSymbol: false,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#80FFA5'
                },
                {
                  offset: 1,
                  color: 'rgba(16, 70, 58,0.3)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            connectNulls: null,
            data: []
          }
        ]
      },
      // 右侧
      fuzzy: {
        content: ''
      },
      fuzzyActive: true,
      overhaulColumns,
      sortBtn: 'desc',
      sortName: 'SUBSORT',
      overhaulItemObjId: '',
      overhaulItemObjIdArr: [],
      overhaulItemObjS_idArr: [],
      overhaulItemId: '',
      overhaulForm: [],
      gridRiskItemObjId: '',
      gridRiskItemId: '',
      gridRiskForm: [],
      selectRangeTime: null,
      // websock: null,
      showLegend: false,
      showPt: false,
      filterOverFormBySubId: ['all'],
      selectSubstation: [{ ID: 'all', VALUE: '全部' }],
      // 弹框
      overFormVisible: false,
      overFormObjList: [],
      overFormObjId: '',
      nameList: [],
      plantList: [],
      lineList: [],
      tlineList: [],
      transformerList: [],
      buslineList: [],
      breakerList: [],
      // 检修计划详情
      overhaulPlan: false,
      overhaulPlanList: [],
      selectTimeForPlan: [],
      overhaulPlanInfo: false,
      titleInfo: '',
      planColumns,
      planInfoList: [],
      //是否时时刷新
      realTime: false,
      realTimeFlag: false,
      graphNodeList: '',
      mountedStIdArr: [],
      mountedLineIdArr: [],
      mountedsubData: [],
      mountedLineData: [],
      s11: ''
    }
  },
  watch: {
    showUnderInfo(to, from) {
      let _this = this
      _this.$nextTick(() => {
        let dom = document.getElementById('echart-render-box')
        if (to === 0 || to === '0') {
          dom.style.height = 'calc(100% - 25px)'
        } else {
          dom.style.height = 'calc(70% - 25px)'
          _this.echartHistoryLine.setOption(_this.echartHistoryLineOption, true)
        }
      })
    },
    selectStIdArr(val, oldVal) {
      try {
        if (val.length === 0) {
          // this.showUnderInfo = '0'
        } else {
          this.showUnderInfo = '1'
          let id = val[val.length - 1].split('/')[0]
          let name = val[val.length - 1].split('/')[1]
          let cells = this.graphNodeList.cells
          if (id.indexOf('_') != -1) {
            let id1 = id.split('_')[0]
            let id2 = id.split('_')[1]
            for (let i = 0; i < cells.length; i++) {
              if (cells[i].id === id1) {
                this.$refs.showGraph.siv(id1, cells, name)
                break
              } else if (cells[i].id === id2) {
                this.$refs.showGraph.siv(id2, cells, name)
                break
              }
            }
          } else {
            for (let i = 0; i < cells.length; i++) {
              if (cells[i].id === id) {
                this.$refs.showGraph.siv(id, cells, name)
                break
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }

      const deleDataID = 'difference(oldVal, val)'
      console.log('---新/旧/删除---', val, oldVal, deleDataID)
      if (val.length) {
        var deleDataItem = null
        if (deleDataID.length) {
          this.selectedSubArr.forEach((item) => {
            if (item.ID == deleDataID[0]) deleDataItem = item
          })
        }
        this.selectedSubArr = this.selectedSubArr.filter((item) => {
          return val.indexOf(item.ID) >= 0
        })
        const OBJIDArr = []
        this.selectedSubArr.forEach((item) => {
          if (item.OBJID && (!item.isTemp || (item.isTemp && item.NUM > 1))) {
            OBJIDArr.push(item.OBJID)
          }
        })
        if (
          oldVal.length > val.length &&
          deleDataItem.OBJID == this.overhaulItemObjId
        ) {
          this.overhaulItemObjId = ''
        }
        this.$set(this, 'overhaulItemObjIdArr', OBJIDArr)
        this.getEchartsData()
      } else {
        this.selectedSubArr = []
        this.overhaulItemObjS_idArr = []
        this.overhaulItemObjId = ''
        this.$set(this, 'overhaulItemObjIdArr', [])
        this.echartBeforeFail && this.echartBeforeFail.clear()
        this.echartBeforeFail.setOption(this.beforeOption, true)
      }
      // console.log(
      //   '1111111111最终选择的变电站---',
      //   this.selectedSubArr,
      //   this.selectStIdArr,
      //   this.overhaulItemObjS_idArr,
      //   this.overhaulItemObjIdArr
      // )
    },
    selectedSubArr(val, oldVal) {
      if (val.length) {
        this.getPtData()
      } else {
        this.overhaulPlanList = []
      }
    },
    showTypeFlag(to, from) {
      let _this = this
      // _this.selectStIdArr = []
      if (to === '1') {
        _this.$nextTick(() => {
          _this.initEchart()
        })
      } else {
        _this.hideTootip()
        _this.initJsonGraphInMounted()
        _this.echartBeforeFail && _this.echartBeforeFail.clear()
        // _this.initJsonGraph({})
      }
    }
  },
  mounted() {
    this.initEchart()
    this.initDrag()
    this.getOverhaulForm()
    this.getGridRiskForm()
    // 获取变电站和线路对应的下拉框
    this.searchSubstion('plant', '')
    this.searchSubstion('line', '')
    this.searchSubstion('tline', '')
    this.searchSubstion('transformer', '')
    this.searchSubstion('breaker', '')
    this.searchSubstion('busline', '')
    this.initJsonGraphInMounted()
  },
  created() {
    // this.initWebSocket()
  },

  beforeDestroy() {
    // if (this.timeoutObj) {
    //   clearInterval(this.timeoutObj)
    //   this.timeoutObj = null
    // }
    // if (this.serverTimeoutObj) {
    //   clearInterval(this.serverTimeoutObj)
    //   this.serverTimeoutObj = null
    // }
    // if (this.timeoutnum) {
    //   clearInterval(this.timeoutnum)
    //   this.timeoutnum = null
    // }
  },
  destroyed() {
    // 页面销毁时关闭ws连接
    // if (this.websock) {
    //   this.websock.close() // 关闭websocket
    // }
  },
  methods: {
    // 根据厂站id打开指定图片
    openImgByStid() {},
    showTypeFlagChange(val) {
      this.showTypeFlag = val
    },
    handleSeeInfo(value, type) {
      var that = this
      this.overhaulPlanInfo = true
      this.titleInfo = {
        n: '年计划详情',
        zcq: '中长期计划详情',
        y: '月计划详情',
        z: '周计划详情'
      }[type]
      that.planInfoList = []
    },
    // 弹框-表格
    // handleFuzzyQuery() {
    //   // this.fuzzyActive = !this.fuzzyActive
    //   // this.selectTimeForPlan = [moment().format('YYYY-MM') + '-01', moment().format('YYYY-MM-DD')]
    //   this.selectTimeForPlan = this.selectRangeTime
    //   this.overhaulPlan = true
    //   this.overhaulPlanList = this.overhaulFormCopy
    // },
    // handleTimeForPlan() {
    //   const param = {
    //     start: this.selectTimeForPlan ? this.selectTimeForPlan[0] : '',
    //     end: this.selectTimeForPlan ? this.selectTimeForPlan[1] : ''
    //   }
    //   getJxdByDate(param)
    //     .then(res => {
    //       if (res) {
    //         res.forEach(item => {
    //           item.SQGZKSSJ = item.SQGZKSSJ.split('.')[0]
    //           item.SQGZJSSJ = item.SQGZJSSJ.split('.')[0]
    //         })
    //         this.overhaulPlanList = res
    //       }
    //     })
    //     .catch(err => {
    //     })
    // },
    fuzzyBycontent() {
      if (this.fuzzy.content) {
        if (
          this.filterOverFormBySubId.length == 1 &&
          this.filterOverFormBySubId[0] == 'all'
        ) {
          this.overhaulForm = this.overhaulFormCopy
          this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return item.GZNR.indexOf(this.fuzzy.content) > -1
          })
        } else {
          this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return (
              this.filterOverFormBySubId.indexOf(item.STID) > -1 &&
              item.GZNR.indexOf(this.fuzzy.content) > -1
            )
          })
        }
      } else {
        if (
          this.filterOverFormBySubId.length == 1 &&
          this.filterOverFormBySubId[0] == 'all'
        ) {
          this.overhaulForm = this.overhaulFormCopy
        } else {
          this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return this.filterOverFormBySubId.indexOf(item.STID) > -1
          })
        }
      }
      this.sortOverhaulForm(this.sortName)
    },
    // 点击放大or缩小
    handleFullscreen() {
      if (this.fullscreenType == 'fullscreen') {
        this.fullscreenType = 'fullscreen-exit'
        // document.getElementById('right-wrap').style.display = 'none'
        // document.getElementById('account-info').style.display = 'none'
        // document.getElementById('middle-wrap').style.width = 'calc(100% - 0px)'
        // document.getElementById('echart-render-box').style.height = '100%'
      } else {
        this.fullscreenType = 'fullscreen'
        // document.getElementById('right-wrap').style.display = 'block'
        // document.getElementById('account-info').style.display = 'block'
        // document.getElementById('middle-wrap').style.width = 'calc(100% - 554px)'
        // document.getElementById('echart-render-box').style.height = '70%'
      }
      this.echartBeforeFail && this.echartBeforeFail.resize()
    },
    initWebSocket() {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持WebSocket')
        return false
      }
      const wsuri = `${
        process.env.VUE_APP_WEBSOCKET_URL
      }/websocket?access_token=${12}` // websocket地址
      this.websock = new WebSocket(wsuri)
      this.websock.onopen = this.websocketonopen
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    // 连接成功
    websocketonopen() {
      console.log('WebSocket连接成功')
      // 开启心跳
      this.start()
    },
    start() {
      // 开启心跳
      var self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function () {
        // debugger
        // 这里发送一个心跳，后端收到后，返回一个心跳消息
        if (self.websock.readyState == 1) {
          console.log('发送心跳包')
          // 如果连接正常
          self.websock.send('heartbeat')
        } else {
          // 否则重连
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function () {
          // 超时关闭
          self.websock.close()
        }, self.timeout)
      }, self.timeout)
    },
    reset() {
      // 重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      // 重启心跳
      that.start()
    },
    reconnect() {
      // 重新连接
      var that = this
      console.log('进行重连：' + that.lockReconnect)
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function () {
        // 新连接
        that.initWebSocket()
        that.lockReconnect = false
      }, 5000)
    },
    // 接收后端返回的数据
    websocketonmessage(e) {
      console.log(e.data)
      // debugger
      switch (e.data) {
        case 'heartbeat':
          // 收到服务器信息，心跳重置
          this.reset()
          break
        default:
          const data = JSON.parse(e.data)
          this.rebuildEcharts(data)
      }
    },
    // 连接建立失败重连
    websocketonerror(e) {
      console.log(`连接失败的信息：`, e)
      this.reconnect() // 连接失败后尝试重新连接
    },
    // 关闭连接
    websocketclose(e) {
      console.log('断开连接', e)
      if (e.code == 1006) {
        // 重定向到登录页
      }
    },
    // 关闭浮层
    closeFloat() {
      const substation = document.getElementById('echart-content-float')
      substation.style.display = 'none'
    },
    // 根据电压等级或者负载率改变值
    handleChangeRenderMap(val) {
      if (this.showTypeFlag === 0 || this.showTypeFlag === '0') {
        this.$refs.showGraph.dataChange(
          JSON.stringify(this.graphNodeList),
          { mountedLineData: this.mountedLineData },
          this.renderLineByLoad
        )
      } else {
        if (this.echartMapData.lineData) this.renderEcharts(this.echartMapData)
      }
    },
    handleChangeRenderTy(val) {
      this.realTime = false
      // if (this.echartMapData.lineData) this.renderEcharts(this.echartMapData)
    },
    //切换实时刷新或者静止
    handleChangeRealTime(val) {
      const that = this
      if (
        this.renderTyByTense == 'realTense' &&
        this.realTime &&
        !this.realTimeFlag
      ) {
        if (that.$route.path == '/automation/scenapp/gridsand') {
          ;(this.realTimeFlag = true),
            setTimeout(function () {
              that.handleChangeRealTime(val)
            }, 1000 * 60)
        }
      } else {
        this.realTimeFlag = false
      }
    },
    // 根据 变电站、申请时间、申请单位 排序
    handleSortByName(val) {
      this.sortOverhaulForm(val)
    },
    sortOverhaulForm(sortType) {
      this.overhaulForm = []
    },
    // 点击升降-排序
    handleSort(val) {
      this.sortBtn = val
      this.sortOverhaulForm(this.sortName)
    },
    handleChangeOverTime(val) {
      this.getOverhaulForm()
      this.getGridRiskForm()
    },
    // 根据变电站筛选检修单
    handleSubData(val) {
      if (val[val.length - 1] == 'all') {
        this.filterOverFormBySubId = ['all']
        this.overhaulForm = this.overhaulFormCopy
        this.fuzzy.content &&
          (this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return item.GZNR.indexOf(this.fuzzy.content) > -1
          }))
      } else {
        const index = this.filterOverFormBySubId.indexOf('all')
        if (index > -1) this.filterOverFormBySubId.splice(index, 1)
        if (this.fuzzy.content) {
          this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return (
              this.filterOverFormBySubId.indexOf(item.STID) > -1 &&
              item.GZNR.indexOf(this.fuzzy.content) > -1
            )
          })
        } else {
          this.overhaulForm = this.overhaulFormCopy.filter((item) => {
            return this.filterOverFormBySubId.indexOf(item.STID) > -1
          })
        }
      }
      this.sortOverhaulForm(this.sortName)
    },
    // 获取检修申请单
    getOverhaulForm() {
      const param = {
        start: this.selectRangeTime ? this.selectRangeTime[0] : '',
        end: this.selectRangeTime ? this.selectRangeTime[1] : ''
      }
    },
    // 编辑检修单
    handleEditOverForm(item) {
      this.overFormVisible = true
      this.overFormObjId = item.OBJID
      // this.$set(this, 'overFormObjList', [{ type: item.S_TYPE, name: item.S_ID + '' }])
      // this.overFormObjList = [{ type: item.S_TYPE, name: item.S_ID + '' }]
    },
    handleCancelObj() {
      this.overFormVisible = false
      this.nameList = []
      this.overFormObjList = []
    },
    // 保存
    handleSaveObj() {
      var _sIds = ''
      var _sTypes = ''
      if (
        this.overFormObjList.length > 0 &&
        this.overFormObjList[0].type &&
        this.overFormObjList[0].name
      ) {
        this.overFormObjList.forEach((item, index) => {
          if (this.overFormObjList.length - 1 > index) {
            _sIds = _sIds + item.name + ','
            _sTypes = _sTypes + item.type + ','
          } else {
            _sIds = _sIds + item.name
            _sTypes = _sTypes + item.type
          }
        })
      } else {
        this.$message.warning('至少保存一条')
      }
    },
    // 添加设备
    handleAddObjList() {
      const obj = {
        type: '',
        name: ''
      }
      this.overFormObjList.push(obj)
    },
    // 选中检修单
    handleSelectOverhaulForm(item) {
      // 选中之后--判断stid and sid 有值：对该条数据进行操作 无值 返回
      if (item.S_ID && item.STID) {
        this.selectDataOption(item)
      }
    },
    selectDataOption(item) {
      // debugger
      // 选中之后--样式切换
      const objArr = this.overhaulItemObjIdArr
      const _index = objArr.indexOf(item.OBJID)
      const _stID = item.STID + '/' + item.TYDW
      const _stidIndex = this.selectStIdArr.indexOf(_stID)
      if (_index >= 0) {
        // 取消元素
        objArr.splice(_index, 1)
        this.$set(this, 'overhaulItemObjIdArr', objArr)
        if (_stidIndex >= 0) {
          this.selectedSubArr.forEach((el) => {
            if (el.ID == _stID) {
              if (el.NUM == 1) {
                this.selectStIdArr.splice(_stidIndex, 1)
              }
              el.NUM--
            }
          })
          this.overhaulItemObjS_idArr.forEach((el) => {
            if (el.ID == _stID) el.NUM--
          })

          this.selectedSubArr = this.selectedSubArr.filter((el) => {
            return el.NUM > 0
          })
          this.overhaulItemObjS_idArr = this.overhaulItemObjS_idArr.filter(
            (el) => {
              return el.NUM > 0
            }
          )
        }
      } else {
        // 选中元素
        objArr.push(item.OBJID)
        this.$set(this, 'overhaulItemObjIdArr', objArr)
        if (_stidIndex >= 0) {
          this.selectedSubArr.forEach((element) => {
            if (element.ID == _stID && element.type == 'jx') element.NUM++
            if (element.ID == _stID && element.type == 'ty') {
              element.type = 'jx'
              element.NUM = 1
              this.overhaulItemObjS_idArr.push(
                JSON.parse(JSON.stringify(element))
              )
            }
          })
          this.overhaulItemObjS_idArr.forEach((element) => {
            if (element.ID == _stID) element.NUM++
          })
        } else {
          var _stHaveName = false
          var _stHaveIndex = -1
          var _stHaveItem = null
          this.selectedSubArr.forEach((el, index) => {
            if (
              el.VALUE.split('变')[0] == item.TYDW.split('变')[0] &&
              el.type == 'ty'
            ) {
              _stHaveName = true
              _stHaveItem = el
              _stHaveIndex = index
            }
          })
          if (_stHaveName) {
            this.selectedSubArr.splice(_stHaveIndex, 1)
            this.selectStIdArr.splice(
              this.selectStIdArr.indexOf(_stHaveItem.ID),
              1
            )
          }
          const _obj = {
            OBJID: item.OBJID,
            ID: _stID,
            KEY: _stID,
            VALUE: item.TYDW,
            NUM: 1,
            isTemp: false,
            type: 'jx',
            sType: item.S_TYPE,
            sID: item.S_ID,
            JHBH: item.JHBH
          }
          this.selectStIdArr.push(_stID)
          this.selectedSubArr.push(JSON.parse(JSON.stringify(_obj)))
          this.overhaulItemObjS_idArr.push(JSON.parse(JSON.stringify(_obj)))
        }
      }
      console.log(
        '3333333333333选中检修单---',
        this.selectedSubArr,
        this.selectStIdArr,
        this.overhaulItemObjS_idArr
      )
    },
    // 获取电网风险单
    getGridRiskForm() {
      const param = {
        start: this.selectRangeTime ? this.selectRangeTime[0] : '',
        end: this.selectRangeTime ? this.selectRangeTime[1] : '',
        sId: '',
        sType: ''
      }
    },
    // 获取风险定级
    getGridRiskLevel(OBJID) {},
    riskLevelColor(riskLevel) {
      if (riskLevel < 5) return '#e86353'
      if (riskLevel < 6) return '#f6bd15'
      if (riskLevel < 7) return '#5bd8a6'
    },
    // 点击电网风险--目前先不支持点击操作
    handleGridRiskForm(item) {
      this.gridRiskItemObjId = item.OBJID
      this.gridRiskItemId = item.STID
      // if (item.STID != null) {
      //   this.type = 'fx'
      //   this.overhaulItemId = item.STID
      //   this.subId = item.STID
      //   this.s_id = item.S_ID
      //   this.s_type = item.S_TYPE
      //   this.stHierarchy = 1
      // }
    },
    // 获取变电站/线路下拉框
    searchSubstion(type, voltage) {
      const _typeName = type + 'List'
    },
    handleChangeSubOrLine(val) {
      if (val === 'SUBSTATION') {
        this.nameList = JSON.parse(JSON.stringify(this.plantList))
      } else if (val === 'LINE') {
        this.nameList = JSON.parse(JSON.stringify(this.tlineList))
      } else if (val === 'BUSLINE') {
        this.nameList = JSON.parse(JSON.stringify(this.buslineList))
      } else if (val === 'BREAKER') {
        this.nameList = JSON.parse(JSON.stringify(this.breakerList))
      } else {
        this.nameList = JSON.parse(JSON.stringify(this.transformerList))
      }
      this.$Common.getSubData('nameList', this.nameList)
    },
    initEchart() {
      var that = this
      this.echartBeforeFail.setOption(this.beforeOption)
      // this.echartHistoryLine = this.$echarts.init(document.getElementById('echartHistoryLine'))
      // this.echartHistoryLine.setOption(this.echartHistoryLineOption, true)
      this.echartBeforeFail.on('click', function (param) {
        if (param.componentSubType && param.componentSubType === 'scatter') {
          that.isHideEchartLine = false
          const clickItem = that.echartMapData.subData.filter((item) => {
            return item.properties.stid === param.seriesId
          })
          document.getElementById('toolTip').style.left =
            param.event.offsetX - 200 + 'px'
          document.getElementById('toolTip').style.top =
            param.event.offsetY + 'px'
          document.getElementById('toolTip').style.display = 'block'
          that.renderEchartToolTip(clickItem, 'echartToolTip')
        } else if (
          param.componentSubType &&
          param.componentSubType === 'lines'
        ) {
          // debugger
          that.isHideEchartLine = true
          that.hideTootip()
          var lineId = param.seriesId.split(',')[0]
        } else {
          that.hideTootip()
        }
      })
      window.addEventListener('resize', () => {
        this.echartHistoryLine.resize()
        this.echartBeforeFail.resize()
      })
    },
    // 弹窗 + 曲线 + 下属接线图
    initEchartDetail(param, type) {
      try {
        this.GISTitle = '曲线分析图'
        this.initEchartDetailCell = param.cell
        if (type === 'scatter') {
          for (let i = 0; i < this.mountedsubData.length; i++) {
            if (
              this.mountedsubData[i].properties.stid ===
              this.initEchartDetailCell.id
            ) {
              this.GISTitle =
                this.mountedsubData[i].properties.dydj +
                this.mountedsubData[i].properties.name
            }
            // console.log(this.echartMapData.subData[i].properties.stid + ' - ' + this.initEchartDetailCell.id)
          }
          const clickItem = this.mountedsubData.filter((item) => {
            return item.properties.stid === this.initEchartDetailCell.id
          })
          if (clickItem.length > 0) {
            // console.log(clickItem)
            let stid = clickItem[0].properties.stid
            this.cellDetailVisible = true
            this.renderEchartToolTip(clickItem, 'echartToolTipGIS')
            this.openImgByStid(stid)
          }
        } else if (type === 'lines') {
          // this.cellDetailVisible = true
          this.isHideEchartLine = true
          const lineId = this.initEchartDetailCell.id
        }
      } catch (e) {
        console.log(e)
      }
    },
    hideTootip() {
      this.tooltipInfoList = null
      document.getElementById('toolTip').style.left = 0
      document.getElementById('toolTip').style.top = 0
      document.getElementById('toolTip').style.display = 'none'
    },
    // 切换层级
    handleChange() {},
    // 变电站时间改变
    handleSubTime(val) {
      this.initJsonGraphInMounted()
    },
    // 选择变电站-渲染图层
    handleSubstationChange(val) {
      this.stId = ''
      const substation = document.getElementById('echart-content-float')
      substation.style.display = 'none'
      if (val) {
        this.stSelectData.forEach((item) => {
          if (item.ID == val) {
            this.subId = item.KEY
            const _stID = item.KEY + '/' + item.VALUE
            if (this.selectStIdArr.indexOf(_stID) < 0) {
              var _stHaveName = false
              this.selectedSubArr.forEach((el) => {
                if (el.VALUE.split('变')[0] == item.VALUE.split('变')[0]) {
                  _stHaveName = true
                }
              })
              if (!_stHaveName) {
                const _obj = {
                  ID: _stID,
                  KEY: _stID,
                  VALUE: item.VALUE,
                  NUM: 1,
                  isTemp: false,
                  type: 'ty',
                  sType: '',
                  sID: ''
                }
                this.selectStIdArr.push(_stID)
                this.selectedSubArr.push(JSON.parse(JSON.stringify(_obj)))
              }
            }
            // 检修单中的变电站筛选
            let isHaveSelectSub = false
            this.selectSubstation.forEach((el) => {
              if (el.VALUE.split('变')[0] == item.VALUE.split('变')[0])
                isHaveSelectSub = true
            })
            if (!isHaveSelectSub) {
              const index = this.filterOverFormBySubId.indexOf('all')
              if (index > -1) this.filterOverFormBySubId.splice(index, 1)
              this.filterOverFormBySubId.push(item.ID)
              this.selectSubstation.push(item)
              this.overhaulForm = this.overhaulFormCopy.filter((item) => {
                return this.filterOverFormBySubId.indexOf(item.STID) > -1
              })
            }
          }
        })

        // this.type = ''
        // this.s_id = ''
        // this.s_type = ''
      } else {
        this.subId = ''
      }
    },
    // 主变按钮切换
    handleChangeSub(item) {
      this.showPt = false
      this.subType = item.TR_ID
      this.getSubInfoItem(item)
      this.getLoadRateLineData(item.TR_ID)
    },
    // 获取台账信息
    getSubInfoItem(item) {
      var array = []
      for (const key in item) {
        const obj = {
          name: key,
          value: item[key]
        }
        if (key !== 'TR_ID' && key != '参数归算侧_作废') array.push(obj)
      }
      this.$set(this, 'subInfoItem', array)
    },
    // 点击主变获取负载率曲线信息
    getLoadRateLineData(TR_ID) {
      this.showUnderInfo = '1'
      const param = {
        id: TR_ID,
        date: this.selectTime
      }
      this.echartLineLoad = true
    },
    getLoadRateLineDataByLines(TR_ID) {
      this.showUnderInfo = '1'
      const param = {
        id: TR_ID,
        date: this.selectTime
      }
      this.echartLineLoad = true
    },
    // 获取厂站echarts数据
    getEchartsData() {
      var _stId = ''
      var _type = ''
      var _sId = ''
      var _sType = ''
      this.selectStIdArr.forEach((item, index) => {
        if (this.selectStIdArr.length - 1 > index) {
          _stId = _stId + item.split('/')[0] + ','
        } else {
          _stId = _stId + item.split('/')[0]
        }
      })
      this.overhaulItemObjS_idArr.forEach((item, index) => {
        if (this.overhaulItemObjS_idArr.length - 1 > index) {
          _sId = _sId + item.sID + ','
          _type = item.type
          _sType = _sType + item.sType + ','
        } else {
          _sId = _sId + item.sID
          _type = item.type
          _sType = _sType + item.sType
        }
      })
      if (this.showTypeFlag === '1') {
        this.echartMapLoad = true
        if (this.renderTyByTense === 'realTense') {
          this.getEchartsData({
            st_id: _stId,
            type: _type,
            sId: _sId,
            sType: _sType,
            occur_time: this.selectTime,
            level: this.stHierarchy
          }).then((res) => {
            if (res) {
              this.echartMapData = res
              this.echartMapLoad = false
              this.renderEcharts(res)
            } else {
              this.echartMapLoad = false
            }
          })
        } else {
          const _ids = this.overhaulItemObjId
            ? this.overhaulItemObjIdArr.toString() +
              ',' +
              this.overhaulItemObjId
            : this.overhaulItemObjIdArr.toString()
        }
      } else {
        let params = {
          graphId: '6930ddeb-6ad2-4bc5-927b-359ecf9e8a4a', // TODO 暂时给定一个ID查询全网拓扑
          st_id: _stId,
          type: _type,
          sId: _sId,
          sType: _sType,
          occur_time: this.selectTime,
          level: this.stHierarchy
        }
        if (this.renderTyByTense !== 'realTense') {
          params.ids = this.overhaulItemObjId
            ? this.overhaulItemObjIdArr.toString() +
              ',' +
              this.overhaulItemObjId
            : this.overhaulItemObjIdArr.toString()
        }
        if (this.renderTyByTense === 'realTense') {
          this.getEchartsData({
            st_id: _stId,
            type: _type,
            sId: _sId,
            sType: _sType,
            occur_time: this.selectTime,
            level: this.stHierarchy
          }).then((res) => {
            if (res) {
              this.echartMapData = res
              this.goToGIS(params, res)
            }
            this.echartMapLoad = false
          })
        } else {
          const _ids = this.overhaulItemObjId
            ? this.overhaulItemObjIdArr.toString() +
              ',' +
              this.overhaulItemObjId
            : this.overhaulItemObjIdArr.toString()
          this.getEchartsData({
            st_id: _stId,
            type: _type,
            sId: _sId,
            sType: _sType,
            occur_time: this.selectTime,
            level: this.stHierarchy,
            ids: _ids
          }).then((res) => {
            if (res) {
              this.echartMapData = res
              this.goToGIS(params, res)
            }
            this.echartMapLoad = false
          })
        }
      }
    },
    goToGIS(params, echartMapData) {
      let _this = this
      // 通过选中的检修单查询配停表
      if (this.overhaulItemObjS_idArr.length > 0) {
        let objIdList = []
        for (let i = 0; i < this.overhaulItemObjS_idArr.length; i++) {
          objIdList.push(this.overhaulItemObjS_idArr[i].OBJID)
        }
      }
      this.initJsonGraph(params, echartMapData)
    },
    initJsonGraphInMounted() {},
    initJsonGraph(params, echartMapData) {
      // 带参数读取全网拓扑接口
    },
    rebuildEcharts(data) {
      this.echartMapData = data
      this.renderEcharts(data)
    },
    renderLineData(data) {
      const option = this.echartHistoryLine.getOption()
      option.xAxis[0].data = data.xAxis || []
      if (data.preGraph && data.preGraph.length > 0)
        option.series[0].data = this.dataHandle(data.preGraph)
      else option.series[0].data = []
      if (data.curGraph && data.curGraph.length > 0)
        option.series[1].data = this.dataHandle(data.curGraph)
      else option.series[1].data = []
      this.echartHistoryLine && this.echartHistoryLine.clear()
      this.echartHistoryLine.setOption(option)
    },
    //生成tooltip里的柱状图
    renderEchartToolTip(data, className) {
      var that = this
      const name = []
      const valueLoad = []
      const valueLoadRate = []
      const valueRemain = []
      if (data !== null && data.length > 0) {
        that.stname = data[0].properties.name
        data[0].transformers.forEach((item) => {
          name.push(item.trName.split('/')[1])
          valueLoad.push(item.load)
          // valueLoad.push(1073)
          valueRemain.push(item.cap)
          valueLoadRate.push(item.loadRate)
        })
      }
      const CubeLeft = that.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x, shape.y]
          const c1 = [shape.x - 9, shape.y - 9]
          const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9]
          const c3 = [xAxisPoint[0], xAxisPoint[1]]
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath()
        }
      })
      const CubeRight = that.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x, shape.y]
          const c2 = [xAxisPoint[0], xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9]
          const c4 = [shape.x + 18, shape.y - 9]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath()
        }
      })
      const CubeTop = that.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x, shape.y]
          const c2 = [shape.x + 18, shape.y - 9]
          const c3 = [shape.x + 9, shape.y - 18]
          const c4 = [shape.x - 9, shape.y - 9]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath()
        }
      })
      that.$echarts.graphic.registerShape('CubeLeft', CubeLeft)
      that.$echarts.graphic.registerShape('CubeRight', CubeRight)
      that.$echarts.graphic.registerShape('CubeTop', CubeTop)
      const option = {
        grid: {
          left: '5%',
          right: 0,
          bottom: '5%',
          top: '8%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          // 坐标轴指示器，坐标轴触发有效(axis)
          formatter: function (params, valueLoadRate) {
            // console.log(params, 'params')
            let returnData = ''
            let indexColor = '#da953e',
              indexColor2 = '#ff0000',
              indexColor3 = '#ff0000'
            returnData +=
              '<div style="line-height:12px;text-align:center"><span style="font-size:12px;">' +
              params[0].name +
              '</span><br/>'
            returnData +=
              '<span style="display:inline-block;margin-right:-10px;border-radius:10px;width:9px;height:9px;background:' +
              indexColor +
              '"></span>'
            returnData +=
              '<span style="padding-left:13px;font-size:12px">额定功率：' +
              params[0].value +
              '</span>'
            returnData +=
              '<br/><span style="display:inline-block;margin-right:-10px;border-radius:10px;width:9px;height:9px;background:' +
              indexColor2 +
              '"></span>'
            returnData +=
              '<span style="padding-left:13px;font-size:12px">视在功率' +
              params[1].value +
              '</span>'
            returnData +=
              '<br/><span style="display:inline-block;margin-right:-10px;border-radius:10px;width:9px;height:9px;background:' +
              indexColor3 +
              '"></span>'
            returnData +=
              '<span style="padding-left:13px;font-size:12px">负载率：' +
              parseFloat((params[1].value / params[0].value) * 100).toFixed(2) +
              '%' +
              '</span></div>'

            return returnData
          },
          extraCssText: 'font-size: 22px; line-height: 30px'
        },
        xAxis: {
          type: 'category',
          data: name,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          offset: 10,
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            margin: 0,
            fontSize: 12,
            color: '#fff',
            interval: 0
          }
        },
        yAxis: {
          name: '万千瓦',
          min: 0,
          nameTextStyle: {
            color: '#fff',
            fontSize: 16
          },
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(33, 57, 93,.9)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 14,
            color: '#fff'
          },
          nameGap: 20,
          boundaryGap: ['20%', '20%']
        },
        series: [
          {
            type: 'custom',
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: 'rgba(60,135,226,0.1)'
                          },
                          {
                            offset: 1,
                            color: 'rgba(70,176,229,0.1)'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: 'rgba(60,135,226,0.2)'
                          },
                          {
                            offset: 1,
                            color: 'rgba(70,176,229,0.1)'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: 'rgba(60,135,226,0.2)'
                          },
                          {
                            offset: 1,
                            color: 'rgba(70,176,229,0.2)'
                          }
                        ]
                      )
                    }
                  }
                ]
              }
            },
            data: valueRemain
          },
          {
            type: 'custom',
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#da953e'
                          },
                          {
                            offset: 1,
                            color: '#ff0000'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#da953e'
                          },
                          {
                            offset: 1,
                            color: '#ff0000'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new that.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#da953e'
                          },
                          {
                            offset: 1,
                            color: '#ff0000'
                          }
                        ]
                      )
                    }
                  }
                ]
              }
            },
            data: valueLoad
          },
          {
            type: 'bar',
            itemStyle: {
              color: 'transparent'
            },
            tooltip: {},
            data: valueLoad
          }
        ]
      }
      that.$nextTick(() => {
        that.tooltipInfoList = that.$echarts.init(
          document.getElementById(className)
        )
        that.tooltipInfoList.setOption(option)
      })
    },
    // 对返回的数据格式进行处理
    dataHandle(data) {
      const array = []
      var _boolen = false
      data.forEach((element) => {
        if (element == null || element == '') array.push(null)
        else {
          _boolen = true
          array.push(element)
        }
      })
      return _boolen ? array : []
      // return array
    },
    renderEcharts(echartData) {
      const that = this
      const option = that.echartBeforeFail.getOption()
      // that.echartBeforeFail.clear();
      // var color = ['#a6c84c', '#ffa022', '#46bee9']
      var series = []
      var centerCoord = ''
      var coordsQC = []
      var iconSrc = null
      let isShoeEffect = false
      var itemLabelColor = '#fff'
      var itemImgSize = [70, 70]
      var _subData = null
      var _lineData = null
      _subData = echartData.subData
      _lineData = echartData.lineData
      // if (this.renderTyByTense == 'realTense') {
      //   _subData = echartData.subData
      //   _lineData = echartData.lineData
      // } else {
      //   _subData = echartData.subData_area
      //   _lineData = echartData.lineData_area
      // }
      if (_subData && _subData.length > 0) {
        centerCoord = _subData[0].geometry.coordinates
        _subData.forEach((item, i) => {
          if (item.properties.stid == that.subId) {
            centerCoord = item.geometry.coordinates
          }
          if (item.properties.dydj == '500kV') {
            itemLabelColor = '#0073aa'
            itemImgSize = [85, 85]
          }
          if (item.properties.dydj == '220kV') {
            itemLabelColor = '#16D9A3'
            itemImgSize = [80, 80]
          }
          if (item.properties.dydj == '110kV') {
            itemLabelColor = '#DBCF7E'
            itemImgSize = [75, 75]
          }
          if (item.properties.dydj == '35kV') {
            itemLabelColor = '#FCA223'
            itemImgSize = [70, 70]
          }
          if (item.properties.subType == 'PLANT') {
            itemImgSize = [85, 95]
          }
          series.push({
            name: item.properties.name,
            id: item.properties.stid,
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                // color: '{col}',
                show: true,
                position: 'right',
                formatter: function (params) {
                  if (item.type == 'jx') {
                    return '{one|' + params.name + '}'
                  } else {
                    return '{two|' + params.name + '}'
                  }
                },
                rich: {
                  one: {
                    color: 'red'
                  },
                  two: {
                    color: '#fff'
                  }
                }
              }
            },
            symbol: function (value, params) {
              return 'image://data:image/png;base64,' + item.base64
            },
            symbolSize: itemImgSize,
            emphasis: {
              scale: true,
              label: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            symbolKeepAspect: true,
            showEffectOn: 'render',
            itemStyle: {
              color: '#fff'
            },
            data: [
              {
                name: item.properties.name,
                value: item.geometry.coordinates
              }
            ]
          })
        })
      }
      if (_lineData && _lineData.length > 0) {
        _lineData.forEach((item, index) => {
          if (item.properties.ycToQC.indexOf('-') != -1) {
            // 带负号
            coordsQC = [
              item.geometry.coordinates[1],
              item.geometry.coordinates[0]
            ]
          } else {
            coordsQC = [
              item.geometry.coordinates[0],
              item.geometry.coordinates[1]
            ]
          }
          // icon

          if (item.properties.icon == 'fx') {
            iconSrc = {}
          } else if (item.properties.icon == 'jx') {
            iconSrc = {}
          } else {
            iconSrc = 'transparent'
          }

          if (Number(item.properties.ycLineQC) > 0) isShoeEffect = true
          else isShoeEffect = false
          series.push({
            name: item.properties.name,
            id: `${item.properties.aclineId},${index}`,
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: isShoeEffect,
              period: 6,
              trailLength: 0,
              symbol: 'pin',
              symbolSize: 10
            },
            label: {
              show: true,
              color: '#fff',
              position: 'middle',
              formatter: function (params) {
                return ` ${
                  item.properties.ycLineQC + '\n' + item.properties.name
                } {a|}` // 地图上展示文字 + 数值,
              },
              rich: {
                a: {
                  width: 30,
                  height: 30,
                  backgroundColor: iconSrc
                }
              }
            },
            large: true,
            largeThreshold: 100,
            lineStyle: {
              normal: {
                color: function (val) {
                  // console.log('1111' + item.properties.dydj)
                  //  alert("242")
                  if (that.renderLineByLoad == 'dydj') {
                    if (that.renderTyByTense == 'maintenanceState') {
                      if (item.properties.icon == 'jx') {
                        return '#DCDCDC'
                      }
                    }
                    if (Number(item.properties.ycLineQCLoad) <= 0) {
                      return '#DCDCDC'
                    }
                    if (item.properties.dydj == '500kV') {
                      return '#0073aa'
                    }
                    if (item.properties.dydj == '220kV') {
                      return '#16D9A3'
                    }
                    if (item.properties.dydj == '110kV') {
                      return '#DBCF7E'
                    }
                    if (item.properties.dydj == '35kV') {
                      return '#FCA223'
                    }
                  } else {
                    if (that.renderTyByTense == 'maintenanceState') {
                      if (item.properties.icon == 'jx') {
                        return '#DCDCDC'
                      }
                    }
                    if (Number(item.properties.ycLineQCLoad) <= 0) {
                      return '#DCDCDC'
                    } else if (Number(item.properties.ycLineQCLoad) < 80) {
                      return '#16D9A3'
                    } else if (Number(item.properties.ycLineQCLoad) > 90) {
                      return '#e85d56'
                    } else {
                      return '#DBCF7E'
                    }
                  }
                },
                width: 3,
                opacity: 0.8,
                curveness: item.properties.curveness
              }
            },
            data: [{ coords: coordsQC }]
          })
        })
      }
      option.series = series
      // console.log(option)
      option.title[0].text = echartData.qcTime
      option.geo[0].center = centerCoord || [119.037533569, 31.67188623535]
      this.echartBeforeFail && this.echartBeforeFail.clear()
      that.echartBeforeFail.setOption(option)
    },
    // 元素-拷贝拖拽
    initDrag() {
      this.stationPrimitiveList.forEach((item, index) => {
        const _id = 'substaion_' + item.imgName
        this.cloneMove(document.getElementById(_id), index)
      })
    },
    cloneMove(cloneMoves, index) {
      var that = this
      var disX = 0
      var disY = 0
      if (cloneMoves !== null) {
        cloneMoves.onmousedown = function (event) {
          disX = event.clientX
          disY = event.clientY
          that.subActive = index
          var cloneTemp = cloneMoves.cloneNode(true)
          var isMove = false
          document.onmousemove = function (event) {
            var substation = document.getElementById('select_subtion')
            document.getElementById('echart-content-float').style.display =
              'block'
            var cloneTempSrc = cloneTemp.getAttribute('src')
            var src = ''
            if (cloneTempSrc.includes('active')) src = cloneTempSrc
            document.getElementById('imgSrcFloat').setAttribute('src', src)

            isMove = true
            var iL = event.clientX - 167 - 120
            var iT = event.clientY - 164 - 32
            substation.style.left = iL + 'px'
            substation.style.top = iT + 'px'
            substation.style.display = 'block'
            return false
          }
          document.onmouseup = function (event) {
            document.onmousemove = null
            document.onmouseup = null
            var substation = document.getElementById('select_subtion')
            var height =
              document.getElementById('echart-content-float').clientHeight - 130
            var width =
              document.getElementById('echart-content-float').clientWidth - 240
            var iL = event.clientX - 167 - 120
            var iT = event.clientY - 164 - 32
            if (isMove) {
              if (iL < 0) {
                if (iT < 0) {
                  substation.style.left = 0 + 'px'
                  substation.style.top = 0 + 'px'
                }
                if (iT > 0 && iT < height) {
                  substation.style.left = 0 + 'px'
                  substation.style.top = iT + 'px'
                }
                if (iT >= height) {
                  substation.style.left = 0 + 'px'
                  substation.style.top = height + 'px'
                }
              }
              if (iL > 0 && iL < width) {
                if (iT < 0) {
                  substation.style.left = iL + 'px'
                  substation.style.top = 0 + 'px'
                }
                if (iT > 0 && iT < height) {
                  substation.style.left = iL + 'px'
                  substation.style.top = iT + 'px'
                }
                if (iT >= height) {
                  substation.style.left = iL + 'px'
                  substation.style.top = height + 'px'
                }
              }
              if (iL >= width) {
                if (iT < 0) {
                  substation.style.left = width + 'px'
                  substation.style.top = 0 + 'px'
                }
                if (iT > 0 && iT < height) {
                  substation.style.left = width + 'px'
                  substation.style.top = iT + 'px'
                }
                if (iT >= height) {
                  substation.style.left = width + 'px'
                  substation.style.top = height + 'px'
                }
              }
              const subNameType = cloneTemp
                .getAttribute('src')
                .split('.')[0]
                .split('/')[2]
                .split('_')

              const subNameType1 = cloneTemp
                .getAttribute('src')
                .split('.')[0]
                .split('/')[2]
                .indexOf('line')
              if (subNameType1 == -1) {
                that.searchSubstion('plant', subNameType[0])
              } else {
                that.searchSubstion('line', subNameType[0])
              }
            }
          }
          return false
        }
      }
    },
    //获取陪停设备
    getPtData() {
      var _objId = ''
      // debugger
      this.selectedSubArr.forEach((item, index) => {
        if (this.selectedSubArr.length - 1 > index) {
          _objId = _objId + item.OBJID + ','
        } else {
          _objId = _objId + item.OBJID
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#select_subtion {
  position: absolute;
  display: none;
}

#toolTip {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  background: rgba(5, 30, 46, 0.8);
  -webkit-box-shadow: inset 0 1px 40px 0 rgba(92, 188, 255, 17%);
  box-shadow: inset 0 1px 40px 0 rgba(92, 188, 255, 17%);
  z-index: 4;
  padding: 10px;
  text-align: center;
  width: 300px;
  height: 350px;
}

// 图例
#legend {
  color: #d28825;
  position: absolute;
  right: 0;
  bottom: 0;
  border: 1px solid #0c4a6b;
  padding: 10px;
  z-index: 3;
  background: #13192b;

  p {
    text-align: center;
    margin-bottom: 10px;

    span {
      display: inline-block;
      width: 70px;
      vertical-align: middle;

      &:nth-child(1) {
        margin-right: 10px;
        width: 30%;
      }

      &:nth-child(2) {
        height: 2px;
      }
    }

    &:first-child {
      text-align: left;
      // span {
      //   color: #f5ff61;
      // }
    }
  }
}

#right-wrap.fullscreen {
  display: none;
}

// 陪停设备
#pt {
  color: #d28825;
  position: absolute;
  right: 0;
  bottom: 0;
  border: 1px solid #0c4a6b;
  padding: 10px;
  z-index: 3;
  background: #13192b;
}

.closeFloat {
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}

.gridsand {
  height: 100%;
  height: 100%;
  display: flex;
  color: #fff;
  background-size: 100% 100%;

  // 标题样式
  .filter-wrap {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;

    .title {
      height: 40px;
      font-size: 18px;
      border-left: 5px solid #c4fafc;
      padding-left: 5px;
      display: inline-block;

      span {
        display: block;
        height: 100%;
        width: 100%;
        line-height: 40px;
        // background: linear-gradient(to right, #1f7fb8, #021124);
        background: linear-gradient(
          221deg,
          rgba(16, 27, 68, 0) 0%,
          #207fb8 100%
        );
        padding-left: 10px;
      }
    }
  }

  .content {
    width: 100%;
    height: calc(100% - 50px);
  }

  .filter-box,
  .fuzzy-content {
    .filter-item,
    .fuzzy-item {
      display: inline-block;
      margin-right: 5px;

      .filter-item-label,
      .fuzzy-item-label {
        font-size: 16px;
        color: #5cecff;
      }
    }

    .btn-box {
      // float: right;
      span {
        width: 25px;
        height: 30px;
        border-radius: 4px;
        opacity: 0.62;
        background: #0b2a3c;
        display: inline-block;
        line-height: 30px;
        color: #fff;
        text-align: center;
        cursor: pointer;

        &.active {
          background: #144561;
        }

        &:last-child {
          margin-left: 5px;
        }
      }
    }
  }

  .filter-pop {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    // border: 1px solid #3284b6;
    padding: 10px;
    opacity: 1;
    height: 50%;
    transition: all 0.3s ease-in-out;
    background-size: 100% 100%;
    z-index: 6;

    &.active {
      right: -100%;
      opacity: 0;
      transition: all 0.3s ease-in-out;
    }
  }

  // 左侧样式
  .left {
    width: 147px;

    .title {
      width: 100%;
    }

    .content {
      background: #051e2e;
      border: 1px solid #42a7e5;
      box-shadow: inset 0 1px 40px 0 rgba(92, 188, 255, 0.17);
      border-radius: 4px;
      overflow-x: hidden;
      overflow-y: auto;

      .substaion {
        text-align: center;
        padding: 5px 0;
        position: relative;
        cursor: move;

        &.active {
          background-size: 100% 100%;

          &::after {
            display: block;
            position: absolute;
            content: '';
            width: 48px;
            height: 38px;
            top: -21px;
            right: -28px;
            background-size: 100% 100%;
          }
        }
      }
    }
  }

  // 右侧样式
  #right-wrap {
    width: 507px;

    .title {
      width: 190px;
    }

    .right-box {
      height: calc(50% - 5px);

      &:first-child {
        margin-bottom: 10px;
      }

      &.relate-power {
        .content {
          .filter-content {
            height: 100%;
          }
        }
      }

      .content {
        background-size: 100% 100%;
        padding: 10px;

        .filter-content {
          height: calc(100% - 32px);
          overflow: auto;
          padding-right: 5px;

          .filter-content-item {
            cursor: pointer;
            min-height: 150px;
            width: 100%;
            color: #fff;
            padding: 30px 10px 10px 20px;
            margin-bottom: 10px;
            position: relative;

            &:first-child {
              margin-top: 10px;
            }

            &::before,
            &::after {
              display: block;
              content: '';
              position: absolute;
              width: 478px;
              left: 0;
            }

            &::before {
              top: 0;
              height: 59px;
              background-size: 100% 100%;
            }

            &::after {
              bottom: 0;
              height: 54px;
              background-size: 100% 100%;
            }

            .filter-content-item-bg-arrow {
              position: absolute;
              top: 14px;
              left: 0;
              width: 38px;
              height: 33px;
              background-size: 100% 100%;
              opacity: 0.5;
            }

            .filter-content-item-bg {
              position: absolute;
              top: 59px;
              left: 0;
              height: calc(100% - 113px);
              width: 477px;
              background-size: auto;
            }

            .filter-content-item-title {
              font-weight: bold;
              font-size: 16px;
              opacity: 0.5;
              padding: 0 30px;
              display: flex;
              justify-content: space-between;
              position: relative;
              z-index: 5;
              // flex-wrap: wrap;
              color: #5bd8a6;

              span {
                text-align: center;
              }
            }

            .filter-content-item-time {
              position: relative;
              opacity: 0.5;
              font-size: 16px;
              display: block;
              text-align: center;
              color: #fff;
              display: flex;
              justify-content: space-between;
              margin: 3px 0;

              span {
                em {
                  font-size: 12px;
                  font-style: normal;
                  padding: 3px;
                  // border: 1px solid #36ecff;
                  border-radius: 3px;
                  margin: 2px;
                  cursor: pointer;
                  display: inline-block;
                  margin: 0 2px;
                  border: 1px solid #ff8561;
                  color: #ff8561;

                  &.success {
                    border: 1px solid #36ecff;
                    color: #36ecff;
                  }

                  &.warn {
                    border: 1px solid #ffff00;
                    color: #ffff00;
                  }
                }
              }
            }

            .filter-content-item-info {
              color: #5cbcff;
              opacity: 0.5;
              font-size: 14px;
              white-space: pre-line;
              position: relative;
              z-index: 5;
              min-height: 70px;
            }

            .filter-content-item-footer {
              color: #fff;
              opacity: 0.5;
              font-size: 12px;
              display: flex;
              justify-content: space-between;
              padding-right: 20px;
              position: relative;
              z-index: 5;
            }

            &.active-arrow,
            &.active-click {
              min-height: 165px;
              margin-bottom: 0px;
              padding: 32px 10px 20px 20px;

              &::before,
              &::after {
                display: block;
                content: '';
                position: absolute;
                width: 478px;
                left: 0;
              }

              &::before {
                top: 0;
                height: 59px;
                background-size: 103% 100%;
              }

              &::after {
                bottom: 0;
                height: 54px;
                background-size: 103% 100%;
              }

              .filter-content-item-bg-arrow {
                top: 16px;
                width: 39px;
                left: 3px;
                transform: rotateZ(2deg);
              }

              .filter-content-item-bg {
                position: absolute;
                top: 59px;
                left: 0;
                height: calc(100% - 113px);
                width: 478px;
                background-size: 103%;
              }

              .filter-content-item-title,
              .filter-content-item-time,
              .filter-content-item-info,
              .filter-content-item-footer {
                opacity: 1;
              }
            }

            &.active-arrow {
              .filter-content-item-bg-arrow {
                top: 15px;
                left: 0;
                width: 47px;
                height: 38px;
                background-size: 100% 100%;
                transform: rotateZ(2deg);
                opacity: 1;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  // 中间样式
  #middle-wrap {
    width: calc(100% - 654px);
    margin: 0 10px;

    .overFormListSelect {
      position: absolute;
      right: 0;
      bottom: 10px;
      height: 40%;
      color: #5bd8a6;
      font-size: 14px;
      background-color: #082335;
      padding: 10px;
      z-index: 4;

      p {
        font-weight: bold;
        color: #ffcd00;
        font-size: 16px;
      }
    }

    .title {
      width: 190px;
    }

    .btn-box {
      display: inline-block;

      p {
        display: inline-block;
        width: 70px;
        height: 30px;
        color: #7acaff;
        text-align: center;
        background: #0095ff;
        border: 1px solid #0095ff;
        margin: 0 5px;
        clip-path: polygon(
          0 0,
          calc(100% - 10px) 0,
          100% 10px,
          100% 100%,
          10px 100%,
          0 calc(100% - 10px)
        );
        cursor: pointer;

        span {
          display: inline-block;
          width: 68px;
          height: 28px;
          line-height: 28px;
          background: #024d88;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }

        &.active {
          color: #5cecff;
          background: #5cecff;
          border: 1px solid #5cecff;

          span {
            background: #03616e;
          }
        }
      }
    }

    .risk-box {
      display: inline-block;
      width: 212px;
      height: 40px;
      background: #0b364e;
      border: 1px solid #42a7e5;
      box-shadow: inset 0 1px 40px 0 rgba(92, 188, 255, 0.17);
      padding: 0 10px;
      font-size: 16px;
      line-height: 40px;
      vertical-align: top;

      span {
        margin: 0 5px;
        font-size: 12px;
        cursor: pointer;

        em {
          font-size: 18px;
          font-style: normal;
        }
      }
    }

    .risk-level {
      display: inline-block;
      max-width: 400px;
      min-width: 300px;
      height: 45px;
      background: rgba(5, 30, 46, 0.8);
      padding: 0 10px;
      font-size: 14px;
      vertical-align: top;
      overflow: auto;

      p {
        display: flex;
        justify-content: space-between;

        span {
          font-size: 20px;
          cursor: pointer;
          line-height: 1.2;

          &:first-child {
            color: #f7e400;
          }
        }
      }
    }

    .middle-box {
      height: 30%;
      overflow: hidden;

      // transition: height 3s ease-in-out;
      // &.fullscreen {
      //   height: 0%;
      //    &.echart-render-box{
      //      height:100%
      //    }
      //   transition: height 3s ease-in-out;
      // }
      &.echart-render-box {
        //height: 70%;
        height: calc(100% - 25px);
        transition: height 0.5s;

        .echart-content,
        .echart-content-graph {
          position: relative;
          // height: calc(100% - 130px);
          height: calc(100% - 65px);
          margin-top: 10px;
          background: rgba(5, 30, 46, 0.5);
          -webkit-box-shadow: inset 0 1px 40px 0 rgb(92 188 255 / 17%);
          box-shadow: inset 0 1px 40px 0 rgb(92 188 255 / 17%);

          .echart-content-float {
            position: absolute;
            top: 0;
            left: 0;
            background: #61686d94;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 5;
          }
        }
      }

      .content {
        background: #051e2e;
        box-shadow: inset 0 1px 40px 0 rgba(92, 188, 255, 0.17);
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-image: -webkit-linear-gradient(
            rgba(160, 195, 215, 1),
            rgba(160, 196, 216, 0),
            rgba(160, 195, 215, 1)
          )
          30 30;
        border-image: -moz-linear-gradient(
            rgba(160, 195, 215, 1),
            rgba(160, 196, 216, 0),
            rgba(160, 195, 215, 1)
          )
          30 30;
        border-image: linear-gradient(
            rgba(160, 195, 215, 1),
            rgba(160, 196, 216, 0),
            rgba(160, 195, 215, 1)
          )
          30 30;
        display: flex;

        .info-wrap,
        .echarts-wrap {
          width: 50%;
        }

        .echarts-wrap.isHideEchartLine {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.ant-descriptions {
  height: 100%;
  font-size: 18px;
  overflow: auto;
}

.ant-descriptions-item-label {
  color: #5cbcff;
}

.ant-descriptions-item-content {
  color: #fff;
}

.ant-descriptions-row > th,
.ant-descriptions-row > td {
  padding-bottom: 0;
  vertical-align: top;
}

.ant-radio-group {
  margin-top: 5px;
}

.ant-radio-button-wrapper {
  background-size: 100% 100%;
  border: none;
  color: #fff;

  &:hover {
    color: #f7e400;
  }

  &:first-child {
    border-left: none;
  }
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  background-size: 100% 100%;
  color: #f7e400;
  box-shadow: none;

  &:hover {
    color: #f7e400;
  }
}

.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 3px;
}
.ant-table-placeholder {
  background: #fff0;
}
.ant-empty-description {
  color: #fff;
}
#showView {
  width: 98vw;
  height: 98vh;
  margin-top: -65px;
  padding-top: 30px;
  // overflow: hidden;
  overflow-x: scroll;
  overflow-y: scroll;
}
#graph {
  width: 100%;
  height: 100%;
}
</style>
