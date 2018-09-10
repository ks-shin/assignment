var request = require('request');
var cheerio = require("cheerio");

var url = "https://www.naver.com";
var related_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%9D%B4%EB%AA%85%EB%B0%95"
var arr =[];
var list_arr=[];

function getdata(){
        return new Promise((resolve, reject)=> {

                        request(url,(err, res, body)=>{
                            var $ = cheerio.load(body);
                            var posts = $('.ah_item .ah_a')
                            
                            var i=0;
                            var j=0;
                                posts.each( (index, item)=>{
                                    let title = $(item + ' .ah_k').text()
                                    let rank = $(item + ' .ah_r').text()
                                    arr[i].title = title;
                                    arr[i].rank = rank;
                                    i++;
                                    
                                
                                });
                                console.log(1)
                                resolve(arr);
                         })
        });
}
        
        getdata().then(function(arr){
            list_arr=arr;
            console.log(list_arr);
           
        })

       

            for(var j=0;j<10;j++){
                new Promise((resolve, reject)=> {
                      
                       var related_arr=[];
                       var index =0;
                   try{
                       
                   request({
                       url: related_url,
                       method: 'get',
                       headers: {
                           'accept': '*/*',
                           // 'accept-encoding': 'gzip, deflate, br',
                           'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                           'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
                       }
                       
                   },(err, res, body)=>{
                       
                       
                       var $ = cheerio.load(body);
                       
                       console.log(list_arr[j]);
                        $('#nx_related_keywords > dl > dd.lst_relate._related_keyword_list > ul > li ').each(function(){   
                            
                           related_arr.push($(this).find('a').text());
                       //     console.log(i);
                       //     console.log(arr[i]);
                       //     console.log("--------연관검색어--------")
                       // });
                       
                       
                       
                       // for(var key of related_arr)
                       
                       //     console.log(key);
                       
                       // for(var k=0;k<10;k++){
                       //     console.log(related_arr[k])
                       // }
       
                       resolve()
                       
                   });
                  
                   }
                  
               })
              
           })
        }
       
       
       

 
 
  


