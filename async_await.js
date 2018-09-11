const request = require('request-promise-native');
const cheerio = require("cheerio");
const _ = require('lodash');
     

//------------------------전역변수--------------------------//

const url = "https://www.naver.com";             
const related_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=" //연관검색어를검색하기위한 url
let list=[]; 
const list_arr=[]; //검색어,순위,연관검색어(배열) 이들어갈 배열입니다.

//------------------------전역변수--------------------------//



async function getdata() {             //3.getdata()의실행 
    const body = await request(url);   //4.request()의실행 async/await 를 활용하여 콜백함수 를 넣을필요없다  
    const $ = cheerio.load(body);      //cheerio 모듈의 load 함수의 인자에 body 를 넣는다.
    const posts = $('.ah_item .ah_a .ah_k')
    const posts_rank=$('.ah_item .ah_a .ah_r')
    posts.each((index, item)=>{   //실시간검색어(item)를 순위순서대로 list(임시배열) 에 넣습니다.
        list[index] = {};
        const title = $(item).text();
        list[index].title = title;   
    });
    posts_rank.each((index, item)=>{ //실시간검색어의순위(rank)를  순서대로 list(임시배열) 에 넣습니다.
        const rank = $(item).text();                         
        list[index].rank = rank; 
    });
}
     
async function getResult() {             //2.getResult() 함수의 실행 
    await getdata();                     //async 함수 getdata()가 호출된후 모두 실행할때까지 기다린다.  
    list = _.slice(list, 0, 10);         //_.slice 를통해 list 배열을 index가 0부터 10개를 잘라서 list에 다시넣는다. 
    return await Promise.all(_.map(list, async (keyword) => { //list 배열안의 있는 객체 하나를 keyword 변수에 넣어서 keyword 변수를 가지고 해당된 arrow 함수를 실행한다.
        const body = await request({   //keyword.title 을 가지고 요청을받아내 body를 뽑아낸다. request를보낸후 response가 도착할때까지 await 한다.
            url: related_url+encodeURI(keyword.title),
            method: 'get',
            headers: {
                'accept': '*/*',
                // 'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            }        
        });
        const related_arr=[];     //await 이후에 이부분이 실행되기때문에 콜백함수를 다로 써줄 필요없다. 
        const $ = cheerio.load(body);

        $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li').each(function() { //연관검색어를 모두 추출하여 related_arr에 넣습니다.
                     related_arr.push($(this).find('a').text());
        });
        keyword.related_arr=related_arr; //_.map 을 활용하였기때문에 keyword의 검색어와 연관검색어가 매칭된다. 
        return keyword;
    }))
}

async function main() {
    console.log(await getResult());       //async 함수인 getResult()호출한다.  
}

main();  //1.main()함수의 실행 




//Qestion.1 36번째줄 에서 return await promise.all 을하였는데 이것의 의미  
                                                        








//   모든 async 함수는 암묵적으로 promise를 반환하고, promise가 함수로부터 반환할 값 을 resolve 한다.
//   await 키워드는 오직 async 로 정의된 함수의 내부에서만 사용될 수 있다. 
// async 함수에는 await식이 포함될 수 있습니다. 이 식은 async 함수의 실행을 일시 중지하고 전달 된 Promise의 해결을 기다린 다음 async 
// 함수의 실행을 다시 시작하고 완료후 값을 반환합니다.