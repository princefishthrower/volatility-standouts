

var sMainText = "";

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function chapter1() {
  console.log('in chapter1');
  var result = await resolveAfter2Seconds();
  sChapter1String = " chapter 1 string ";
  return sChapter1String;
}

async function chapter2() {
  console.log('in chapter2');
  var result = await resolveAfter2Seconds();
  sChapter2String = " chapter 2 string ";
  return sChapter2String;
}

async function chapter3() {
  console.log('in chapter3');
  var result = await resolveAfter2Seconds();
  sChapter3String = " chapter 3 string ";
  return sChapter3String;
}

async function run() {
  var sChapter1String = await chapter1();
  var sChapter2String = await chapter2();
  var sChapter3String = await chapter3();
  sMainText = sChapter1String + sChapter2String + sChapter3String;
  console.log(sMainText);
}


run()
// chapter1((sChapter1String) => {
//   sMainText += sChapter1String;
// }).then(function() {
//   chapter2(sChapter2String) => {
//     sMainText += sChapter2String;
//   }
// }).then(function() {
//   chapter3(sChapter3String) => {
//     sMainText += sChapter3String;
//   }
// }).then(function() => {
//   console.log(sMainText);
// });