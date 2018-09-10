var request = require('request');
var cheerio = require('cheerio');
request('https://www.melon.com/chart/index.htm', function(error, response, body){
  if(error) throw error
    
  const $ = cheerio.load(body); //request 모듈을 이용해서 가져온 정보를 넣어줌

 
    $('.ellipsis.rank01 > span > a').each(function(){ 
       var title = $(this);
       var title_text = title.text();
        
        
    });
    

    console.log(title_text);
    
  });