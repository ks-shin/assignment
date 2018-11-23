var request = require('request');
var cheerio = require("cheerio");

var url = "https://www.naver.com";
var related_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" //연관검색어를검색하기위한 url

var list = [];
var list_arr = []; //검색어,순위,연관검색어(배열) 이들어갈 배열입니다.
var My_Promise = []; //연관검색어의 각각의 Promise 들이 들어갈 배열입니다.
function getdata() {
    return new Promise((resolve, reject) => {                //실시간검색어 순위를 받아올 Promise 입니다.
        request(url, (err, res, body) => {
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


            resolve(list);
        })
    });
}



getdata().then(function (list) {
    console.log(list)
    list_arr = list;                     //받아온 list(임시배열)을 list_arr(검색어,순위,연관검색어 배열)안에 넣습니다.
    for (var i = 0; i < 10; i++) {       //총 10번의 request 를 보냅니다. 각각의 request는 My_Promise 안에 들어갑니다.              
        My_Promise.push(new Promise((resolve, reject) => {
            request({
                url: related_url + encodeURI(list_arr[i].title),
                method: 'get',
                headers: {
                    'accept': '*/*',
                    // 'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
                }

            }, (err, res, body) => {        //request 의 콜백함수이며 연관검색어 를 relates_arr에 담은후 list_arr에 해당하는 위치를 찾아넣습니다.

                var related_arr = [];
                var $ = cheerio.load(body);
                var related_item;
                var related_item_rank;
                related_item = $('#nx_query')[0].attribs.value  //연관검색어의 페이지에서 검색어를 추출합니다.


                list_arr.forEach(function (item) { //연관검색어의페이지에서 추출한 검색어의 순위를 list_arr와 비교하여 추출하여 realted_item_rank 에 저장합니다.

                    if (item.title == related_item)
                        related_item_rank = item.rank;
                })


                $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li').each(function () { //연관검색어를 모두 추출하여 related_arr에 넣습니다.
                    related_arr.push($(this).find('a').text());
                });
                list_arr[related_item_rank - 1].related_arr = related_arr //realted_item_rank 를이용해 list_arr 안에 related_arr 를 넣습니다.

                resolve();
            }) //End.. request
        }) //End.. new Promise

        )//End.. My_Promise.push







    }


    Promise.all(My_Promise).then(function () {     //My_Promse 의 모든 Promise 들이 resolve()후 fulfilled(이행)상태가 된다면 Promise.all을통하여 콜백함수 를호출합니다.
        for (var i = 0; i < 10; i++)
            console.log(list_arr[i]);
    })



});


