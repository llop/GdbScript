var exec = require('child_process').exec;


// just compiles
function gpp(program, callback) {

  var gppCmd = 'g++ -g '+program;
  exec(gppCmd, function(error, stdout, stderr) {
    callback(error, stdout, stderr);
  });

}

exports.gpp = gpp;