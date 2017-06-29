module.exports = {
  avg: {
    name: 'avg',
    description: 'Calculate avg as \u03A3 (value) / number of values.',
    inputs: [
      { name: 'valueSum', type: 'integer', byteSize: 4 },
      { name: 'valueCount', type: 'integer', byteSize: 4 }
    ],
    inputRowCount: 1,
    outputs: [
      {
        name: 'result',
        type: 'float',
        significandBitSize: 24,
        exponentBitSize: 8
      }
    ],
    outputRowCount: 1
  },
  hist_percent: {
    name: 'hist_percent',
    description: 'Aggregate histogram of index, count and convert count to percentage.',
    inputs: [
      { name: 'xIndex', type: 'integer', byteSize: 4 },
      { name: 'yCount', type: 'integer', byteSize: 4 }
    ],
    inputRowCount: 24,
    outputs: [
      {
        name: 'result',
        type: 'float',
        significandBitSize: 24,
        exponentBitSize: 8
      }
    ],
    outputRowCount: 24
  }
}
