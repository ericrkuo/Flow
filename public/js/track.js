let demo = document.getElementById("demo");

let x = "";
console.log(tracks);
console.log(JSON.parse(tracks));
console.log(JSON.parse(tracks).length);
for (let track of JSON.parse(tracks)) {
    x = x + "<h1>" + track+ "</h1>";
}
console.log(x);
demo.innerHTML = x;