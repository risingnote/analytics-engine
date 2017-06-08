module.exports = {
  1: {
    name: 'avg',
    description: 'Calculate avg as \u03A3 (value) / number of values.',
    inputs: [{ name: 'value', type: 'integer', bitSize: 32 }],
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
