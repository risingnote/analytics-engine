
const functions = [
  {
    id: 'avg',
    name: 'Average',
    description: 'Calculate avg as \u03A3 localSum / \u03A3 localCount.',
    example: 'select sum(col_1), count(col_1) \n  from table_name \n where col2 > 1000',
    inputs: [
      { name: 'localSum', type: 'int', byteSize: 4 },
      { name: 'localCount', type: 'int', byteSize: 4 }
    ],
    inputRowCount: 1,
    outputs: [
      { name: 'result', type: 'float', byteSize: 16 }
    ],
    outputRowCount: 1
  },
  {
    id: 'phist',
    name: 'Percentage Histogram',
    description: 'Aggregate histogram of index, count and convert count to percentage.',
    example: 'select hour(incidentDate), count(*) \n  from table_name \n group by hour(incidentDate)',
    inputs: [
      { name: 'xIndex', type: 'int', byteSize: 4 },
      { name: 'yCount', type: 'int', byteSize: 4 }
    ],
    inputRowCount: 24,
    outputs: [
      { name: 'xIndex', type: 'float', byteSize: 16 },
      { name: 'yPercent', type: 'float', byteSize: 16 }
    ],
    outputRowCount: 24
  }
]

const getFunction = funcId => {
  return functions.find(func => func.id === funcId)
}

module.exports = {
  functionList: functions,
  getFunction: getFunction
}
