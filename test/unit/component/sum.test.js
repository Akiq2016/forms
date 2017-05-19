import {sum} from "./../../../src/components/sum.js"

test('takes a list of numbers and returns their sum', () => {
  expect(sum(1,2,3,4,5)).toBe(15)
})