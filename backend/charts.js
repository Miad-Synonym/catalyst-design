// Shared deterministic D3 scene renderer. No generated code is executed.
window.renderChart = ({scene,scope,index}) => {
 const svg=d3.select('svg');svg.selectAll('*').remove();svg.attr('role','img').attr('aria-label',scene.title);
 const ink='#efe4ca',muted='#aaa697',accent='#d2e898';
 const text=(x,y,t,size=22,color=ink)=>svg.append('text').attr('x',x).attr('y',y).attr('fill',color).attr('font-family','Arial').attr('font-size',size).text(t);
 const wrap=(x,y,value,width,size=22,color=ink)=>{let line='',row=0;for(const word of value.split(' ')){if((line+' '+word).length>width){text(x,y+row++*(size+8),line,size,color);line=word;}else line+=(line?' ':'')+word;}text(x,y+row*(size+8),line,size,color);};
 const g=scene.graphic||{type:'mechanism'};
 svg.append('title').text(scene.title);svg.append('desc').text(scene.narration);
 text(80,75,`${g.type==='bars'||g.type==='step'?'ILLUSTRATIVE EXAMPLE':'POSSIBLE MECHANISM'} · ${index+1}/3`,14,muted);
 wrap(80,135,scene.title,58,34);
 const line=(x1,y1,x2,y2,color=muted)=>svg.append('line').attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2).attr('stroke',color).attr('stroke-width',2);
 if(g.type==='bars'||g.type==='step'){
  const values=g.values,labels=g.labels,scale=d3.scaleLinear().domain([0,Math.max(...values)*1.2||1]);
  const fmt=v=>`${d3.format(',.2~f')(v)} ${g.unit}`;
  if(g.type==='bars'){
   scale.range([0,740]);
   const y=d3.scaleBand().domain(labels).range([240,490]).padding(.35);
   for(const tick of scale.ticks(4)){const x=350+scale(tick);line(x,225,x,490,'#303229');text(x,520,d3.format('~s')(tick),16,muted);}
   labels.forEach((label,i)=>{wrap(80,y(label)+26,label,21,21);svg.append('rect').attr('x',350).attr('y',y(label)).attr('width',scale(values[i])).attr('height',y.bandwidth()).attr('rx',4).attr('fill',i===labels.length-1?accent:'#77776b');text(362+scale(values[i]),y(label)+y.bandwidth()/2+7,fmt(values[i]),21);});
  }else{
   scale.range([490,240]);const x=d3.scalePoint().domain(labels).range([280,1010]);
   for(const tick of scale.ticks(4)){line(200,scale(tick),1120,scale(tick),'#303229');text(80,scale(tick)+6,fmt(tick),17,muted);}
   svg.append('path').attr('d',d3.line().x((v,i)=>x(labels[i])).y(v=>scale(v)).curve(d3.curveStepAfter)(values)).attr('fill','none').attr('stroke',accent).attr('stroke-width',5);
   values.forEach((v,i)=>{svg.append('circle').attr('cx',x(labels[i])).attr('cy',scale(v)).attr('r',7).attr('fill',accent);text(x(labels[i])-28,scale(v)-20,fmt(v),23);wrap(x(labels[i])-65,530,labels[i],18,18);});
  }
  wrap(80,600,g.note,110,18,muted);
 }else if(g.type==='takeaway'){
  text(80,290,'01',18,accent);wrap(150,290,scene.steps[0],38,36);
  line(80,335,1160,335,'#363b2b');
  scene.steps.slice(1).forEach((step,i)=>{text(80,410+i*105,`0${i+2}`,18,accent);wrap(150,410+i*105,step,48,28);});
 }else{
  const timeline=g.type==='timeline',y=330;
  if(timeline){
   line(125,250,125,540,accent);
   scene.steps.forEach((step,i)=>{const yy=260+i*130;svg.append('rect').attr('x',115).attr('y',yy-10).attr('width',20).attr('height',20).attr('fill',accent);text(180,yy+7,`0${i+1}`,20,accent);wrap(250,yy+7,step,48,28);});
  }else{
  line(130,y,1110,y,'#505541');
  scene.steps.forEach((step,i)=>{const x=160+i*440;svg.append('circle').attr('cx',x).attr('cy',y).attr('r',timeline?18:48).attr('fill','#25291d').attr('stroke',accent).attr('stroke-width',2);if(!timeline)text(x-7,y+8,String(i+1),25,accent);text(x-70,timeline?290:430,timeline?String(i+1):'',20,accent);wrap(x-80,timeline?400:470,step,23,24);if(i<2)text(x+200,y+9,'→',32,accent);});
 }
 }
 wrap(80,675,scope,130,14,muted);
};
