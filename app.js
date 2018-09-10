var cheerio = require('cheerio');
var request = require('request');

var url = 'https://www.melon.com/new/';

request(url, function(error, response, html){
if(!error){    
    var $ = cheerio.load(html);
  
  $('.ellipsis.rank01 > span > a').each(function(){
    var title_info = $(this);
    var title_info_text = title_info.text();
  })
    
   $('.checkEllipsis > a').each(function(){
    var artist_info = $(this);
    var artist_info_text = artist_info.text();
  }) 
    
    console.log(artist_info_text + " - " + title_info_text);
// 콘솔창 출력
    
  }

})