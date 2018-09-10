const request = require('request-promise-native');
const cheerio = require("cheerio");
const _ = require('lodash');
            
const url = "https://www.naver.com";             
const related_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" //연관검색어를검색하기위한 url

let list=[]; 
const list_arr=[]; //검색어,순위,연관검색어(배열) 이들어갈 배열입니다.
async function getdata() {
    const body = await request(url);
    const $ = cheerio.load(body);
    const posts = $('.ah_item .ah_a .ah_k')
    const posts_rank=$('.ah_item .ah_a .ah_r')
    posts.each((index, item)=>{   //실시간검색어(item)를 순위순서대로 list(임시배열) 에 넣습니다.
        list[index] = {};
        const title = $(item).text()
        list[index].title = title;   
    });
    posts_rank.each((index, item)=>{ //실시간검색어의순위(rank)를  순서대로 list(임시배열) 에 넣습니다.
        const rank = $(item).text()                           
        list[index].rank = rank; 
    });
}
     
async function getResult () {
    await getdata();
    list = _.slice(list, 0, 10);
    return await Promise.all(_.map(list, async (keyword) => {
        const body = await request({
            url: related_url+encodeURI(keyword.title),
            method: 'get',
            headers: {
                'accept': '*/*',
                // 'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }        
        });
        const related_arr=[];
        const $ = cheerio.load(body);

        $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li').each(function() { //연관검색어를 모두 추출하여 related_arr에 넣습니다.
                     related_arr.push($(this).find('a').text());
        });
        keyword.related_arr=related_arr;
        return keyword;
    }))
}

async function main() {
    console.log(await getResult());
}

main();