import{c as X}from"./chunk-AEOMTBSW-Bk5SQMPN.js";import{d as Z}from"./wardley-RL74JXVD-BCRCBASE-Be5_Y2Kg.js";import{y as _,m as l,o as ee,p as $,aP as te,q as ae,L as ie,aO as le,aQ as re,aR as P,aS as se,c as oe,h as ne,n as pe,e as de,a as ce,b as ue,l as ge}from"./mermaid.esm.min-DuQ3jSie.js";import"./chunk-H3VCZNTA-trL45hR3.js";import"./app-Br1tpLDH.js";var W=_.pie,v={sections:new Map,showData:!1,config:W},h=v.sections,y=v.showData,he=structuredClone(W),me=l(()=>structuredClone(he),"getConfig"),fe=l(()=>{h=new Map,y=v.showData,ee()},"clear"),xe=l(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);h.has(e)||(h.set(e,a),$.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),we=l(()=>h,"getSections"),Se=l(e=>{y=e},"setShowData"),$e=l(()=>y,"getShowData"),E={getConfig:me,clear:fe,setDiagramTitle:ne,getDiagramTitle:pe,setAccTitle:de,getAccTitle:ce,setAccDescription:ue,getAccDescription:ge,addSection:xe,getSections:we,setShowData:Se,getShowData:$e},ve=l((e,a)=>{X(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ye={parse:l(async e=>{let a=await Z("pie",e);$.debug(a),ve(a,E)},"parse")},Te=l(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),De=Te,be=l(e=>{let a=[...e.values()].reduce((r,s)=>r+s,0),T=[...e.entries()].map(([r,s])=>({label:r,value:s})).filter(r=>r.value/a*100>=1);return te().value(r=>r.value).sort(null)(T)},"createPieArcs"),Ce=l((e,a,T,r)=>{var B;$.debug(`rendering pie chart
`+e);let s=r.db,D=ae(),b=ie(s.getConfig(),D.pie),C=40,o=18,c=4,p=450,d=p,m=le(a),n=m.append("g");n.attr("transform","translate("+d/2+","+p/2+")");let{themeVariables:i}=D,[k]=re(i.pieOuterStrokeWidth);k??(k=2);let A=b.textPosition,u=Math.min(d,p)/2-C,q=P().innerRadius(0).outerRadius(u),j=P().innerRadius(u*A).outerRadius(u*A);n.append("circle").attr("cx",0).attr("cy",0).attr("r",u+k/2).attr("class","pieOuterCircle");let g=s.getSections(),G=be(g),H=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12],f=0;g.forEach(t=>{f+=t});let O=G.filter(t=>(t.data.value/f*100).toFixed(0)!=="0"),x=se(H).domain([...g.keys()]);n.selectAll("mySlices").data(O).enter().append("path").attr("d",q).attr("fill",t=>x(t.data.label)).attr("class","pieCircle"),n.selectAll("mySlices").data(O).enter().append("text").text(t=>(t.data.value/f*100).toFixed(0)+"%").attr("transform",t=>"translate("+j.centroid(t)+")").style("text-anchor","middle").attr("class","slice");let N=n.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),R=[...g.entries()].map(([t,S])=>({label:t,value:S})),w=n.selectAll(".legend").data(R).enter().append("g").attr("class","legend").attr("transform",(t,S)=>{let L=o+c,J=L*R.length/2,K=12*o,U=S*L-J;return"translate("+K+","+U+")"});w.append("rect").attr("width",o).attr("height",o).style("fill",t=>x(t.label)).style("stroke",t=>x(t.label)),w.append("text").attr("x",o+c).attr("y",o-c).text(t=>s.getShowData()?`${t.label} [${t.value}]`:t.label);let Q=Math.max(...w.selectAll("text").nodes().map(t=>(t==null?void 0:t.getBoundingClientRect().width)??0)),V=d+C+o+c+Q,M=((B=N.node())==null?void 0:B.getBoundingClientRect().width)??0,Y=d/2-M/2,I=d/2+M/2,z=Math.min(0,Y),F=Math.max(V,I)-z;m.attr("viewBox",`${z} 0 ${F} ${p}`),oe(m,p,F,b.useMaxWidth)},"draw"),ke={draw:Ce},Fe={parser:ye,db:E,renderer:ke,styles:De};export{Fe as diagram};
