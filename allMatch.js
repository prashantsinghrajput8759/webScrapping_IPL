const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj=require("./scorecard");
function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(html);
            extractAllLink(html);
        }
    });
}
function extractAllLink(html) {
    let $ = cheerio.load(html);
    let scoreCardElem = $("a[data-hover='Scorecard']");
    for (let i = 0; i < scoreCardElem.length; i++) {
        const link = $(scoreCardElem[i]).attr("href");
        //console.log(link);
        let fullLink="https://www.espncricinfo.com"+link;
        scoreCardObj.ps(fullLink);
     //   console.log(fullLink);

    }
}
module.exports={
    getAlmatches:getAllMatchesLink
}