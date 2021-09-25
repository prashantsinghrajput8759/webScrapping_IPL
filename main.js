const url = "https://www.espncricinfo.com/series/ipl-2021-1249214/";
const request = require("request");
const cheerio = require("cheerio");
const allMatchObj=require("./allMatch");
const fs=require("fs");
const path=require("path");
const iplPath=path.join(__dirname,"ipl");
dirCreator(iplPath);
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        // console.log(html);
        extractLink(html);
    }
}
//extracting the complete fixture link
function extractLink(html) {
    // let $ = cheerio.load(html);
    // let anchorElem = $("a[data-hover='View All Results']");
    // console.log($("a[data-hover='View All Fixtures']").text());
    // const link = anchorElem.attr("href");
    // //console.log(link);
    // const fullLink = "https://www.espncricinfo.com" + link;
     const fullLink= "https://www.espncricinfo.com/series/ipl-2021-1249214/match-results";
    // console.log(link);
    allMatchObj.getAlmatches(fullLink);
}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}
// function dirCreater(filePath) {
//     if (fs.existsSync(filePath) == false) {
//         fs.mkdirSync(filePath);
//     }

// }