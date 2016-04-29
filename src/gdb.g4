grammar gdb;


//----------------------------------------------------------------------------------------------------
// No rewrite rules in ANTLR4
// https://theantlrguy.atlassian.net/wiki/display/~admin/2012/12/08/Tree+rewriting+in+ANTLR+v4
//----------------------------------------------------------------------------------------------------


prog : progChunk+ EOF ;
progChunk : func                    # ProgFunc
          | blockInstructions       # ProgInstr
          ;

func : FUNC ID params '{' blockInstructions '}' ;
params : '(' paramList? ')' ;
paramList : ID (',' ID)* ;
blockInstructions : instruction+ ;

instruction : ID ASSIGN expr ';'                            # AssignInstruction
            | ifElse                                        # IfElseInstruction
            | WHILE expr '{' blockInstructions '}'          # WhileLoopInstruction
            | FOR ID IN expr '{' blockInstructions '}'      # ForLoopInstruction
            | funCall ';'                                   # FunCallInstruction
            | RETURN expr? ';'                              # RetCallInstruction
            | ';'                                           # NoInstruction
            ;

ifElse : IF expr '{' blockInstructions 
            ( '}' ELSIF expr '{' blockInstructions )* 
            ( '}' ELSE '{' blockInstructions )? '}' ;

// Grammar for expressions with boolean, relational and aritmetic operators
expr : andExpr (OR andExpr)* ;
andExpr: cmpExpr (AND cmpExpr)* ;
cmpExpr: sumExpr ( op=(EQUAL|NOT_EQUAL|LT|LE|GT|GE) sumExpr )? ;

sumExpr : prodExpr (sumOp prodExpr)* ;
sumOp : PLUS | MINUS ;

prodExpr : unit (prodOp unit)* ;
prodOp : MUL | DIV | MOD ;

unit : op=(NOT|PLUS|MINUS)? access ;

access : atom (subAccess)* ;
subAccess : '.' ID              # DotAccess
          | '[' expr ']'        # ArrayAccess
          | '(' exprList? ')'   # FuncAccess
          ;

// Atom of the expressions (variables, integer and boolean literals).
// An atom can also be a function call or another expression in parenthesis
// Or an inlined function, why not?
atom : '(' expr ')'                                 # ExprAtom
     | INT                                          # IntAtom
     | (TRUE|FALSE)                                 # BoolAtom
     | STRING                                       # StringAtom
     | NULL                                         # NullAtom
     | THIS                                         # ThisAtom
     | '[' exprList? ']'                            # ArrayAtom
     | '{' ( objectProp (',' objectProp)* )? '}'    # ObjectAtom
     | FUNC params '{' blockInstructions '}'        # funcAtom
     | ID                                           # IdAtom
     ;
exprList :  expr (',' expr)* ;
objectProp : ID ':' expr ;

// function calls:
//   - predefined functions -> write, debug, etc
//   - user-defined functions -> a lits of arguments in parenthesis (possibly empty)
funCall : 'write' '(' expr? ')'                                     # WriteCall

        | 'onDebugOutput' '(' expr ')'                              # OnDebugOutputCall
        | 'onAppOutput' '(' expr ')'                                # OnAppOutputCall
        | 'onExecStateChange' '(' expr ')'                          # OnExecStateChangeCall

        | 'debug' '(' expr ')'                                      # DebugCall

        | FUNC params '{' blockInstructions '}' '(' exprList? ')'   # AnonFuncCall
        | ID '(' exprList? ')'                                      # UserDefinedFuncCall
        ;




//--------------------------------------------------------------------------------
// tokens
//--------------------------------------------------------------------------------

// equality
ASSIGN : '=' ;
EQUAL : '==' ;
NOT_EQUAL: '!=' ;
LT : '<' ;
LE : '<=' ;
GT : '>' ;
GE : '>=' ;

// arithmetics
PLUS : '+' ;
MINUS : '-' ;
MUL : '*' ;
DIV : '/' ;
MOD : '%' ;

// boolean expressions
NOT : 'not' ;
AND : 'and' ;
OR : 'or' ; 
NULL : 'null' ;

// conditionals 
IF : 'if' ;
ELSIF : 'elsif' ;
ELSE : 'else' ;

// loops
WHILE : 'while' ;
FOR : 'for' ;
IN : 'in' ;

// functions
FUNC : 'function' ;
THIS : 'this' ;
RETURN : 'return' ;

// bool values
TRUE : 'true' ;
FALSE : 'false' ;

// ids and numbers
ID : [a-zA-Z_] [a-zA-Z0-9_]* ;
INT : [0-9]+ ;


// C-style comments
COMMENT : ( '//' ~[\n\r]* '\r'? '\n' 
          | '/*' .*? '*/' 
          ) -> channel(HIDDEN) ;

// Strings (in quotes) with escape sequences
STRING : '"' ( ESC_SEQ | ~[\\"] )* '"' ;
fragment ESC_SEQ : '\\' [btnfr\"\'\\] ;

// whitespace
WS : [ \t\r\n]+ -> skip ;
