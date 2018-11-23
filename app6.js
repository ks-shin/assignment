var request = require('request');
var cheerio = require("cheerio");


var list = [];
var url = "https://www.naver.com";
console.log("start------------------------------------------------------------------------------------------------------")
const res = request(url, (err, res, body) => {
    var $ = cheerio.load(body);
    var posts = $('.ah_item .ah_a .ah_k')
    var posts_rank = $('.ah_item .ah_a .ah_r')
    var i = 0;
    var j = 0;
    posts.each((index, item) => {   //실시간검색어(item)를 순위순서대로 list(임시배열) 에 넣습니다.
        list[index] = {};
        let title = $(item).text()
        list[index].title = title;
    });
    posts_rank.each((index, item) => { //실시간검색어의순위(rank)를  순서대로 list(임시배열) 에 넣습니다.
        let rank = $(item).text()
        list[index].rank = rank;
     
    });
  console.log("request의 끝")

})

console.log(list)
// setTimeout(function () { 
//     console.log("1초뒤에시작")
//     console.log(list) }, 1000)

console.log("end------------------------------------------------------------------------------------------------------")