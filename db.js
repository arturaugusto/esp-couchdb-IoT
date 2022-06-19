const db = new PouchDB(GUEST_DB, {
  // skip_setup: false,
  // To use JWT, this header must be added.
  //Note the you shoud NOT hard code the JWT string
  headers: {
    'Authorization': 'Bearer ' + GUEST_TOKEN
  }
  
});

// console.log(db);

db.changes({
  'live': true,
  'attachments': true,
  'binary': true,
  'since': 'now',
  'include_docs': true,
}).on('change', function(change) {
  console.log(change)
  let t0 = idDateToTimestamp(change.doc._id)

  CHARTS.forEach(item => {
    // fill with new data
    item.keys.forEach((k, i) => {
      change.doc[k].forEach(val => {
        item.chart._data[i+1].push(val)
      })      
    })
    // fill time scale
    for (let i = 0; i < change.doc[item.keys[0]].length; i++) {
      item.chart._data[0].push(sumNanosecToBaseDate(change.doc['t'][i], t0))
    }
    // update
    item.chart.setData(item.chart._data)
  })

}).on('complete', function(info) {
  // changes() was canceled
}).on('error', function (err) {
  console.log(err)
})