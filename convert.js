var fs = require('fs');

var outputFile = "output.sarif";

var sarif_template =
{
    "version": "2.1.0",
    "runs": [
        {
            "originalUriBaseIds": {
                "PROJECTROOT": {
                    "uri": "file:///github/workspace/",
                    "description": {
                        "text": "The root directory for all project files."
                    }
                }
            },
            "tool": {
                "driver": {
                    "name": "CRDA",
                    "rules": []
                }
            },
            "results": []
        }
    ]
};
  

var args = process.argv.splice(2);
if (args.length < 1) {
    console.log("You must pass crda json file");
    console.log("Usage:", process.argv[0], " crda.json");
    process.exit(0);
}
var crda = args[0]

//set or get rules
function srules(sarif, optional_set) {
    if (optional_set) { sarif.runs[0].tool.driver.rules = optional_set }
    return sarif.runs[0].tool.driver.rules
}
function sresults(sarif, optional_set) {
    if (optional_set) { sarif.runs[0].results = optional_set }
    return sarif.runs[0].results
}


function crda_to_rule (e) {
    var r = {}  
    r.id  = e.id;
    r.shortDescription  =  { "text": e.title };
    r.fullDescription  =  { "text": e.title };
    r.help  = { "text": "text for help", "markdown": "markdown ***text for help" } ;
    var sev =   "none" ; 
    if (e.severity == "medium") sev = "warning"    ;
    if (e.severity == "high") sev = "error"    ;
    if (e.severity == "critical") sev = "error" ;

    r.defaultConfiguration  =  { "level": sev };
    r.properties  = { "tags": [] } 
    return r;
}

function crda_to_result (e) {
    var r = {}  
    r.ruleId  = e.id;
    r.message  =  { "text": e.title };
    r.locations  =  [  {
        "physicalLocation": {
          "artifactLocation": {
            "uri": e.name,
            "uriBaseId": "PROJECTROOT"
          },
          "region": {
            "startLine": 1
          }
        }
      }]; 
    return r;
}



function mergeSarif(d1) {
    console.log(outputFile + " rules found: ", srules(sarif_template).length)
    console.log(outputFile + " locations found: ", sresults(sarif_template).length) 
    var crda = JSON.parse(d1) 
    var newRules = [] 
    var f = function (e) { newRules.push(crda_to_rule(e)) } 
    if (crda.severity.low)
        crda.severity.low.forEach(f)
    if (crda.severity.medium)
        crda.severity.medium.forEach(f)
    if (crda.severity.high)
        crda.severity.high.forEach(f)
    if (crda.severity.critical)
            crda.severity.critical.forEach(f) 
    console.log("Number of rules combined is: ", newRules.length)
    srules(sarif_template, newRules);  
    var results = [] 
    crda.analysed_dependencies.forEach (
        function (e) { results.push(crda_to_result(e)) } 
    )   
    sresults(sarif_template, results) 
    console.log(outputFile + " rules found: ", srules(sarif_template).length)
    console.log(outputFile + " locations found: ", sresults(sarif_template).length) 
    return sarif_template;
}

fs.readFile(crda, 'utf8', function (err, crdaData) {
    var sarif = mergeSarif(crdaData)
    writeJSON(outputFile, sarif, process.exit)
})

function writeJSON(file, value, then) {
    var stream = fs.createWriteStream(file);
    stream.once('open', function (fd) {
        stream.write(JSON.stringify(value));
        stream.end();
        console.log("Created: ", file);
        then(0)
    });
}