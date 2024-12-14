const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser'); 
const path = require('path');
const { stderr } = require('process');

const app = express();
const port = 8888;

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data
app.use(express.json()); // Handles JSON data

// Paths

// Client Git Deployment Path

const clientGitDeploymentPath = path.join(__dirname, '../../deployments/client-deployments');
const indexFilePath = path.join(__dirname, 'index.html')

// Route to test that the server is working
app.get("/", function (req, res) {
    const data = {
        message: "Welcome to 2kwattz Controlroom Server",
        title: "2kwattz Control Room",
        about: "2kwattz ControlRoom provides access to Roshan's Personal Home Server which includes numerous benefits...",
        data: {
            userId: 1,
            username: "exampleUser",
            role: "admin"
        }
    };
    // res.status(200).json(data);
    res.sendFile(indexFilePath, (error)=>{
        console.log("Error ", error)
    })
});

// Route for the deployment page
app.get("/create-deployment", function (req, res) {
    res.status(200).send("Index of Create Deployment Page");
});

// Route to add a GitHub repository URL
app.post("/add-github-repo", function (req, res) {
    console.log("Request Body:", req.body);  // Log the entire body
    const githubRepoUrl = req.body.githubRepoUrl;
    const serviceType = req.body;

    // Log the GitHub repo URL
    console.log("GitHub Repo URL", githubRepoUrl, "My DIRNAME", __dirname);

    const cloneGithubRepoCommand = `git clone ${githubRepoUrl} ${clientGitDeploymentPath}`;

    exec(cloneGithubRepoCommand, (error,stdout,stderr) =>{
        if(error){
            console.error("[*] Error in cloning client's github repo ",error)
            return
        }
       if(stderr){
        console.error(`stderr: ${stderr}`);
        console.log("[*] Github Repo created for deployment")
       }

       if(stdout){
        console.log("[*] Github Repo created for deployment")
       }
    })

    

    console.log("TARGET FOLDER", clientGitDeploymentPath)

    // Check if the URL was received correctly
    if (githubRepoUrl) {
        res.status(200).json({ message: "GitHub repo URL received successfully", repoUrl: githubRepoUrl });
    } else {
        res.status(400).json({ message: "GitHub repo URL is missing" });
    }
});


// Deployments

app.get("my-deployments", function(req,res){

})

// Run Deployment

app.post("run-deployment", function(req,res){

    serviceType = req.body.serviceType
    servicePath = req.body.servicePath

    exec(`cd ${clientGitDeploymentPath}`, (error,stdout,stderr) =>{
        if(error){
            console.error("[*] Error in redirection to client's repo ",error)
            return
        }
       if(stderr){
        console.error(`stderr: ${stderr}`);
        console.log("[*] Client Deployment Repo Selected")
       }

       if(stdout){
        console.log("[*] Client Deployment Repo Selected")
       }
    })
    



})

// Server listening on the specified port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
