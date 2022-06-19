let CHARTS = []

const idDateToTimestamp = (idStr) => {
  // idStr = 'data_sens001_20220617212553'
  let dateStr = idStr.split('_')[2]
  // dateStr = '20220617212553'
  let [y, M, d, h, m, s] = [dateStr.slice(0,4), dateStr.slice(4,6), dateStr.slice(6,8), dateStr.slice(8,10), dateStr.slice(10,12), dateStr.slice(12,14)]

  return new Date(...[y, M-1, d, h, m, s]).getTime()/1000
}

function getSize() {
  return {
    width: window.innerWidth - 100,
    height: window.innerHeight - 200,
  }
}

function sumNanosecToBaseDate(nsDt, t0) {
  return (nsDt/1e15)+t0
}