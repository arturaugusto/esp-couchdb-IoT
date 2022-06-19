////////////////////////////////////////////
// date range picker
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const dateRangeFlatPicker = flatpickr(document.getElementById('dateRange'), {
  mode: "range",
  dateFormat: "Y-m-d",
  defaultDate: [today, tomorrow],
  onChange: (selectedDates, dateStr, instance) => {
    if (selectedDates.length === 2) {
      queryDateRange()
    }
  }
})


const matrixReducer = (a, c) => {
  let t0 = idDateToTimestamp(c._id)
  Object.keys(a).forEach(k => a[k].push(c[k]))
  return a
}


const registerChart = (chartId, keys, timeMatrix, dataMap, uniqSensors) => {
  let reducerAccumulatorObject = keys.reduce((a, c) => (a[c] = [])&&a, {})

  let data = dataMap
  .reduce(matrixReducer, reducerAccumulatorObject)

  let xSize = timeMatrix.flat().length

  let bufferMatrix = new Array(keys.length * uniqSensors.length).fill().map(_ => new Array(xSize).fill(null))
  // ...


  let flatSensorsMatrix = uniqSensors.map(sensor => {
    return keys.map(k => data[k].flat())
  }).flat()

  let chart = new uPlot(CHARTS_OPTS[chartId], [
      // timeMatrix.map(tArr => tArr[0]),
      timeMatrix.map((tArr, i) => tArr.slice(0, data[keys[0]][i].length)).flat(),
    ].concat(flatSensorsMatrix),
    document.getElementById(chartId)
  )

  CHARTS.push({
    id: chartId,
    keys: keys,
    chart: chart
  })
}

const queryDateRange = () => {
  
  let [startDate, endDate] = dateRangeFlatPicker.selectedDates.map(d => d.toISOString().split('T')[0].split('-').join(''))
  console.log(startDate, endDate)

  db.allDocs({startkey: 'data_sens001_'+startDate, include_docs: true}).then(data => {

    CHARTS.forEach(item => {
      item.chart.destroy()
    })

    let dataMap = data.rows.map(row => row.doc)

    let sensorArray = dataMap.map(doc => doc._id.split('_')[1])
    let uniqSensors = Array.from(new Set(sensorArray))
    
    ////////////////////////////////////////////
    // time
    let timeMatrix = dataMap.map(doc => {
      // sum delta nanoseconds to base date
      let t0 = idDateToTimestamp(doc._id)
      return doc.t.map(t => sumNanosecToBaseDate(t, t0))
    })

    ////////////////////////////////////////////
    // temp
    registerChart('tempHum', ['temp', 'hum'], timeMatrix, dataMap, uniqSensors)
    
    ////////////////////////////////////////////
    // Gy
    registerChart('Gy', ['GyX', 'GyY', 'GyZ'], timeMatrix, dataMap, uniqSensors)
    
    ////////////////////////////////////////////
    // Ac
    registerChart('Ac', ['AcX', 'AcY', 'AcZ'], timeMatrix, dataMap, uniqSensors)

  })
}

queryDateRange()


////////////////////////////////////////////
// handle window resize
window.addEventListener("resize", e => {
  CHARTS.forEach(item => {
    item.chart.setSize(getSize());
  })
})
