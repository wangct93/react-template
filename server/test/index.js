/**
 * Created by wangct on 2019/3/4.
 */

const pack = require('./pack');

pack.parse('server/test/temp.txt','cc',() => {
  console.log(23);
})
