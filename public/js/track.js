let demo = document.getElementById("demo");

let x = {hello: 1, hi: 2};
console.log(Object.keys(x));
console.log(Object.values(x));
// console.log(tracks);
// console.log(JSON.parse(tracks));
// console.log(JSON.parse(tracks).length);
// for (let track of JSON.parse(tracks)) {
//     x = x + "<h1>" + track+ "</h1>";
// }
// console.log(x);
demo.innerHTML = x;