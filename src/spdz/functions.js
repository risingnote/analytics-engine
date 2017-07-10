module.exports = {
  avg: {
    name: 'Average',
    description: 'Calculate avg as \u03A3 (value) / number of values.',
    example: 'select sum(col_1), count(col_1) from table_name where col2 > 1000',
    inputs: [
      { name: 'valueSum', type: 'int', byteSize: 4 },
      { name: 'valueCount', type: 'int', byteSize: 4 }
    ],
    inputRowCount: 1,
    outputs: [
      {
        name: 'result',
        type: 'float'
      }
    ],
    outputRowCount: 1
  },
  hist_percent: {
    name: 'Percentage Histogram',
    description: 'Aggregate histogram of index, count and convert count to percentage.',
    inputs: [
      { name: 'xIndex', type: 'int', byteSize: 4 },
      { name: 'yCount', type: 'int', byteSize: 4 }
    ],
    inputRowCount: 24,
    outputs: [
      { name: 'xIndex', type: 'float', byteSize: 4 },
      {
        name: 'yPercent',
        type: 'float'
      }
    ],
    outputRowCount: 24
  }
}
