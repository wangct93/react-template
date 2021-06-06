
let time = +new Date();
start().then((data) => {
  console.log(222222222,+new Date() - time);
});



async function start() {
  await new Promise((cb) => {
    setTimeout(() => {
      cb();
    },10000);
  });
}
