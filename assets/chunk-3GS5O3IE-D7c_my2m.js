import{m as Zt}from"./chunk-TBF5ZNIQ-CE87Bdu0.js";import{y as Qt}from"./chunk-RWUO3TPN-Bi2Z_wEQ.js";import{m as d,p as _,q as w,P as te,U as ee,C as K,a as se,e as ie,l as re,b as ae,h as ne,n as oe,b2 as le,o as ce}from"./mermaid.esm.min-Cn8UL8--.js";var Ct=function(){var t=d(function(F,n,o,g){for(o=o||{},g=F.length;g--;o[F[g]]=n);return o},"o"),e=[1,2],s=[1,3],a=[1,4],i=[2,4],l=[1,9],h=[1,11],y=[1,16],u=[1,17],S=[1,18],m=[1,19],b=[1,33],D=[1,20],O=[1,21],v=[1,22],R=[1,23],E=[1,24],p=[1,26],x=[1,27],L=[1,28],B=[1,29],j=[1,30],G=[1,31],P=[1,32],it=[1,35],rt=[1,36],at=[1,37],nt=[1,38],J=[1,34],f=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ot=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],Lt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],mt={trace:d(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:d(function(F,n,o,g,k,r,I){var c=r.length-1;switch(k){case 3:return g.setRootDoc(r[c]),r[c];case 4:this.$=[];break;case 5:r[c]!="nl"&&(r[c-1].push(r[c]),this.$=r[c-1]);break;case 6:case 7:this.$=r[c];break;case 8:this.$="nl";break;case 12:this.$=r[c];break;case 13:let ht=r[c-1];ht.description=g.trimColon(r[c]),this.$=ht;break;case 14:this.$={stmt:"relation",state1:r[c-2],state2:r[c]};break;case 15:let dt=g.trimColon(r[c]);this.$={stmt:"relation",state1:r[c-3],state2:r[c-1],description:dt};break;case 19:this.$={stmt:"state",id:r[c-3],type:"default",description:"",doc:r[c-1]};break;case 20:var z=r[c],V=r[c-2].trim();if(r[c].match(":")){var ct=r[c].split(":");z=ct[0],V=[V,ct[1]]}this.$={stmt:"state",id:z,type:"default",description:V};break;case 21:this.$={stmt:"state",id:r[c-3],type:"default",description:r[c-5],doc:r[c-1]};break;case 22:this.$={stmt:"state",id:r[c],type:"fork"};break;case 23:this.$={stmt:"state",id:r[c],type:"join"};break;case 24:this.$={stmt:"state",id:r[c],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:r[c-1].trim(),note:{position:r[c-2].trim(),text:r[c].trim()}};break;case 29:this.$=r[c].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=r[c].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:r[c-3],url:r[c-2],tooltip:r[c-1]};break;case 33:this.$={stmt:"click",id:r[c-3],url:r[c-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:r[c-1].trim(),classes:r[c].trim()};break;case 36:this.$={stmt:"style",id:r[c-1].trim(),styleClass:r[c].trim()};break;case 37:this.$={stmt:"applyClass",id:r[c-1].trim(),styleClass:r[c].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:r[c].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:r[c-2].trim(),classes:[r[c].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:r[c-2].trim(),classes:[r[c].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:s,6:a},{1:[3]},{3:5,4:e,5:s,6:a},{3:6,4:e,5:s,6:a},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],i,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:l,5:h,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:u,19:S,22:m,24:b,25:D,26:O,27:v,28:R,29:E,32:25,33:p,35:x,37:L,38:B,41:j,45:G,48:P,51:it,52:rt,53:at,54:nt,57:J},t(f,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:y,17:u,19:S,22:m,24:b,25:D,26:O,27:v,28:R,29:E,32:25,33:p,35:x,37:L,38:B,41:j,45:G,48:P,51:it,52:rt,53:at,54:nt,57:J},t(f,[2,7]),t(f,[2,8]),t(f,[2,9]),t(f,[2,10]),t(f,[2,11]),t(f,[2,12],{14:[1,40],15:[1,41]}),t(f,[2,16]),{18:[1,42]},t(f,[2,18],{20:[1,43]}),{23:[1,44]},t(f,[2,22]),t(f,[2,23]),t(f,[2,24]),t(f,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(f,[2,28]),{34:[1,49]},{36:[1,50]},t(f,[2,31]),{13:51,24:b,57:J},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ot,[2,44],{58:[1,56]}),t(ot,[2,45],{58:[1,57]}),t(f,[2,38]),t(f,[2,39]),t(f,[2,40]),t(f,[2,41]),t(f,[2,6]),t(f,[2,13]),{13:58,24:b,57:J},t(f,[2,17]),t(Lt,i,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(f,[2,29]),t(f,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(f,[2,14],{14:[1,71]}),{4:l,5:h,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:u,19:S,21:[1,72],22:m,24:b,25:D,26:O,27:v,28:R,29:E,32:25,33:p,35:x,37:L,38:B,41:j,45:G,48:P,51:it,52:rt,53:at,54:nt,57:J},t(f,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(f,[2,34]),t(f,[2,35]),t(f,[2,36]),t(f,[2,37]),t(ot,[2,46]),t(ot,[2,47]),t(f,[2,15]),t(f,[2,19]),t(Lt,i,{7:78}),t(f,[2,26]),t(f,[2,27]),{5:[1,79]},{5:[1,80]},{4:l,5:h,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:u,19:S,21:[1,81],22:m,24:b,25:D,26:O,27:v,28:R,29:E,32:25,33:p,35:x,37:L,38:B,41:j,45:G,48:P,51:it,52:rt,53:at,54:nt,57:J},t(f,[2,32]),t(f,[2,33]),t(f,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:d(function(F,n){if(n.recoverable)this.trace(F);else{var o=new Error(F);throw o.hash=n,o}},"parseError"),parse:d(function(F){var n=this,o=[0],g=[],k=[null],r=[],I=this.table,c="",z=0,V=0,ct=0,ht=2,dt=1,Vt=r.slice.call(arguments,1),T=Object.create(this.lexer),U={yy:{}};for(var St in this.yy)Object.prototype.hasOwnProperty.call(this.yy,St)&&(U.yy[St]=this.yy[St]);T.setInput(F,U.yy),U.yy.lexer=T,U.yy.parser=this,typeof T.yylloc>"u"&&(T.yylloc={});var kt=T.yylloc;r.push(kt);var Xt=T.options&&T.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Ht(A){o.length=o.length-2*A,k.length=k.length-A,r.length=r.length-A}d(Ht,"popStack");function It(){var A;return A=g.pop()||T.lex()||dt,typeof A!="number"&&(A instanceof Array&&(g=A,A=g.pop()),A=n.symbols_[A]||A),A}d(It,"lex");for(var $,_t,M,N,we,Tt,X={},ut,Y,vt,pt;;){if(M=o[o.length-1],this.defaultActions[M]?N=this.defaultActions[M]:(($===null||typeof $>"u")&&($=It()),N=I[M]&&I[M][$]),typeof N>"u"||!N.length||!N[0]){var bt="";pt=[];for(ut in I[M])this.terminals_[ut]&&ut>ht&&pt.push("'"+this.terminals_[ut]+"'");T.showPosition?bt="Parse error on line "+(z+1)+`:
`+T.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[$]||$)+"'":bt="Parse error on line "+(z+1)+": Unexpected "+($==dt?"end of input":"'"+(this.terminals_[$]||$)+"'"),this.parseError(bt,{text:T.match,token:this.terminals_[$]||$,line:T.yylineno,loc:kt,expected:pt})}if(N[0]instanceof Array&&N.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+$);switch(N[0]){case 1:o.push($),k.push(T.yytext),r.push(T.yylloc),o.push(N[1]),$=null,_t?($=_t,_t=null):(V=T.yyleng,c=T.yytext,z=T.yylineno,kt=T.yylloc,ct>0);break;case 2:if(Y=this.productions_[N[1]][1],X.$=k[k.length-Y],X._$={first_line:r[r.length-(Y||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(Y||1)].first_column,last_column:r[r.length-1].last_column},Xt&&(X._$.range=[r[r.length-(Y||1)].range[0],r[r.length-1].range[1]]),Tt=this.performAction.apply(X,[c,V,z,U.yy,N[1],k,r].concat(Vt)),typeof Tt<"u")return Tt;Y&&(o=o.slice(0,-1*Y*2),k=k.slice(0,-1*Y),r=r.slice(0,-1*Y)),o.push(this.productions_[N[1]][0]),k.push(X.$),r.push(X._$),vt=I[o[o.length-2]][o[o.length-1]],o.push(vt);break;case 3:return!0}}return!0},"parse")},Jt=function(){var F={EOF:1,parseError:d(function(n,o){if(this.yy.parser)this.yy.parser.parseError(n,o);else throw new Error(n)},"parseError"),setInput:d(function(n,o){return this.yy=o||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:d(function(){var n=this._input[0];this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n;var o=n.match(/(?:\r\n?|\n).*/g);return o?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},"input"),unput:d(function(n){var o=n.length,g=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-o),this.offset-=o;var k=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var r=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===k.length?this.yylloc.first_column:0)+k[k.length-g.length].length-g[0].length:this.yylloc.first_column-o},this.options.ranges&&(this.yylloc.range=[r[0],r[0]+this.yyleng-o]),this.yyleng=this.yytext.length,this},"unput"),more:d(function(){return this._more=!0,this},"more"),reject:d(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:d(function(n){this.unput(this.match.slice(n))},"less"),pastInput:d(function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:d(function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:d(function(){var n=this.pastInput(),o=new Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+o+"^"},"showPosition"),test_match:d(function(n,o){var g,k,r;if(this.options.backtrack_lexer&&(r={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(r.yylloc.range=this.yylloc.range.slice(0))),k=n[0].match(/(?:\r\n?|\n).*/g),k&&(this.yylineno+=k.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:k?k[k.length-1].length-k[k.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],g=this.performAction.call(this,this.yy,this,o,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var I in r)this[I]=r[I];return!1}return!1},"test_match"),next:d(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,o,g,k;this._more||(this.yytext="",this.match="");for(var r=this._currentRules(),I=0;I<r.length;I++)if(g=this._input.match(this.rules[r[I]]),g&&(!o||g[0].length>o[0].length)){if(o=g,k=I,this.options.backtrack_lexer){if(n=this.test_match(g,r[I]),n!==!1)return n;if(this._backtrack){o=!1;continue}else return!1}else if(!this.options.flex)break}return o?(n=this.test_match(o,r[k]),n!==!1?n:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:d(function(){var n=this.next();return n||this.lex()},"lex"),begin:d(function(n){this.conditionStack.push(n)},"begin"),popState:d(function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:d(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:d(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:d(function(n){this.begin(n)},"pushState"),stateStackSize:d(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:d(function(n,o,g,k){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),o.yytext=o.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),o.yytext=o.yytext.substr(2).trim(),31;case 70:return this.popState(),o.yytext=o.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return o.yytext=o.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78,79],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return F}();mt.lexer=Jt;function lt(){this.yy={}}return d(lt,"Parser"),lt.prototype=mt,mt.Parser=lt,new lt}();Ct.parser=Ct;var Ye=Ct,Z="state",H="root",Dt="relation",he="classDef",de="style",ue="applyClass",et="default",Ft="divider",Yt="fill:none",Gt="fill: #333",Pt="markdown",Wt="normal",Et="rect",$t="rectWithTitle",pe="stateStart",ye="stateEnd",At="divider",Nt="roundedWithTitle",fe="note",ge="noteGroup",st="statediagram",me="state",Se=`${st}-${me}`,jt="transition",ke="note",_e="note-edge",Te=`${jt} ${_e}`,be=`${st}-${ke}`,Ee="cluster",$e=`${st}-${Ee}`,Ce="cluster-alt",De=`${st}-${Ce}`,zt="parent",Ut="note",xe="state",xt="----",Le=`${xt}${Ut}`,Ot=`${xt}${zt}`,Mt=d((t,e="TB")=>{if(!t.doc)return e;let s=e;for(let a of t.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir"),Ie=d(function(t,e){return e.db.getClasses()},"getClasses"),ve=d(async function(t,e,s,a){_.info("REF0:"),_.info("Drawing state diagram (v2)",e);let{securityLevel:i,state:l,layout:h}=w();a.db.extract(a.db.getRootDocV2());let y=a.db.getData(),u=Zt(e,i);y.type=a.type,y.layoutAlgorithm=h,y.nodeSpacing=(l==null?void 0:l.nodeSpacing)||50,y.rankSpacing=(l==null?void 0:l.rankSpacing)||50,w().look==="neo"?y.markers=["barbNeo"]:y.markers=["barb"],y.diagramId=e,await te(y,u);let S=8;try{(typeof a.db.getLinks=="function"?a.db.getLinks():new Map).forEach((m,b)=>{var x;let D=typeof b=="string"?b:typeof(b==null?void 0:b.id)=="string"?b.id:"";if(!D){_.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(b));return}let O=(x=u.node())==null?void 0:x.querySelectorAll("g"),v;if(O==null||O.forEach(L=>{var B;((B=L.textContent)==null?void 0:B.trim())===D&&(v=L)}),!v){_.warn("⚠️ Could not find node matching text:",D);return}let R=v.parentNode;if(!R){_.warn("⚠️ Node has no parent, cannot wrap:",D);return}let E=document.createElementNS("http://www.w3.org/2000/svg","a"),p=m.url.replace(/^"+|"+$/g,"");if(E.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",p),E.setAttribute("target","_blank"),m.tooltip){let L=m.tooltip.replace(/^"+|"+$/g,"");E.setAttribute("title",L)}R.replaceChild(E,v),E.appendChild(v),_.info("🔗 Wrapped node in <a> tag for:",D,m.url)})}catch(m){_.error("❌ Error injecting clickable links:",m)}ee.insertTitle(u,"statediagramTitleText",(l==null?void 0:l.titleTopMargin)??25,a.db.getDiagramTitle()),Qt(u,S,st,(l==null?void 0:l.useMaxWidth)??!0)},"draw"),Ge={getClasses:Ie,draw:ve,getDir:Mt},ft=new Map,W=0;function gt(t="",e=0,s="",a=xt){let i=s!==null&&s.length>0?`${a}${s}`:"";return`${xe}-${t}${i}-${e}`}d(gt,"stateDomId");var Ae=d((t,e,s,a,i,l,h,y)=>{_.trace("items",e),e.forEach(u=>{switch(u.stmt){case Z:tt(t,u,s,a,i,l,h,y);break;case et:tt(t,u,s,a,i,l,h,y);break;case Dt:{tt(t,u.state1,s,a,i,l,h,y),tt(t,u.state2,s,a,i,l,h,y);let S=h==="neo",m={id:"edge"+W,start:u.state1.id,end:u.state2.id,arrowhead:"normal",arrowTypeEnd:S?"arrow_barb_neo":"arrow_barb",style:Yt,labelStyle:"",label:K.sanitizeText(u.description??"",w()),arrowheadStyle:Gt,labelpos:"c",labelType:Pt,thickness:Wt,classes:jt,look:h};i.push(m),W++}break}})},"setupDoc"),wt=d((t,e="TB")=>{let s=e;if(t.doc)for(let a of t.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir");function Q(t,e,s){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(i=>{let l=s.get(i);l&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...l.styles])}));let a=t.find(i=>i.id===e.id);a?Object.assign(a,e):t.push(e)}d(Q,"insertOrUpdateNode");function Kt(t){var e;return((e=t==null?void 0:t.classes)==null?void 0:e.join(" "))??""}d(Kt,"getClassesFromDbInfo");function qt(t){return(t==null?void 0:t.styles)??[]}d(qt,"getStylesFromDbInfo");var tt=d((t,e,s,a,i,l,h,y)=>{var O,v,R;let u=e.id,S=s.get(u),m=Kt(S),b=qt(S),D=w();if(_.info("dataFetcher parsedItem",e,S,b),u!=="root"){let E=Et;e.start===!0?E=pe:e.start===!1&&(E=ye),e.type!==et&&(E=e.type),ft.get(u)||ft.set(u,{id:u,shape:E,description:K.sanitizeText(u,D),cssClasses:`${m} ${Se}`,cssStyles:b});let p=ft.get(u);e.description&&(Array.isArray(p.description)?(p.shape=$t,p.description.push(e.description)):(O=p.description)!=null&&O.length&&p.description.length>0?(p.shape=$t,p.description===u?p.description=[e.description]:p.description=[p.description,e.description]):(p.shape=Et,p.description=e.description),p.description=K.sanitizeTextOrArray(p.description,D)),((v=p.description)==null?void 0:v.length)===1&&p.shape===$t&&(p.type==="group"?p.shape=Nt:p.shape=Et),!p.type&&e.doc&&(_.info("Setting cluster for XCX",u,wt(e)),p.type="group",p.isGroup=!0,p.dir=wt(e),p.shape=e.type===Ft?At:Nt,p.cssClasses=`${p.cssClasses} ${$e} ${l?De:""}`);let x={labelStyle:"",shape:p.shape,label:p.description,cssClasses:p.cssClasses,cssCompiledStyles:[],cssStyles:p.cssStyles,id:u,dir:p.dir,domId:gt(u,W),type:p.type,isGroup:p.type==="group",padding:8,rx:10,ry:10,look:h,labelType:"markdown"};if(x.shape===At&&(x.label=""),t&&t.id!=="root"&&(_.trace("Setting node ",u," to be child of its parent ",t.id),x.parentId=t.id),x.centerLabel=!0,e.note){let L={labelStyle:"",shape:fe,label:e.note.text,labelType:"markdown",cssClasses:be,cssStyles:[],cssCompiledStyles:[],id:u+Le+"-"+W,domId:gt(u,W,Ut),type:p.type,isGroup:p.type==="group",padding:(R=D.flowchart)==null?void 0:R.padding,look:h,position:e.note.position},B=u+Ot,j={labelStyle:"",shape:ge,label:e.note.text,cssClasses:p.cssClasses,cssStyles:[],id:u+Ot,domId:gt(u,W,zt),type:"group",isGroup:!0,padding:16,look:h,position:e.note.position};W++,j.id=B,L.parentId=B,Q(a,j,y),Q(a,L,y),Q(a,x,y);let G=u,P=L.id;e.note.position==="left of"&&(G=L.id,P=u),i.push({id:G+"-"+P,start:G,end:P,arrowhead:"none",arrowTypeEnd:"",style:Yt,labelStyle:"",classes:Te,arrowheadStyle:Gt,labelpos:"c",labelType:Pt,thickness:Wt,look:h})}else Q(a,x,y)}e.doc&&(_.trace("Adding nodes children "),Ae(e,e.doc,s,a,i,!l,h,y))},"dataFetcher"),Ne=d(()=>{ft.clear(),W=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Rt=d(()=>new Map,"newClassesList"),Bt=d(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),yt=d(t=>JSON.parse(JSON.stringify(t)),"clone"),q,Pe=(q=class{constructor(e){this.version=e,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Rt(),this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=se,this.setAccTitle=ie,this.getAccDescription=re,this.setAccDescription=ae,this.setDiagramTitle=ne,this.getDiagramTitle=oe,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(e){this.clear(!0);for(let i of Array.isArray(e)?e:e.doc)switch(i.stmt){case Z:this.addState(i.id.trim(),i.type,i.doc,i.description,i.note);break;case Dt:this.addRelation(i.state1,i.state2,i.description);break;case he:this.addStyleClass(i.id.trim(),i.classes);break;case de:this.handleStyleDef(i);break;case ue:this.setCssClass(i.id.trim(),i.styleClass);break;case"click":this.addLink(i.id,i.url,i.tooltip);break}let s=this.getStates(),a=w();Ne(),tt(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,a.look,this.classes);for(let i of this.nodes)if(Array.isArray(i.label)){if(i.description=i.label.slice(1),i.isGroup&&i.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${i.id}]`);i.label=i.label[0]}}handleStyleDef(e){let s=e.id.trim().split(","),a=e.styleClass.split(",");for(let i of s){let l=this.getState(i);if(!l){let h=i.trim();this.addState(h),l=this.getState(h)}l&&(l.styles=a.map(h=>{var y;return(y=h.replace(/;/g,""))==null?void 0:y.trim()}))}}setRootDoc(e){_.info("Setting root doc",e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(e,s,a){if(s.stmt===Dt){this.docTranslator(e,s.state1,!0),this.docTranslator(e,s.state2,!1);return}if(s.stmt===Z&&(s.id===C.START_NODE?(s.id=e.id+(a?"_start":"_end"),s.start=a):s.id=s.id.trim()),s.stmt!==H&&s.stmt!==Z||!s.doc)return;let i=[],l=[];for(let h of s.doc)if(h.type===Ft){let y=yt(h);y.doc=yt(l),i.push(y),l=[]}else l.push(h);if(i.length>0&&l.length>0){let h={stmt:Z,id:le(),type:"divider",doc:yt(l)};i.push(yt(h)),s.doc=i}s.doc.forEach(h=>this.docTranslator(s,h,!0))}getRootDocV2(){return this.docTranslator({id:H,stmt:H},{id:H,stmt:H,doc:this.rootDoc},!0),{id:H,doc:this.rootDoc}}addState(e,s=et,a=void 0,i=void 0,l=void 0,h=void 0,y=void 0,u=void 0){let S=e==null?void 0:e.trim();if(!this.currentDocument.states.has(S))_.info("Adding state ",S,i),this.currentDocument.states.set(S,{stmt:Z,id:S,descriptions:[],type:s,doc:a,note:l,classes:[],styles:[],textStyles:[]});else{let m=this.currentDocument.states.get(S);if(!m)throw new Error(`State not found: ${S}`);m.doc||(m.doc=a),m.type||(m.type=s)}if(i&&(_.info("Setting state description",S,i),(Array.isArray(i)?i:[i]).forEach(m=>this.addDescription(S,m.trim()))),l){let m=this.currentDocument.states.get(S);if(!m)throw new Error(`State not found: ${S}`);m.note=l,m.note.text=K.sanitizeText(m.note.text,w())}h&&(_.info("Setting state classes",S,h),(Array.isArray(h)?h:[h]).forEach(m=>this.setCssClass(S,m.trim()))),y&&(_.info("Setting state styles",S,y),(Array.isArray(y)?y:[y]).forEach(m=>this.setStyle(S,m.trim()))),u&&(_.info("Setting state styles",S,y),(Array.isArray(u)?u:[u]).forEach(m=>this.setTextStyle(S,m.trim())))}clear(e){this.nodes=[],this.edges=[],this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Rt(),e||(this.links=new Map,ce())}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){_.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(e,s,a){this.links.set(e,{url:s,tooltip:a}),_.warn("Adding link",e,s,a)}getLinks(){return this.links}startIdIfNeeded(e=""){return e===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e="",s=et){return e===C.START_NODE?C.START_TYPE:s}endIdIfNeeded(e=""){return e===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e="",s=et){return e===C.END_NODE?C.END_TYPE:s}addRelationObjs(e,s,a=""){let i=this.startIdIfNeeded(e.id.trim()),l=this.startTypeIfNeeded(e.id.trim(),e.type),h=this.startIdIfNeeded(s.id.trim()),y=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(i,l,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(h,y,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:i,id2:h,relationTitle:K.sanitizeText(a,w())})}addRelation(e,s,a){if(typeof e=="object"&&typeof s=="object")this.addRelationObjs(e,s,a);else if(typeof e=="string"&&typeof s=="string"){let i=this.startIdIfNeeded(e.trim()),l=this.startTypeIfNeeded(e),h=this.endIdIfNeeded(s.trim()),y=this.endTypeIfNeeded(s);this.addState(i,l),this.addState(h,y),this.currentDocument.relations.push({id1:i,id2:h,relationTitle:a?K.sanitizeText(a,w()):void 0})}}addDescription(e,s){var l;let a=this.currentDocument.states.get(e),i=s.startsWith(":")?s.replace(":","").trim():s;(l=a==null?void 0:a.descriptions)==null||l.push(K.sanitizeText(i,w()))}cleanupLabel(e){return e.startsWith(":")?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,s=""){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});let a=this.classes.get(e);s&&a&&s.split(C.STYLECLASS_SEP).forEach(i=>{let l=i.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(i)){let h=l.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);a.textStyles.push(h)}a.styles.push(l)})}getClasses(){return this.classes}setCssClass(e,s){e.split(",").forEach(a=>{var l;let i=this.getState(a);if(!i){let h=a.trim();this.addState(h),i=this.getState(h)}(l=i==null?void 0:i.classes)==null||l.push(s)})}setStyle(e,s){var a,i;(i=(a=this.getState(e))==null?void 0:a.styles)==null||i.push(s)}setTextStyle(e,s){var a,i;(i=(a=this.getState(e))==null?void 0:a.textStyles)==null||i.push(s)}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt==="dir")}getDirection(){var e;return((e=this.getDirectionStatement())==null?void 0:e.value)??"TB"}setDirection(e){let s=this.getDirectionStatement();s?s.value=e:this.rootDoc.unshift({stmt:"dir",value:e})}trimColon(e){return e.startsWith(":")?e.slice(1).trim():e.trim()}getData(){let e=w();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:Mt(this.getRootDocV2())}}getConfig(){return w().state}},d(q,"StateDB"),q.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},q),Oe=d(t=>`
defs [id$="-barbEnd"] {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: ${t.strokeWidth||1};
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: ${t.strokeWidth||1}px;
}
[id$="-barbEnd"] {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

[id$="-dependencyStart"], [id$="-dependencyEnd"] {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}

[data-look="neo"].statediagram-cluster rect {
  fill: ${t.mainBkg};
  stroke: ${t.useGradient?"url("+t.svgId+"-gradient)":t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth??1};
}
[data-look="neo"].statediagram-cluster rect.outer {
  rx: ${t.radius}px;
  ry: ${t.radius}px;
  filter: ${t.dropShadow?t.dropShadow.replace("url(#drop-shadow)",`url(${t.svgId}-drop-shadow)`):"none"}
}
`,"getStyles"),We=Oe;export{Ye as Y,Pe as _,We as g,Ge as q};
