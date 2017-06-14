module.exports = {
  avg: {
    name: 'avg',
    description: 'Calculate avg as \u03A3 (value) / number of values.',
    inputs: [
      { name: 'valueSum', type: 'integer', byteSize: 4 },
      { name: 'valueCount', type: 'integer', byteSize: 4 }
    ],
    outputs: [
      {
        name: 'result',
        type: 'float',
        significandBitSize: 24,
        exponentBitSize: 8
      }
    ]
  }
}
