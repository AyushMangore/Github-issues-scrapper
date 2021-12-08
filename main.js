// Author -> Ayush Mangore
// In this projetc I have scrapped the git hub issues web page
// it contains three random topics and under those topics 
// there is huge list of issues that needs to be resolved
// we will collect eight issues of each of three random topics in the separate pdf files
// Step first is to collect the url of  htat topics page of the github 
// we will acquire request and cheerio module of node for our task processing
const url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const getRepoPageHtml = require("./repoPage");
// Now we will make request to the web page with the help of that url
// Output will be collected in a call back function
// We will get html page as the response
// If there were some error while making request then we get response code
// 404 shows that our page not found
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        // Uncomment below line to view the response html
        // console.log(html);
        // Now for further processing we will use separate function
        getTopicLinks(html);
    }
}
// So, as we know we have three random topics we have to collect information
// through these topics one by one
function getTopicLinks(html){
    //  First we will load our html response in cheerio
    let $ = cheerio.load(html);
    // To go to the next page undeer random topics e need link
    //  below is the html attribute contaning the link
    // we will extract the link from the element
    // obviously we will get three links because we have three topics so far
    let linkElemArr =  $(".no-underline.d-flex.flex-column.flex-justify-center");
    // we will process each link one by one
    for(let i=0;i<linkElemArr.length;i++){
        let href = $(linkElemArr[i]).attr("href");
        // we will split the link through forward slash and pop the last element
        // as it contains the name of our topic
        let topicName = href.split("/").pop();
        // Now we will add default header of ourr website to go to the next page
        //  in this way our complete usl will be designed
        href =  "https://github.com"+href;
        // Uncomment below line to view the url
        // console.log(href);

        // Now we have to go inside the topics
        //  We will do this task in another function
        getRepoPageHtml(href,topicName);
    }
}   