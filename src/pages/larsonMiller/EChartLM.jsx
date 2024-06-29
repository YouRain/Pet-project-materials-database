import React, { useEffect, useRef, useState } from "react";
import ReactECharts from 'echarts-for-react';
import { forEach } from "mathjs";
// import * as echarts from "echarts";

function EChartLM({ dataPoints, dataLines, regression }) {

    const shortPoints = [];
    const longPoints = [];
    let minX = +regression.minX;
    let maxX = +regression.maxX;
    let minY = +regression.minY;
    let maxY = +regression.maxY;

    dataPoints.forEach((item) => {
        // if (maxX < +item.parametrLM) {
        //     maxX = item.parametrLM
        // }
        // if (maxY < +item.logStrength) {
        //     maxY = item.logStrength
        // }
        if (item.straight) {
            shortPoints.push([item.parametrLM, item.logStrength])
        } else if (item.curve) {
            longPoints.push([item.parametrLM, item.logStrength])
        }
    })

    // console.log(maxY)

    const options = {
        title: {
            text: 'Кривая Ларсона-Миллера',
            top: "15px",
            left: 'center',
            textStyle: {
                color: "black",
                fontSize: "20",
            },
        },
        legend: {
            top: 'bottom',
            data: ['Кратковременная прочность', 'Длительная прочность', 'Средняя', '-2\u03C3', '-3\u03C3'],
            itemGap: 50,
            padding: [0, 0],
            selectorLabel: {
                show: false
            },
            emphasis: {
                selectorLabel: {
                    show: false
                }
            },
        },
        toolbox: {
            itemSize: 20,
            right: "3%",
            bottom: "-5",
            feature: {
                saveAsImage: {
                    show: true,
                    type: "jpg",
                    title: 'Сохранить как рисунок',
                    iconStyle: {
                        // color: "black",
                        borderColor: "#666",
                        borderWidth: 1,
                    }
                }
            }
        },
        xAxis: {
            name: 'Параметр P',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle: {
                color: "black",
                fontWeight: "700",
                fontSize: "14",
            },
            axisLine: {
                lineStyle: {
                    color: "black",
                    fontSize: "14",
                },
            },
            min: Math.floor(minX * 0.95 / 10 ** (Math.floor(minX).toString().length - 2)) * 10 ** (Math.floor(minX).toString().length - 2),
            max: Math.floor(maxX * 1.05 / 10 ** (Math.floor(maxX).toString().length - 2)) * 10 ** (Math.floor(maxX).toString().length - 2),
            minorTick: {
                show: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "silver",
                }
            },
            minorSplitLine: {
                show: true,
                lineStyle: {
                    color: "silver",
                }
            }
        },
        yAxis: {
            name: 'lg\u03C3',
            nameLocation: 'center',
            nameGap: 35,
            nameRotate: 0,
            nameTextStyle: {
                color: "black",
                fontWeight: "700",
                fontSize: "14",
            },
            axisLine: {
                lineStyle: {
                    color: "black",
                    fontSize: "14",
                },
            },
            min: Math.floor(minY * 0.98 * 10) / 10,
            max: Math.floor(maxY * 1.02 * 10) / 10,
            minorTick: {
                show: true
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "silver",
                }
            },
            minorSplitLine: {
                show: true,
                lineStyle: {
                    color: "silver",
                }
            }
        },
        dataZoom: [
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                xAxisIndex: [0],
                startValue: Math.floor(minX * 0.95 / 10 ** (Math.floor(minX).toString().length - 2)) * 10 ** (Math.floor(minX).toString().length - 2),
                endValue: Math.floor(maxX * 1.05 / 10 ** (Math.floor(maxX).toString().length - 2)) * 10 ** (Math.floor(maxX).toString().length - 2),
            },
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                startValue: Math.floor(minY * 0.98 * 10) / 10,
                endValue: Math.floor(maxY * 1.02 * 10) / 10,
            }
        ],
        series: [
            {
                name: 'Кратковременная прочность',
                type: 'scatter',
                symbolSize: 5,
                symbol: 'circle',
                color: "green",
                data: shortPoints,
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series', //self
                    label: {
                        show: true,
                        position: ["-750%", "100"],
                        color: '#000',
                        fontSize: 14,
                        fontWeight: "700",
                        formatter: function (param) {
                            return `${param.data[0]}  ${param.data[1]}`;
                        },
                    }
                },
            },
            {
                name: 'Длительная прочность',
                type: 'scatter',
                symbolSize: 5,
                symbol: 'rect',
                color: "red",
                data: longPoints,
                emphasis: {
                    focus: 'self', //self
                    label: {
                        show: true,
                        position: ["-750%", "100"],
                        color: '#000',
                        fontSize: 14,
                        fontWeight: "700",
                        formatter: function (param) {
                            return `${param.data[0]}  ${param.data[1]}`;
                        },
                    }
                },
            },
            {
                name: 'Средняя',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "black",
                data: dataLines.arrCoordStraightLine,
                emphasis: {
                    focus: 'self',
                }
            },
            {
                name: 'Средняя',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "black",
                data: dataLines.arrCoordCurveLine,
                emphasis: {
                    focus: 'self',
                }
            },
            {
                name: '-2\u03C3',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "blue",
                data: dataLines.arrCoordStraightLine2S,
                emphasis: {
                    focus: 'self',
                }
            },
            {
                name: '-2\u03C3',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "blue",
                data: dataLines.arrCoordCurveLine2S,
                emphasis: {
                    focus: 'self',
                }
            },
            {
                name: '-3\u03C3',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "orange",
                data: dataLines.arrCoordStraightLine3S,
                emphasis: {
                    focus: 'self',
                }
            },
            {
                name: '-3\u03C3',
                type: 'line',
                lineStyle: {
                    width: 1,
                },
                showSymbol: false,
                color: "orange",
                data: dataLines.arrCoordCurveLine3S,
                emphasis: {
                    focus: 'self',
                }
            },
        ],
    }

    return (
        <ReactECharts option={options} style={{
            width: "100%", height: "100%", padding: "0", margin: "0", background: "#efeeee", paddingBottom: "10px"
            // border: "1px solid red"
        }} />
    )
}

export default EChartLM;