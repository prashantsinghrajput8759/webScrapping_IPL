//const url = "https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-royal-challengers-bangalore-1st-match-1254058/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");
function processurl(url){
    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        // console.log(html);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html){
    //venue date opponent result runs balls fours sixes sr
    //ipl--
        //team
            //player
                //above details
    let $=cheerio.load(html);
    let result=$(" .match-info.match-info-MATCH.match-info-MATCH-half-width .status-text");
    let description=$(".header-info .description");
    let stringArr=description.text().split(",");
    let venue=stringArr[1].trim();
    let date=stringArr[2].trim();
    let res=result.text();
    let innings=$(".card.content-block.match-scorecard-table .Collapsible");
    for(let i=0;i<innings.length;i++){
        let teamName=$(innings[i]).find("h5").text();
        teamName=teamName.split("INNINGS")[0].trim();
        let opponentIndex=(i==0?1:0);
        let opponentName=$(innings[opponentIndex]).find("h5").text();
        opponentName=opponentName.split("INNINGS")[0].trim();
      //  console.log(`${teamName} ${opponentName} ${res}`);
      let cInning=$(innings[i]);
      let allRows=cInning.find(".table.batsman tbody tr");
      for(let j=0;j<allRows.length;j++){
          let allColumn=$(allRows[j]).find("td");
          let isWorthy=$(allColumn[0]).hasClass("batsman-cell");
          if(isWorthy==true){
              let playerName=$(allColumn[0]).text();
              let runs=$(allColumn[2]).text();
              let balls =$(allColumn[3]).text();
              let fours=$(allColumn[5]).text();
              let sixes=$(allColumn[6]).text();
              let sr=$(allColumn[7]).text();
              //console.log(`${sr}`);
              processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,res);
          }
      }
    }
}
function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,res){
    let teamPath=path.join(__dirname,"ipl",teamName);
    dirCreator(teamPath);
    let filePath=path.join(teamPath,playerName+".xlsx");
    let content=excelReader(filePath,playerName);
    let playerObj={
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        "result":res
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);
}
function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports={
    ps:processurl
}