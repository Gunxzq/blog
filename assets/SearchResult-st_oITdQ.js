import{u as U,j as ee,m as se,p as P,q as te,v as ae,x as le,y as ie,l as b,z as D,A as re,w as ue,k as t,B as ne,R as $,C as oe,D as ce,E as ve,G as me,H as pe,I as he,J as de,K as ye,L as Ee,M as H,N as ge,O as Be,P as Ae,Q as Ce,S as T,T as j,U as fe}from"./app-mnMmHsxk.js";const De=["/","/intro.html","/demo/","/demo/disable.html","/demo/layout.html","/demo/markdown.html","/demo/page.html","/posts/CallOpt%20copy.html","/posts/CallOpt.html","/posts/LoadingOpt%20copy.html","/posts/LoadingOpt.html","/posts/ResourceOpt.html","/posts/tomato.html","/posts/apple/1.html","/posts/apple/2.html","/posts/apple/3.html","/posts/apple/4.html","/posts/banana/1.html","/posts/banana/2.html","/posts/banana/3.html","/posts/banana/4.html","/404.html","/posts/","/posts/apple/","/posts/banana/","/category/","/category/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/","/category/%E6%8C%87%E5%8D%97/","/category/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/","/category/html/","/category/%E8%8B%B9%E6%9E%9C/","/category/%E6%B0%B4%E6%9E%9C/","/category/%E9%A6%99%E8%95%89/","/tag/","/tag/%E7%A6%81%E7%94%A8/","/tag/%E5%8A%A0%E5%AF%86/","/tag/%E5%B8%83%E5%B1%80/","/tag/markdown/","/tag/%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE/","/tag/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/","/tag/%E9%98%B2%E6%8A%96/","/tag/%E8%8A%82%E6%B5%81/","/tag/%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%89%98/","/tag/%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD/","/tag/%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/","/tag/%E7%BC%93%E5%AD%98/","/tag/%E7%BA%A2/","/tag/ads/","/tag/%E5%A4%A7/","/tag/%E5%9C%86/","/tag/%E9%BB%84/","/tag/%E5%BC%AF%E6%9B%B2%E7%9A%84/","/tag/%E9%95%BF/","/article/","/star/","/timeline/"],He="SLIMSEARCH_QUERY_HISTORY",y=U(He,[]),Re=()=>{const{queryHistoryCount:a}=H,l=a>0;return{enabled:l,queryHistories:y,addQueryHistory:i=>{l&&(y.value=Array.from(new Set([i,...y.value.slice(0,a-1)])))},removeQueryHistory:i=>{y.value=[...y.value.slice(0,i),...y.value.slice(i+1)]}}},L=a=>De[a.id]+("anchor"in a?`#${a.anchor}`:""),ke="SLIMSEARCH_RESULT_HISTORY",{resultHistoryCount:M}=H,E=U(ke,[]),we=()=>{const a=M>0;return{enabled:a,resultHistories:E,addResultHistory:l=>{if(a){const i={link:L(l),display:l.display};"header"in l&&(i.header=l.header),E.value=[i,...E.value.slice(0,M-1)]}},removeResultHistory:l=>{E.value=[...E.value.slice(0,l),...E.value.slice(l+1)]}}},Qe=a=>{const l=me(),i=P(),R=pe(),u=b(0),B=D(()=>u.value>0),h=he([]);return de(()=>{const{search:d,terminate:k}=ye(),g=Ee(o=>{const{resultsFilter:A=n=>n,querySplitter:F,suggestionsFilter:w,...Q}=l.value;o?(u.value+=1,d(o,i.value,Q).then(n=>A(n,o,i.value,R.value)).then(n=>{u.value-=1,h.value=n}).catch(n=>{console.warn(n),u.value-=1,u.value||(h.value=[])})):h.value=[]},H.searchDelay-H.suggestDelay,{maxWait:5e3});ge([a,i],([o])=>g(o.join(" "))),Be(()=>{k()})}),{isSearching:B,results:h}};var xe=ee({name:"SearchResult",props:{queries:{type:Array,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(a,{emit:l}){const i=se(),R=P(),u=te(ae),{enabled:B,addQueryHistory:h,queryHistories:d,removeQueryHistory:k}=Re(),{enabled:g,resultHistories:o,addResultHistory:A,removeResultHistory:F}=we(),w=B||g,Q=le(a,"queries"),{results:n,isSearching:_}=Qe(Q),r=ie({isQuery:!0,index:0}),m=b(0),p=b(0),I=D(()=>w&&(d.value.length>0||o.value.length>0)),q=D(()=>n.value.length>0),x=D(()=>n.value[m.value]||null),Y=()=>{const{isQuery:e,index:s}=r;s===0?(r.isQuery=!e,r.index=e?o.value.length-1:d.value.length-1):r.index=s-1},z=()=>{const{isQuery:e,index:s}=r;s===(e?d.value.length-1:o.value.length-1)?(r.isQuery=!e,r.index=0):r.index=s+1},G=()=>{m.value=m.value>0?m.value-1:n.value.length-1,p.value=x.value.contents.length-1},J=()=>{m.value=m.value<n.value.length-1?m.value+1:0,p.value=0},K=()=>{p.value<x.value.contents.length-1?p.value+=1:J()},N=()=>{p.value>0?p.value-=1:G()},S=e=>e.map(s=>fe(s)?s:t(s[0],s[1])),V=e=>{if(e.type==="customField"){const s=Ae[e.index]||"$content",[c,f=""]=Ce(s)?s[R.value].split("$content"):s.split("$content");return e.display.map(v=>t("div",S([c,...v,f])))}return e.display.map(s=>t("div",S(s)))},C=()=>{m.value=0,p.value=0,l("updateQuery",""),l("close")},W=()=>B?t("ul",{class:"slimsearch-result-list"},t("li",{class:"slimsearch-result-list-item"},[t("div",{class:"slimsearch-result-title"},u.value.queryHistory),d.value.map((e,s)=>t("div",{class:["slimsearch-result-item",{active:r.isQuery&&r.index===s}],onClick:()=>{l("updateQuery",e)}},[t(T,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},e),t("button",{class:"slimsearch-remove-icon",innerHTML:j,onClick:c=>{c.preventDefault(),c.stopPropagation(),k(s)}})]))])):null,X=()=>g?t("ul",{class:"slimsearch-result-list"},t("li",{class:"slimsearch-result-list-item"},[t("div",{class:"slimsearch-result-title"},u.value.resultHistory),o.value.map((e,s)=>t($,{to:e.link,class:["slimsearch-result-item",{active:!r.isQuery&&r.index===s}],onClick:()=>{C()}},()=>[t(T,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},[e.header?t("div",{class:"content-header"},e.header):null,t("div",e.display.map(c=>S(c)).flat())]),t("button",{class:"slimsearch-remove-icon",innerHTML:j,onClick:c=>{c.preventDefault(),c.stopPropagation(),F(s)}})]))])):null;return re("keydown",e=>{if(a.isFocusing){if(q.value){if(e.key==="ArrowUp")N();else if(e.key==="ArrowDown")K();else if(e.key==="Enter"){const s=x.value.contents[p.value];h(a.queries.join(" ")),A(s),i.push(L(s)),C()}}else if(g){if(e.key==="ArrowUp")Y();else if(e.key==="ArrowDown")z();else if(e.key==="Enter"){const{index:s}=r;r.isQuery?(l("updateQuery",d.value[s]),e.preventDefault()):(i.push(o.value[s].link),C())}}}}),ue([m,p],()=>{var e;(e=document.querySelector(".slimsearch-result-list-item.active .slimsearch-result-item.active"))==null||e.scrollIntoView(!1)},{flush:"post"}),()=>t("div",{class:["slimsearch-result-wrapper",{empty:a.queries.length?!q.value:!I.value}],id:"slimsearch-results"},a.queries.length?_.value?t(ne,{hint:u.value.searching}):q.value?t("ul",{class:"slimsearch-result-list"},n.value.map(({title:e,contents:s},c)=>{const f=m.value===c;return t("li",{class:["slimsearch-result-list-item",{active:f}]},[t("div",{class:"slimsearch-result-title"},e||u.value.defaultTitle),s.map((v,Z)=>{const O=f&&p.value===Z;return t($,{to:L(v),class:["slimsearch-result-item",{active:O,"aria-selected":O}],onClick:()=>{h(a.queries.join(" ")),A(v),C()}},()=>[v.type==="text"?null:t(v.type==="title"?oe:v.type==="heading"?ce:ve,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},[v.type==="text"&&v.header?t("div",{class:"content-header"},v.header):null,t("div",V(v))])])})])})):u.value.emptyResult:w?I.value?[W(),X()]:u.value.emptyHistory:u.value.emptyResult)}});export{xe as default};
