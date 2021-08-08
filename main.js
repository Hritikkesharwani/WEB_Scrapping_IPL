let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595',cb1);

function cb1(error,response,html){
    if(error){
        console.log(error);
    }else if (response.statusCode== 404){
        console.log("page not found");
    }
    else {
        Allmatchpage(html);
    }
}
function Allmatchpage(html){

    console.log("\n'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\n");
    let searchtool = cheerio.load(html);
    let elementArray = searchtool(".widget-items.cta-link");
    let elem = searchtool(elementArray).find("a");
    let link = elem.attr("href");
    let fulllink = `https://www.espncricinfo.com${link}`;
    request(fulllink,cb2);
    console.log("\n");
}
function cb2(error,response,html){
    if(error){
        console.log(error);
    }else if (response.statusCode== 404){
        console.log("page not found");
    }
    else {
        Scorecardlink(html);
    }
}
let folderPath = path.join("C:\\Users\\Asus\\Desktop\\webd_pep\\Web_Scrapping\\Activity","IPL");
function Scorecardlink(html){
    let IPLPresent = fs.existsSync(folderPath);
    if (IPLPresent) {
        console.log("File already exist 😎");
        return;
    }
    fs.mkdirSync(folderPath);
    let searchtool = cheerio.load(html);
    let elementarray1 = searchtool('a[data-hover = "Scorecard"]' );
    for(let i=0; i<elementarray1.length;i++){
        let link = searchtool(elementarray1[i]).attr("href");
    let fulllink = `https://www.espncricinfo.com${link}`;
    request(fulllink,cb3);
       }
    }
    function cb3(error,response,html){
        if(error){
            console.log(error);
        }else if (response.statusCode== 404){
            console.log("page not found");
        }
        else {
            AllPlayerstat(html);
        }
    }
    function AllPlayerstat(html){
    
     let searchtool = cheerio.load(html);
    let Allstats = searchtool(".table.batsman");
    let teamname = searchtool(".name-link p");

    for(let j=0; j<Allstats.length;j++){
        let table = searchtool(Allstats[j]).find("tbody tr");
        team = searchtool(teamname[j]).text();
        let folderpath2 = path.join(folderPath,team);
        let teamPresent = fs.existsSync(folderpath2);
        if (teamPresent) {
        }else{
            fs.mkdirSync(folderpath2);
        }
for(let i=0; i<table.length-1;i++){
        let col = searchtool(table[i]).find("td");
        let isBatsManRow = searchtool(col[0]).hasClass("batsman-cell");
    if(isBatsManRow == true){
        let name = searchtool(col[0]).text();
        let R = searchtool(col[2]).text();
        let B = searchtool(col[3]).text();
        let fours = searchtool(col[5]).text();
        let sixes = searchtool(col[6]).text();
        let sr = searchtool(col[7]).text();
        
        let stats = [name,R,B,fours,sixes,sr];
        
        
        let jsonstat = JSON.stringify(stats);
        let folderpath3 = path.join(folderpath2,name+".json");
        let namePresent = fs.existsSync(folderpath3);
        if (namePresent) {
            let content = fs.readFileSync(folderpath3);
            let jsoncontent = JSON.parse(content);
            jsoncontent.push(stats);
            let mcontent = JSON.stringify(jsoncontent);
            fs.writeFileSync(folderpath3,mcontent);
        }else{
            fs.writeFileSync(folderpath3,jsonstat);
        }


 }
    }

    }
    
    }
