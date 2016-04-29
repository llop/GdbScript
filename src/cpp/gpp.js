
// just compiles
function gpp(programName, sourceFiles, lxcOptions, callback) {
  
  // lxc stuff
  var boxName = lxcOptions.boxName;
  var lxcService = lxcOptions.lxcService;
  
  // prep command
  var sourcesStr = sourceFiles.join(' ');
  var gppCmd = ['g++-5', '-g', '-std=c++14', '-o', programName, sourcesStr, '-lncurses'].join(' ');
  var suCmd = "'cd ~; "+gppCmd+"'";
  var cmd = ['lxc-attach', '-n', boxName, '--', 'su', '-c', suCmd, lxcService.user].join(' ');
  console.log("G++5 COMMAND "+cmd);

  // run g++: g++-5 -g -o programName sourceFiles -lncurses
  lxcService.exec(cmd, false, function(error, stdout, stderr, code, signal) {
    callback(error, stdout, stderr, code, signal);
  });
}

module.exports = gpp;