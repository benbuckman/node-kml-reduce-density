// reduce the coordinate density of a KML file.
// by Ben Buckman, newleafdigital.com
// (please copy with credit.)

var async = require('async')
  , fs = require('fs')
  , path = require('path');
  
  
var argv = require('optimist')
  .usage('Usage: $0 --in [PATH] --out [PATH] --reduce [NUM]')
  .describe('in', 'source KML file')
  .describe('out', 'write to new KML file')
  .describe('reduce', 'Preserve 1/N coordinates. 1=all, 4=25%, 10=10%. Default 2 (50%).')
  .demand(['in', 'out', 'reduce'])
  .default('reduce', 2)
  .argv;

try {
  if (isNaN(argv.reduce) || argv.reduce < 1 || argv.reduce % 1 !== 0) {
    throw("--reduce has to be an integer >= 1");
  }
}
catch(e) {
  console.error(e);
  process.exit(1);
}

var origXml, newXml = '';

async.series([
  
  // make sure input file exists
  function(next) {
    path.exists(argv.in, function(exists){
      if (exists) next();
      else {
        console.error("Input file %s does not exist.", argv.in);
        process.exit(1);
      }
    });
  },
  
  // read it
  function(next) {
    fs.readFile(argv.in, 'utf8', function (err, data) {
      if (err) throw err;
      origXml = data;
      next();
    });
  },

  // parse it
  function(next) {
    var lines = origXml.split("\n")
      , coordRegex = /-?\d+\.\d+,-?\d+\.\d+/g
      , ind
      , coordCounter = 0;
    
    for (ind = 0; ind < lines.length; ind++) {
      isCoordLine = lines[ind].match(coordRegex);
      
      if (! isCoordLine) {
        newXml += lines[ind] + '\n';
      }
      else {
        coordCounter++;
        if (coordCounter === argv.reduce) {
          newXml += lines[ind] + '\n';
          coordCounter = 0;
        }
        // (otherwise skip)
      }
    }
    
    next();
  },

  // write
  function(next) {
    fs.writeFile(argv.out, newXml, 'utf8', function(err) {
      if (err) throw(err);
      else next();
    });
  }
  
]);
