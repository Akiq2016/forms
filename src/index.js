import R from 'ramda';

export default function () {
  var double = x => x * 2
  console.log('test ', R.map(double, [1,2,3]))
}