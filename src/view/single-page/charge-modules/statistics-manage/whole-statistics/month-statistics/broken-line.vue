<template>
  <div ref="dom" style="width:100%;height: 350px;"></div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "serviceRequests",
  data() {
    return {
      checkVal: [1, 2, 3, 4, 5],
      dom: null
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    }
  },
  mounted() {
    const option = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: [
          "充电电量(度)",
          "充电收入(元)",
          "支付宝支付(元)",
          "账户余额支付(元)",
          "微信支付(元)"
        ]
      },
      grid: {
        left: "1%",
        right: "3%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["01", "02", "03", "04", "05", "06", "07"]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "充电电量(度)",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "充电收入(元)",
          type: "line",
          stack: "总量",
          data: [257, 358, 278, 234, 290, 330, 310]
        },
        {
          name: "支付宝支付(元)",
          type: "line",
          stack: "总量",
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: "账户余额支付(元)",
          type: "line",
          stack: "总量",
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "微信支付(元)",
          type: "line",
          stack: "总量",
          data: [820, 645, 546, 745, 872, 624, 258]
        }
      ]
    };
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom);
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
