<template>
  <div ref="timeBar" style="width:100%;height: 430px;"></div>
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
      color: ["#3398DB"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line"
        }
      },
      grid: {
        left: "1%",
        right: "3%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: [
            "00:00-02:00",
            "02:00-04:00",
            "04:00-06:00",
            "06:00-08:00",
            "08:00-10:00",
            "10:00-12:00",
            "12:00-14:00",
            "14:00-16:00",
            "16:00-18:00",
            "18:00-20:00",
            "20:00-22:00",
            "22:00-24:00"
          ],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "电量/度",
          type: "bar",
          barWidth: "40%",
          data: [120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
        }
      ]
    };
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.timeBar);
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
