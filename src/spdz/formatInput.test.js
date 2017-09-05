const spdz = require('.')

const chkResult = (result, expected) =>
  result.map((resultBatch, index) =>
    expect(resultBatch).toEqual(expected[index])
  )

describe('Format database values into batches suitable for SPDZ input', () => {
  it('Manages empty input', () => {
    const dbValues = []
    const result = spdz.formatInput(dbValues, 2, 1)
    const expected = [[0, 0, 0, 1]]

    expect(result.length).toEqual(1)
    chkResult(result, expected)
  })

  it('Manages input less than batch size', () => {
    const dbValues = [1, 2, 3, 4, 5]
    const result = spdz.formatInput(dbValues, 4, 2)
    const expected = [[5, 1, 2, 3, 4, 5, 0, 0, 0, 1]]

    expect(result.length).toEqual(1)
    chkResult(result, expected)
  })

  it('Manages input of exactly one batch', () => {
    const dbValues = [1, 2, 3, 4]
    const result = spdz.formatInput(dbValues, 2, 2)
    const expected = [[4, 1, 2, 3, 4, 1]]

    expect(result.length).toEqual(1)
    chkResult(result, expected)
  })

  it('Manages input greater than one batch', () => {
    const dbValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = spdz.formatInput(dbValues, 3, 2)
    const expected = [[6, 1, 2, 3, 4, 5, 6, 0], [3, 7, 8, 9, 0, 0, 0, 1]]

    expect(result.length).toEqual(2)
    chkResult(result, expected)
  })

  it('Manages input of exactly two batches', () => {
    const dbValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const result = spdz.formatInput(dbValues, 2, 3)
    const expected = [[6, 1, 2, 3, 4, 5, 6, 0], [6, 7, 8, 9, 10, 11, 12, 1]]

    expect(result.length).toEqual(2)
    chkResult(result, expected)
  })
})
