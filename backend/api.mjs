import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawn} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..'),store=path.join(root,'.runtime/jobs'),token=crypto.randomBytes(32).toString('hex');fs.mkdirSync(store,{recursive:true});let active=null;
const valid=id=>/^[a-f0-9-]{36}$/.test(id);const read=(id,file)=>JSON.parse(fs.readFileSync(path.join(store,id,file),'utf8'));
const send=(res,status,obj)=>res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(obj));
function launch(id){active=id;const dir=path.join(store,id),log=fs.openSync(dir+'/worker.log','a');const child=spawn(process.env.CATALYST_PYTHON||(fs.existsSync(root+'/.venv/bin/python')?root+'/.venv/bin/python':'python3'),[root+'/backend/worker.py',dir],{stdio:['ignore',log,log]});fs.closeSync(log);child.on('error',()=>{fs.writeFileSync(dir+'/status.json',JSON.stringify({stage:'failed',message:'Worker runtime unavailable.'}));active=null;});child.on('exit',()=>{active=null;});}
export async function api(req,res){
 const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/api/'))return false;
 const host=req.headers.host||'';
 if(!/^(127\.0\.0\.1|localhost):\d+$/.test(host)){send(res,403,{error:'Local backend only'});return true;}
 if(req.headers.origin&&req.headers.origin!==`http://${host}`){send(res,403,{error:'Origin rejected'});return true;}
 if(url.pathname==='/api/status'&&req.method==='GET'){send(res,200,{available:Boolean(process.env.FAL_KEY)||fs.existsSync(root+'/.env.catalyst.local'),token,mode:'live-local'});return true;}
 if(req.method==='POST'&&req.headers['x-catalyst-token']!==token){send(res,403,{error:'Session token required'});return true;}
 try{
 if(url.pathname==='/api/jobs'&&req.method==='POST'){
  let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>18000){send(res,413,{error:'Input too long'});return true;}}
  const data=JSON.parse(body);if(typeof data.input!=='string'||data.input.trim().length<3||data.input.length>12000||!valid(data.id)){send(res,400,{error:'Enter a headline or article text (3–12000 characters).'});return true;}
  if(fs.existsSync(store+'/'+data.id)){const old=read(data.id,'input.json');if(old.input!==data.input){send(res,409,{error:'Request ID already used'});return true;}send(res,200,{id:data.id});return true;}
  if(active){send(res,429,{error:'An explainer is already generating. Please wait for it to finish.'});return true;}
  const recent=fs.readdirSync(store).filter(id=>{try{return Date.now()-read(id,'input.json').created*1000<3600000;}catch{return false;}});if(recent.length>=60){send(res,429,{error:'Hourly chat limit reached (60 requests).'});return true;}
  let context=null,history=[];if(data.parent){if(!valid(data.parent)||!fs.existsSync(store+'/'+data.parent+'/input.json')){send(res,400,{error:'Unknown prior conversation turn'});return true;}
   const prior=read(data.parent,'input.json'),state=read(data.parent,'status.json');context=state.plan||prior.context||null;
   history=[...(prior.history||[]),{role:'user',content:prior.input}];
   if(state.message&&state.stage==='needs_text')history.push({role:'assistant',content:state.message});
   else if(state.plan)history.push({role:'assistant',content:state.plan.chat.join(' ')});
   history=history.slice(-12);
  }
  fs.mkdirSync(store+'/'+data.id);fs.writeFileSync(store+'/'+data.id+'/input.json',JSON.stringify({input:data.input.trim(),created:Date.now()/1000,context,history}));fs.writeFileSync(store+'/'+data.id+'/status.json',JSON.stringify({stage:'queued'}));launch(data.id);send(res,202,{id:data.id});return true;
 }
 const match=/^\/api\/jobs\/([a-f0-9-]{36})(?:\/(video.mp4|retry))?$/.exec(url.pathname);
 if(match){const [,id,action]=match;if(!fs.existsSync(store+'/'+id)){send(res,404,{error:'Unknown job'});return true;}
  if(action==='retry'&&req.method==='POST'){if(active){send(res,409,{error:'Worker busy'});return true;}if(read(id,'status.json').stage==='ready'){send(res,200,{id});return true;}launch(id);send(res,202,{id});return true;}
  if(!action&&req.method==='GET'){const status=read(id,'status.json');send(res,200,{id,...status,interrupted:!active&&!['ready','failed','needs_text'].includes(status.stage)});return true;}
  if(action==='video.mp4'&&['GET','HEAD'].includes(req.method)){
   const file=store+'/'+id+'/video.mp4';if(!fs.existsSync(file)){send(res,404,{error:'Video not ready'});return true;}const size=fs.statSync(file).size;let a=0,b=size-1,code=200;const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'private, max-age=3600'};
   if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416).end();return true;}a=+m[1];b=m[2]?Math.min(+m[2],b):b;if(a>b){res.writeHead(416).end();return true;}code=206;headers['Content-Range']=`bytes ${a}-${b}/${size}`;}headers['Content-Length']=b-a+1;res.writeHead(code,headers);if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start:a,end:b}).pipe(res);return true;
  }
 }
 send(res,404,{error:'Unknown API route'});
 }catch{send(res,400,{error:'Invalid request'});}return true;
}
