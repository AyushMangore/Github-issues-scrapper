const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
// pdfkit module is provided by node js to create and manipulate the pdf files
const pdfkit = require("pdfkit");

// This function will be called by repoPage.js
// url of the issues page and topic name and repository name has also been provided 
function getIssuesHtml(url,topic,repoName){
    // First we will make the request and collect our html response
    request(url,cb);
    function cb(err,response,html){
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("Page Not Found");
        }else{
            // Uncomment below line to view the html response
            // console.log(html);
            // Now we will extract the issues
            getIssues(html);
        }
    }

    function getIssues(html){
        // First we will load the html in cheerio
        let $ = cheerio.load(html);
        // Below is the html element containing the heading of the issues we will extract the deading
        let issuesElemArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        // we will store the link of each issue in this array
        let arr = [];
        // we will iterate through all the issues
        for(let i=0;i<issuesElemArr.length;i++){
            // we will extract the link through each issues
            let issueLink = $(issuesElemArr[i]).attr("href");
            // Uncomment below line to view the link
            // console.log(issueLink);
            // Push links in the array
            arr.push(issueLink);
        }
        // Uncomment below line to view all issues for a particular repository
        // console.log(topic," -> ",arr);

        // Now we have to create pdf
        // But before that we will create our folders
        // we will join our current directory path with the name of the topic
        let folderPath = path.join(__dirname,topic);
        // After generating the complete path we will make folder at that path
        // For that we have create a dedicated function whic hwill create the folder on 
        //  the path that has been provided to it
        dirCreator(folderPath);
        // Now under this folder we have to create our pdf file
        // we will simply join our folder name with the repo name and will put the extension of .pdf 
        // as we are only working with eight repos at a time we will be having eight pdf files 
        // under each topics
        let filePath = path.join(folderPath,repoName+".pdf");
        // now we will convert the content of our into text format 
        // JSON.stringify will connvert our array into string 
        let text = JSON.stringify(arr);
        // Now first taking the reference of pdfkit
        let pdfDoc = new pdfkit();
        // now to create new file we have a function called pipe
        // in pipe function with the help of our fs module we will create a write stream by providing
        // the file path
        pdfDoc.pipe(fs.createWriteStream(filePath));
        // Now after creating we will add content to our file in the form of text
        pdfDoc.text(text);
        // finally we will close the operation
        pdfDoc.end();
    }
}

// exporting the function to enhace the modularity of the code
module.exports = getIssuesHtml;

// This function will create the folder on the location that is being provided
function dirCreator(folderPath){
    // If folder is already existing then we will nnot create otherwise we will simply create 
    if(fs.existsSync(folderPath) == false){
        // creating the folder with the help of fs module and it's mkdirSync function
        fs.mkdirSync(folderPath);
    }
}