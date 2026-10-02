import http from 'node:http';
import {api} from '../backend/api.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||8772);
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4'};
http.createServer(async(req,res)=>{
  if(await api(req,res))return;
  let name;
  try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
  if(name==='/'){res.writeHead(302,{Location:'/prototype/'}).end();return;}
  if(name.endsWith('/'))name+='index.html';
  const filename=path.resolve(root,'.'+name),ext=path.extname(filename);
  const allowed=filename.startsWith(root+path.sep)&&types[ext]&&(name.startsWith('/prototype/')||name==='/design-system/tokens.css'||(name.startsWith('/experiments/')&&['.png','.mp4'].includes(ext)));
  if(!allowed||!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404).end('Not found');return;}
  const size=fs.statSync(filename).size;
  const headers={'Content-Type':types[ext],'Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  let start=0,end=size-1,status=200;
  if(req.headers.range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    if(match[1]){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
    else start=Math.max(0,size-Number(match[2]));
    if(start> end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length']=end-start+1;
  res.writeHead(status,headers);
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(filename,{start,end}).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Catalyst prototype: http://127.0.0.1:${port}/prototype/`));
