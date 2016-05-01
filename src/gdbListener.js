// Generated from gdb.g4 by ANTLR 4.5.3
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by gdbParser.
function gdbListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

gdbListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
gdbListener.prototype.constructor = gdbListener;

// Enter a parse tree produced by gdbParser#prog.
gdbListener.prototype.enterProg = function(ctx) {
};

// Exit a parse tree produced by gdbParser#prog.
gdbListener.prototype.exitProg = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ProgFunc.
gdbListener.prototype.enterProgFunc = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ProgFunc.
gdbListener.prototype.exitProgFunc = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ProgInstr.
gdbListener.prototype.enterProgInstr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ProgInstr.
gdbListener.prototype.exitProgInstr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#func.
gdbListener.prototype.enterFunc = function(ctx) {
};

// Exit a parse tree produced by gdbParser#func.
gdbListener.prototype.exitFunc = function(ctx) {
};


// Enter a parse tree produced by gdbParser#params.
gdbListener.prototype.enterParams = function(ctx) {
};

// Exit a parse tree produced by gdbParser#params.
gdbListener.prototype.exitParams = function(ctx) {
};


// Enter a parse tree produced by gdbParser#paramList.
gdbListener.prototype.enterParamList = function(ctx) {
};

// Exit a parse tree produced by gdbParser#paramList.
gdbListener.prototype.exitParamList = function(ctx) {
};


// Enter a parse tree produced by gdbParser#blockInstructions.
gdbListener.prototype.enterBlockInstructions = function(ctx) {
};

// Exit a parse tree produced by gdbParser#blockInstructions.
gdbListener.prototype.exitBlockInstructions = function(ctx) {
};


// Enter a parse tree produced by gdbParser#AssignInstruction.
gdbListener.prototype.enterAssignInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#AssignInstruction.
gdbListener.prototype.exitAssignInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#IfElseInstruction.
gdbListener.prototype.enterIfElseInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#IfElseInstruction.
gdbListener.prototype.exitIfElseInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#WhileLoopInstruction.
gdbListener.prototype.enterWhileLoopInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#WhileLoopInstruction.
gdbListener.prototype.exitWhileLoopInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ForLoopInstruction.
gdbListener.prototype.enterForLoopInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ForLoopInstruction.
gdbListener.prototype.exitForLoopInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#FunCallInstruction.
gdbListener.prototype.enterFunCallInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#FunCallInstruction.
gdbListener.prototype.exitFunCallInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#RetCallInstruction.
gdbListener.prototype.enterRetCallInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#RetCallInstruction.
gdbListener.prototype.exitRetCallInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#NoInstruction.
gdbListener.prototype.enterNoInstruction = function(ctx) {
};

// Exit a parse tree produced by gdbParser#NoInstruction.
gdbListener.prototype.exitNoInstruction = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ifElse.
gdbListener.prototype.enterIfElse = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ifElse.
gdbListener.prototype.exitIfElse = function(ctx) {
};


// Enter a parse tree produced by gdbParser#expr.
gdbListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#expr.
gdbListener.prototype.exitExpr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#andExpr.
gdbListener.prototype.enterAndExpr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#andExpr.
gdbListener.prototype.exitAndExpr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#cmpExpr.
gdbListener.prototype.enterCmpExpr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#cmpExpr.
gdbListener.prototype.exitCmpExpr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#sumExpr.
gdbListener.prototype.enterSumExpr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#sumExpr.
gdbListener.prototype.exitSumExpr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#sumOp.
gdbListener.prototype.enterSumOp = function(ctx) {
};

// Exit a parse tree produced by gdbParser#sumOp.
gdbListener.prototype.exitSumOp = function(ctx) {
};


// Enter a parse tree produced by gdbParser#prodExpr.
gdbListener.prototype.enterProdExpr = function(ctx) {
};

// Exit a parse tree produced by gdbParser#prodExpr.
gdbListener.prototype.exitProdExpr = function(ctx) {
};


// Enter a parse tree produced by gdbParser#prodOp.
gdbListener.prototype.enterProdOp = function(ctx) {
};

// Exit a parse tree produced by gdbParser#prodOp.
gdbListener.prototype.exitProdOp = function(ctx) {
};


// Enter a parse tree produced by gdbParser#unit.
gdbListener.prototype.enterUnit = function(ctx) {
};

// Exit a parse tree produced by gdbParser#unit.
gdbListener.prototype.exitUnit = function(ctx) {
};


