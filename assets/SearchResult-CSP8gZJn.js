import{u as j,j as ee,m as se,p as P,q as te,v as ae,x as le,y as re,l as x,z as D,A as ie,w as ue,k as t,B as ne,R as I,C as oe,D as ce,E as me,G as pe,H as ve,I as he,J as Ee,K as de,L as ye,M as H,N as ge,O as Ae,P as Be,Q as Ce,S as O,T as $,U as fe}from"./app-BPNakhlZ.js";const De=["/","/intro.html","/demo/","/demo/disable.html","/demo/layout.html","/demo/markdown.html","/demo/page.html","/posts/ECMA/","/posts/ECMA/understand%20copy.html","/posts/ECMA/understand.html","/posts/apple/1.html","/posts/apple/2.html","/posts/apple/3.html","/posts/apple/4.html","/posts/banana/1.html","/posts/banana/2.html","/posts/banana/3.html","/posts/banana/4.html","/posts/performance/CallOpt.html","/posts/performance/LoadingOpt.html","/posts/performance/","/posts/performance/ResourceOpt.html","/posts/performance/SSG.html","/posts/performance/SSR.html","/posts/performance/UserOpt.html","/posts/performance/renderOpt.html","/posts/ECMA/symbolicTerms/GrammaticalParameters.html","/posts/ECMA/symbolicTerms/","/posts/ECMA/symbolicTerms/symbol.html","/404.html","/posts/","/posts/apple/","/posts/banana/","/category/","/category/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/","/category/%E6%8C%87%E5%8D%97/","/category/ecma%E6%A0%87%E5%87%86/","/category/ecma/","/category/%E8%8B%B9%E6%9E%9C/","/category/%E6%B0%B4%E6%9E%9C/","/category/%E9%A6%99%E8%95%89/","/category/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/","/tag/","/tag/%E7%A6%81%E7%94%A8/","/tag/%E5%8A%A0%E5%AF%86/","/tag/%E5%B8%83%E5%B1%80/","/tag/markdown/","/tag/%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE/","/tag/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/","/tag/%E7%BA%A2/","/tag/%E5%A4%A7/","/tag/%E5%9C%86/","/tag/%E9%BB%84/","/tag/%E5%BC%AF%E6%9B%B2%E7%9A%84/","/tag/%E9%95%BF/","/tag/%E9%98%B2%E6%8A%96/","/tag/%E8%8A%82%E6%B5%81/","/tag/%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%89%98/","/tag/%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD/","/tag/%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD/","/tag/%E7%BC%93%E5%AD%98/","/tag/%E5%8E%8B%E7%BC%A9/","/tag/ssg/","/tag/ssr/","/tag/%E5%B1%80%E9%83%A8ssr/","/tag/%E9%A2%84%E6%B8%B2%E6%9F%93/","/tag/%E9%A2%84%E5%8A%A0%E8%BD%BD/","/tag/%E9%AA%A8%E6%9E%B6%E5%B1%8F/","/tag/canvas/","/article/","/star/","/timeline/"],He="SLIMSEARCH_QUERY_HISTORY",d=j(He,[]),Re=()=>{const{queryHistoryCount:a}=H,l=a>0;return{enabled:l,queryHistories:d,addQueryHistory:r=>{l&&(d.value=Array.from(new Set([r,...d.value.slice(0,a-1)])))},removeQueryHistory:r=>{d.value=[...d.value.slice(0,r),...d.value.slice(r+1)]}}},F=a=>De[a.id]+("anchor"in a?`#${a.anchor}`:""),ke="SLIMSEARCH_RESULT_HISTORY",{resultHistoryCount:U}=H,y=j(ke,[]),Se=()=>{const a=U>0;return{enabled:a,resultHistories:y,addResultHistory:l=>{if(a){const r={link:F(l),display:l.display};"header"in l&&(r.header=l.header),y.value=[r,...y.value.slice(0,U-1)]}},removeResultHistory:l=>{y.value=[...y.value.slice(0,l),...y.value.slice(l+1)]}}},we=a=>{const l=pe(),r=P(),R=ve(),u=x(0),A=D(()=>u.value>0),h=he([]);return Ee(()=>{const{search:E,terminate:k}=de(),g=ye(o=>{const{resultsFilter:B=n=>n,querySplitter:L,suggestionsFilter:S,...w}=l.value;o?(u.value+=1,E(o,r.value,w).then(n=>B(n,o,r.value,R.value)).then(n=>{u.value-=1,h.value=n}).catch(n=>{console.warn(n),u.value-=1,u.value||(h.value=[])})):h.value=[]},H.searchDelay-H.suggestDelay,{maxWait:5e3});ge([a,r],([o])=>g(o.join(" "))),Ae(()=>{k()})}),{isSearching:A,results:h}};var Qe=ee({name:"SearchResult",props:{queries:{type:Array,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(a,{emit:l}){const r=se(),R=P(),u=te(ae),{enabled:A,addQueryHistory:h,queryHistories:E,removeQueryHistory:k}=Re(),{enabled:g,resultHistories:o,addResultHistory:B,removeResultHistory:L}=Se(),S=A||g,w=le(a,"queries"),{results:n,isSearching:_}=we(w),i=re({isQuery:!0,index:0}),p=x(0),v=x(0),M=D(()=>S&&(E.value.length>0||o.value.length>0)),b=D(()=>n.value.length>0),Q=D(()=>n.value[p.value]||null),G=()=>{const{isQuery:e,index:s}=i;s===0?(i.isQuery=!e,i.index=e?o.value.length-1:E.value.length-1):i.index=s-1},Y=()=>{const{isQuery:e,index:s}=i;s===(e?E.value.length-1:o.value.length-1)?(i.isQuery=!e,i.index=0):i.index=s+1},z=()=>{p.value=p.value>0?p.value-1:n.value.length-1,v.value=Q.value.contents.length-1},J=()=>{p.value=p.value<n.value.length-1?p.value+1:0,v.value=0},K=()=>{v.value<Q.value.contents.length-1?v.value+=1:J()},N=()=>{v.value>0?v.value-=1:z()},q=e=>e.map(s=>fe(s)?s:t(s[0],s[1])),V=e=>{if(e.type==="customField"){const s=Be[e.index]||"$content",[c,f=""]=Ce(s)?s[R.value].split("$content"):s.split("$content");return e.display.map(m=>t("div",q([c,...m,f])))}return e.display.map(s=>t("div",q(s)))},C=()=>{p.value=0,v.value=0,l("updateQuery",""),l("close")},W=()=>A?t("ul",{class:"slimsearch-result-list"},t("li",{class:"slimsearch-result-list-item"},[t("div",{class:"slimsearch-result-title"},u.value.queryHistory),E.value.map((e,s)=>t("div",{class:["slimsearch-result-item",{active:i.isQuery&&i.index===s}],onClick:()=>{l("updateQuery",e)}},[t(O,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},e),t("button",{class:"slimsearch-remove-icon",innerHTML:$,onClick:c=>{c.preventDefault(),c.stopPropagation(),k(s)}})]))])):null,X=()=>g?t("ul",{class:"slimsearch-result-list"},t("li",{class:"slimsearch-result-list-item"},[t("div",{class:"slimsearch-result-title"},u.value.resultHistory),o.value.map((e,s)=>t(I,{to:e.link,class:["slimsearch-result-item",{active:!i.isQuery&&i.index===s}],onClick:()=>{C()}},()=>[t(O,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},[e.header?t("div",{class:"content-header"},e.header):null,t("div",e.display.map(c=>q(c)).flat())]),t("button",{class:"slimsearch-remove-icon",innerHTML:$,onClick:c=>{c.preventDefault(),c.stopPropagation(),L(s)}})]))])):null;return ie("keydown",e=>{if(a.isFocusing){if(b.value){if(e.key==="ArrowUp")N();else if(e.key==="ArrowDown")K();else if(e.key==="Enter"){const s=Q.value.contents[v.value];h(a.queries.join(" ")),B(s),r.push(F(s)),C()}}else if(g){if(e.key==="ArrowUp")G();else if(e.key==="ArrowDown")Y();else if(e.key==="Enter"){const{index:s}=i;i.isQuery?(l("updateQuery",E.value[s]),e.preventDefault()):(r.push(o.value[s].link),C())}}}}),ue([p,v],()=>{var e;(e=document.querySelector(".slimsearch-result-list-item.active .slimsearch-result-item.active"))==null||e.scrollIntoView(!1)},{flush:"post"}),()=>t("div",{class:["slimsearch-result-wrapper",{empty:a.queries.length?!b.value:!M.value}],id:"slimsearch-results"},a.queries.length?_.value?t(ne,{hint:u.value.searching}):b.value?t("ul",{class:"slimsearch-result-list"},n.value.map(({title:e,contents:s},c)=>{const f=p.value===c;return t("li",{class:["slimsearch-result-list-item",{active:f}]},[t("div",{class:"slimsearch-result-title"},e||u.value.defaultTitle),s.map((m,Z)=>{const T=f&&v.value===Z;return t(I,{to:F(m),class:["slimsearch-result-item",{active:T,"aria-selected":T}],onClick:()=>{h(a.queries.join(" ")),B(m),C()}},()=>[m.type==="text"?null:t(m.type==="title"?oe:m.type==="heading"?ce:me,{class:"slimsearch-result-type"}),t("div",{class:"slimsearch-result-content"},[m.type==="text"&&m.header?t("div",{class:"content-header"},m.header):null,t("div",V(m))])])})])})):u.value.emptyResult:S?M.value?[W(),X()]:u.value.emptyHistory:u.value.emptyResult)}});export{Qe as default};
