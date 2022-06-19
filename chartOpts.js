// const labelFormarter = (u, v) => new Date(v*1000).toGMTString().split(' ').slice(1,5).join(' ')
const labelFormarter = (u, v) => new Date(v*1000).toString().split(' ').slice(1,5).join(' ')
const xAxesFormarter = (u, vals) => vals.map(v => labelFormarter(undefined, v))

const tempHumOpts = {
  width: 920,
  height: 400,
  // cursor: cursorOpts,
  scales: {
    x: {
      time: true,
    },
  },
  series: [
    {
      value: labelFormarter,
    },
    {
      scale: "°C",
      label: "Temperatura",
      stroke: "red",
      value: (u, v, space) => v.toFixed(1) + " °C",
      // fill: "rgba(255,0,0,0.1)",
    },
    {
      scale: "%",
      label: "Umidade",
      stroke: "green",
      value: (u, v, space) => v.toFixed(1) + " %",
      // fill: "rgba(0,255,0,0.1)",
    },
  ],
  axes: [
    {},
    {
      scale: "°C",
      label: "Temperatura",
      size: 60,
      values: (u, vals, space) => vals.map(v => +v.toFixed(1) + "°C"),
    },
    {
      side: 1,
      scale: "%",
      label: "Umidade",
      values: (u, vals, space) => vals.map(v => +v.toFixed(2) + " %"),
      grid: {show: false},
    },
  ],
};

const optsGy = {
  width: 920,
  height: 400,
  // cursor: cursorOpts,
  scales: {
    x: {
      time: true,
    },
  },
  series: [
    {
      value: labelFormarter,
    },
    {
      stroke: "red",
      label: "GyX",
      // fill: "rgba(255,0,0,0.1)",
    },
    {
      stroke: "green",
      label: "GyY",
      // fill: "rgba(0,255,0,0.1)",
    },
    {
      stroke: "blue",
      label: "GyZ",
      // fill: "rgba(0,0,255,0.1)",
    },
  ],
  axes: [
    {},
    {
      label: "MPU read",
      size: 60
    },
  ]
};

const optsAc = {
  width: 920,
  height: 400,
  // cursor: cursorOpts,
  scales: {
    x: {
      time: true,
    },
  },
  series: [
    {
      value: labelFormarter,
    },
    {
      stroke: "red",
      label: "AcX",
      // fill: "rgba(255,0,0,0.1)",
    },
    {
      stroke: "green",
      label: "AcY",
      // fill: "rgba(0,255,0,0.1)",
    },
    {
      stroke: "blue",
      label: "AcZ",
      // fill: "rgba(0,0,255,0.1)",
    },
  ],
  axes: [
    {},
    {
      label: "MPU read",
      size: 60
    },
  ]
};