// Enter a parse tree produced by gdbParser#access.
gdbListener.prototype.enterAccess = function(ctx) {
};

// Exit a parse tree produced by gdbParser#access.
gdbListener.prototype.exitAccess = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DotAccess.
gdbListener.prototype.enterDotAccess = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DotAccess.
gdbListener.prototype.exitDotAccess = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ArrayAccess.
gdbListener.prototype.enterArrayAccess = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ArrayAccess.
gdbListener.prototype.exitArrayAccess = function(ctx) {
};


// Enter a parse tree produced by gdbParser#FuncAccess.
gdbListener.prototype.enterFuncAccess = function(ctx) {
};

// Exit a parse tree produced by gdbParser#FuncAccess.
gdbListener.prototype.exitFuncAccess = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ExprAtom.
gdbListener.prototype.enterExprAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ExprAtom.
gdbListener.prototype.exitExprAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#IntAtom.
gdbListener.prototype.enterIntAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#IntAtom.
gdbListener.prototype.exitIntAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#BoolAtom.
gdbListener.prototype.enterBoolAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#BoolAtom.
gdbListener.prototype.exitBoolAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#StringAtom.
gdbListener.prototype.enterStringAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#StringAtom.
gdbListener.prototype.exitStringAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#NullAtom.
gdbListener.prototype.enterNullAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#NullAtom.
gdbListener.prototype.exitNullAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ThisAtom.
gdbListener.prototype.enterThisAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ThisAtom.
gdbListener.prototype.exitThisAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ArrayAtom.
gdbListener.prototype.enterArrayAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ArrayAtom.
gdbListener.prototype.exitArrayAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#ObjectAtom.
gdbListener.prototype.enterObjectAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#ObjectAtom.
gdbListener.prototype.exitObjectAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#funcAtom.
gdbListener.prototype.enterFuncAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#funcAtom.
gdbListener.prototype.exitFuncAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#IdAtom.
gdbListener.prototype.enterIdAtom = function(ctx) {
};

// Exit a parse tree produced by gdbParser#IdAtom.
gdbListener.prototype.exitIdAtom = function(ctx) {
};


// Enter a parse tree produced by gdbParser#exprList.
gdbListener.prototype.enterExprList = function(ctx) {
};

// Exit a parse tree produced by gdbParser#exprList.
gdbListener.prototype.exitExprList = function(ctx) {
};


// Enter a parse tree produced by gdbParser#objectProp.
gdbListener.prototype.enterObjectProp = function(ctx) {
};

// Exit a parse tree produced by gdbParser#objectProp.
gdbListener.prototype.exitObjectProp = function(ctx) {
};


// Enter a parse tree produced by gdbParser#WriteCall.
gdbListener.prototype.enterWriteCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#WriteCall.
gdbListener.prototype.exitWriteCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#OnDebugOutputCall.
gdbListener.prototype.enterOnDebugOutputCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#OnDebugOutputCall.
gdbListener.prototype.exitOnDebugOutputCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgRunCall.
gdbListener.prototype.enterDbgRunCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgRunCall.
gdbListener.prototype.exitDbgRunCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgStopCall.
gdbListener.prototype.enterDbgStopCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgStopCall.
gdbListener.prototype.exitDbgStopCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgPauseCall.
gdbListener.prototype.enterDbgPauseCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgPauseCall.
gdbListener.prototype.exitDbgPauseCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgContCall.
gdbListener.prototype.enterDbgContCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgContCall.
gdbListener.prototype.exitDbgContCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgBreakInsCall.
gdbListener.prototype.enterDbgBreakInsCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgBreakInsCall.
gdbListener.prototype.exitDbgBreakInsCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgBreakRemCall.
gdbListener.prototype.enterDbgBreakRemCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgBreakRemCall.
gdbListener.prototype.exitDbgBreakRemCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#DbgVarsCall.
gdbListener.prototype.enterDbgVarsCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#DbgVarsCall.
gdbListener.prototype.exitDbgVarsCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#AnonFuncCall.
gdbListener.prototype.enterAnonFuncCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#AnonFuncCall.
gdbListener.prototype.exitAnonFuncCall = function(ctx) {
};


// Enter a parse tree produced by gdbParser#UserDefinedFuncCall.
gdbListener.prototype.enterUserDefinedFuncCall = function(ctx) {
};

// Exit a parse tree produced by gdbParser#UserDefinedFuncCall.
gdbListener.prototype.exitUserDefinedFuncCall = function(ctx) {
};



exports.gdbListener = gdbListener;