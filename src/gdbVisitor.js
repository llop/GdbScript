// Generated from gdb.g4 by ANTLR 4.5.3
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by gdbParser.

function gdbVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

gdbVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
gdbVisitor.prototype.constructor = gdbVisitor;

// Visit a parse tree produced by gdbParser#prog.
gdbVisitor.prototype.visitProg = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ProgFunc.
gdbVisitor.prototype.visitProgFunc = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ProgInstr.
gdbVisitor.prototype.visitProgInstr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#func.
gdbVisitor.prototype.visitFunc = function(ctx) {
};


// Visit a parse tree produced by gdbParser#params.
gdbVisitor.prototype.visitParams = function(ctx) {
};


// Visit a parse tree produced by gdbParser#paramList.
gdbVisitor.prototype.visitParamList = function(ctx) {
};


// Visit a parse tree produced by gdbParser#blockInstructions.
gdbVisitor.prototype.visitBlockInstructions = function(ctx) {
};


// Visit a parse tree produced by gdbParser#AssignInstruction.
gdbVisitor.prototype.visitAssignInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#IfElseInstruction.
gdbVisitor.prototype.visitIfElseInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#WhileLoopInstruction.
gdbVisitor.prototype.visitWhileLoopInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ForLoopInstruction.
gdbVisitor.prototype.visitForLoopInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#FunCallInstruction.
gdbVisitor.prototype.visitFunCallInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#RetCallInstruction.
gdbVisitor.prototype.visitRetCallInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#NoInstruction.
gdbVisitor.prototype.visitNoInstruction = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ifElse.
gdbVisitor.prototype.visitIfElse = function(ctx) {
};


// Visit a parse tree produced by gdbParser#expr.
gdbVisitor.prototype.visitExpr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#andExpr.
gdbVisitor.prototype.visitAndExpr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#cmpExpr.
gdbVisitor.prototype.visitCmpExpr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#sumExpr.
gdbVisitor.prototype.visitSumExpr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#sumOp.
gdbVisitor.prototype.visitSumOp = function(ctx) {
};


// Visit a parse tree produced by gdbParser#prodExpr.
gdbVisitor.prototype.visitProdExpr = function(ctx) {
};


// Visit a parse tree produced by gdbParser#prodOp.
gdbVisitor.prototype.visitProdOp = function(ctx) {
};


// Visit a parse tree produced by gdbParser#unit.
gdbVisitor.prototype.visitUnit = function(ctx) {
};


// Visit a parse tree produced by gdbParser#access.
gdbVisitor.prototype.visitAccess = function(ctx) {
};


// Visit a parse tree produced by gdbParser#DotAccess.
gdbVisitor.prototype.visitDotAccess = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ArrayAccess.
gdbVisitor.prototype.visitArrayAccess = function(ctx) {
};


// Visit a parse tree produced by gdbParser#FuncAccess.
gdbVisitor.prototype.visitFuncAccess = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ExprAtom.
gdbVisitor.prototype.visitExprAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#IntAtom.
gdbVisitor.prototype.visitIntAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#BoolAtom.
gdbVisitor.prototype.visitBoolAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#StringAtom.
gdbVisitor.prototype.visitStringAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#NullAtom.
gdbVisitor.prototype.visitNullAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ThisAtom.
gdbVisitor.prototype.visitThisAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ArrayAtom.
gdbVisitor.prototype.visitArrayAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#ObjectAtom.
gdbVisitor.prototype.visitObjectAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#funcAtom.
gdbVisitor.prototype.visitFuncAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#IdAtom.
gdbVisitor.prototype.visitIdAtom = function(ctx) {
};


// Visit a parse tree produced by gdbParser#exprList.
gdbVisitor.prototype.visitExprList = function(ctx) {
};


// Visit a parse tree produced by gdbParser#objectProp.
gdbVisitor.prototype.visitObjectProp = function(ctx) {
};


// Visit a parse tree produced by gdbParser#WriteCall.
gdbVisitor.prototype.visitWriteCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#OnDebugOutputCall.
gdbVisitor.prototype.visitOnDebugOutputCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#OnAppOutputCall.
gdbVisitor.prototype.visitOnAppOutputCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#OnExecStateChangeCall.
gdbVisitor.prototype.visitOnExecStateChangeCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#DebugCall.
gdbVisitor.prototype.visitDebugCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#AnonFuncCall.
gdbVisitor.prototype.visitAnonFuncCall = function(ctx) {
};


// Visit a parse tree produced by gdbParser#UserDefinedFuncCall.
gdbVisitor.prototype.visitUserDefinedFuncCall = function(ctx) {
};



exports.gdbVisitor = gdbVisitor;