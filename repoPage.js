const request = require("request");
const cheerio = require("cheerio");
const getIssuesHtml = require("./issues");

// In this function we will get two things first is the url of the topic and another is the topic name
function getRepoPageHtml(url,topic){
    // Again we will make the request and collect our html response
    // if there is any error then it will be handled by displaying error message
    request(url,cb);
    function cb(err,response,html){
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("Page Not Found");
        }
        else{
            // console.log(html);
            // now we will process our html response
            getReposLink(html);
        }
    }

    function getReposLink(html){
        // At first we will load our html response in the cheerio
        let $ = cheerio.load(html);
        // There will be many lists of repos appering 
        // we will collect all those repos through below html tag
        // headings arr will contain headings of all the repos 
        let headingsArr = $(".f3.color-fg-muted.text-normal.lh-condensed");
        // we will display the topic for which we want to extract the issues
        console.log(topic)
        // as we have mentioned we intially will work with eight repos only
        //  this number can be changed by manipulating the loop limit
        for(let i=0;i<8;i++){
            // each heading conating an anchor element we will find it
            // there are two anchors associated with one heading we need second one to reach till issues
            let twoAnchors = $(headingsArr[i]).find("a");
            // we will extract the link from the second anchor
            let link =  $(twoAnchors[1]).attr("href");
            // Uncomment below line to view the link
            // console.log(link);
            // / we will add our default header of the webpage to make the link complete
            let fullink = "https://github.com"+link+"/issues";
            // to extract the repo name we will simply split our link through forward slashes
            // and last element is our name of the repository
            let repoName = link.split("/").pop();
            // we can view the full link by uncommenting below line
            // console.log(fullink);
            // finally we will extract the issues of the repos 
            getIssuesHtml(fullink,topic,repoName);
        }
        console.log("..............................");
    }
}


// we will export our function, so that it can simply be used by importing in other files
module.exports = getRepoPageHtml;