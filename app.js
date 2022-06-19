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



const queryDateRange = () => {
  
  let [startDate, endDate] = dateRangeFlatPicker.selectedDates.map(d => d.toISOString().split('T')[0].split('-').join(''))
  console.log(startDate, endDate)

  db.allDocs({startkey: 'data_sens001_'+startDate, include_docs: true}).then(data => {

    CHARTS.forEach(item => {
      item.chart.destroy()
    })

    let dataMap = data
    .rows
    .map(row => row.doc)
    .filter(doc => doc._id[0] !== '_')
    
    let matrixReducer = (a, c) => {
      let t0 = idDateToTimestamp(c._id)
      Object.keys(a).forEach(k => a[k].push(c[k]))
      return a
    }

    ////////////////////////////////////////////
    // time
    let timeMatrix = dataMap.map(doc => {
      // sum delta nanoseconds to base date
      let t0 = idDateToTimestamp(doc._id)
      return doc.t.map(t => sumNanosecToBaseDate(t, t0))
    })

    ////////////////////////////////////////////
    // temp
    let tempHumData = dataMap
    .reduce(matrixReducer, {'temp': [], 'hum': []})
    
    CHARTS.push({id: 'tempHum', keys: ['temp', 'hum'], chart: new uPlot(tempHumOpts, [
      timeMatrix.map(tArr => tArr[0]),
      tempHumData.temp.flat(),
      tempHumData.hum.flat(),
    ], document.getElementById('temp'))})
    
    ////////////////////////////////////////////
    // Gy
    let gyData = dataMap
    .reduce(matrixReducer, {'GyX': [], 'GyY': [], 'GyZ': []})
    
    CHARTS.push({id: 'Gy', keys: ['GyX', 'GyY', 'GyZ'], chart: new uPlot(optsGy, [
      timeMatrix.flat(),
      gyData.GyX.flat(),
      gyData.GyY.flat(),
      gyData.GyZ.flat(),
    ], document.getElementById('Gy'))})

    
    ////////////////////////////////////////////
    // Ac
    let acData = dataMap
    .reduce(matrixReducer, {'AcX': [], 'AcY': [], 'AcZ': []})
    
    CHARTS.push({id: 'Ac', keys: ['AcX', 'AcY', 'AcZ'], chart: new uPlot(optsAc, [
      timeMatrix.flat(),
      acData.AcX.flat(),
      acData.AcY.flat(),
      acData.AcZ.flat(),
    ], document.getElementById('Ac'))})


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
