import{c as C}from"./chunk-AEOMTBSW-EJb4AV3A.js";import{d as P}from"./wardley-RL74JXVD-BCRCBASE-BYMAWRUH.js";import{y as v,e as z,a as F,h as S,n as W,l as D,b as E,m as g,L as m,O as T,o as L,p as w,aO as A,c as O}from"./mermaid.esm.min-Byx-dhWK.js";import"./chunk-H3VCZNTA-DBcgC00d.js";import"./app-CMqqc_13.js";var R=v.packet,u,y=(u=class{constructor(){this.packet=[],this.setAccTitle=z,this.getAccTitle=F,this.setDiagramTitle=S,this.getDiagramTitle=W,this.getAccDescription=D,this.setAccDescription=E}getConfig(){let t=m({...R,...T().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){L(),this.packet=[]}},g(u,"PacketDB"),u),M=1e4,Y=g((e,t)=>{C(e,t);let s=-1,r=[],l=1,{bitsPerRow:n}=t.getConfig();for(let{start:a,end:o,bits:c,label:d}of e.blocks){if(a!==void 0&&o!==void 0&&o<a)throw new Error(`Packet block ${a} - ${o} is invalid. End must be greater than start.`);if(a??(a=s+1),a!==s+1)throw new Error(`Packet block ${a} - ${o??a} is not contiguous. It should start from ${s+1}.`);if(c===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(o??(o=a+(c??1)-1),c??(c=o-a+1),s=o,w.debug(`Packet block ${a} - ${s} with label ${d}`);r.length<=n+1&&t.getPacket().length<M;){let[p,i]=H({start:a,end:o,bits:c,label:d},l,n);if(r.push(p),p.end+1===l*n&&(t.pushWord(r),r=[],l++),!i)break;({start:a,end:o,bits:c,label:d}=i)}}t.pushWord(r)},"populate"),H=g((e,t,s)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*s)return[e,void 0];let r=t*s-1,l=t*s;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:l,end:e.end,label:e.label,bits:e.end-l}]},"getNextFittingBlock"),$={parser:{yy:void 0},parse:g(async e=>{var r;let t=await P("packet",e),s=(r=$.parser)==null?void 0:r.yy;if(!(s instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(t),Y(t,s)},"parse")},N=g((e,t,s,r)=>{let l=r.db,n=l.getConfig(),{rowHeight:a,paddingY:o,bitWidth:c,bitsPerRow:d}=n,p=l.getPacket(),i=l.getDiagramTitle(),b=a+o,h=b*(p.length+1)-(i?0:a),k=c*d+2,f=A(t);f.attr("viewBox",`0 0 ${k} ${h}`),O(f,h,k,n.useMaxWidth);for(let[x,B]of p.entries())j(f,B,x,n);f.append("text").text(i).attr("x",k/2).attr("y",h-b/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),j=g((e,t,s,{rowHeight:r,paddingX:l,paddingY:n,bitWidth:a,bitsPerRow:o,showBits:c})=>{let d=e.append("g"),p=s*(r+n)+n;for(let i of t){let b=i.start%o*a+1,h=(i.end-i.start+1)*a-l;if(d.append("rect").attr("x",b).attr("y",p).attr("width",h).attr("height",r).attr("class","packetBlock"),d.append("text").attr("x",b+h/2).attr("y",p+r/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!c)continue;let k=i.end===i.start,f=p-2;d.append("text").attr("x",b+(k?h/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(i.start),k||d.append("text").attr("x",b+h).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),q={draw:N},G={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},I=g(({packet:e}={})=>{let t=m(G,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),Q={parser:$,get db(){return new y},renderer:q,styles:I};export{Q as diagram};
