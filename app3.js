var cheerio = require('cheerio');
var request = require('request');
 
var url = 'https://www.naver.com';
 
request(url, function(err, res, body){
    if(err) {throw err};
 
   const $ = cheerio.load(body);
var postElements = $("#PM_ID_ct > div.header > div.special_bg > div > div.area_logo > h1 > a > span"); 

	console.log(postElements)



});
