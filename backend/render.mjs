import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {chromium} from 'playwright';
const dir=path.resolve(process.argv[2]),root=path.resolve(import.meta.dirname,'..'),plan=JSON.parse(fs.readFileSync(dir+'/plan.json')),cuts=JSON.parse(fs.readFileSync(dir+'/cuts.json'));
const ff=spawnSync(process.env.CATALYST_PYTHON||(fs.existsSync(root+'/.venv/bin/python')?root+'/.venv/bin/python':'python3'),['-c','import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],{encoding:'utf8'}).stdout.trim();
function run(args){const r=spawnSync(ff,['-y','-loglevel','error',...args],{encoding:'utf8'});if(r.status)throw Error(r.stderr);}
const mode=process.argv[3]||'all',hasPresenter=!JSON.parse(fs.readFileSync(dir+'/input.json')).context;
if(mode!=='assemble'){
const browser=await chromium.launch({headless:true,...(process.env.CATALYST_BROWSER_CHANNEL?{channel:process.env.CATALYST_BROWSER_CHANNEL}:{})});
try{const page=await browser.newPage({viewport:{width:1280,height:720}});await page.setContent('<html><body style="margin:0;background:#0d0d0b"><svg width="1280" height="720"></svg></body></html>');await page.addScriptTag({path:root+'/prototype/assets/vendor/d3.v7.9.0.min.js'});
await page.addScriptTag({path:root+'/backend/charts.js'});
for(let i=0;i<3;i++){
 await page.evaluate(args=>window.renderChart(args),{scene:plan.scenes[i],scope:plan.scope,index:i});
 await page.screenshot({path:dir+`/scene${i}.png`});run(['-loop','1','-i',dir+`/scene${i}.png`,'-t',String(cuts[i+2]-(i===0&&!hasPresenter?0:cuts[i+1])),'-vf','fade=t=in:st=0:d=0.3','-r','25','-c:v','libx264','-pix_fmt','yuv420p',dir+`/s${i+1}.mp4`]);}
}finally{await browser.close();}

}
if(mode!=='graphics'){
if(hasPresenter){run(['-i',dir+'/presenter.mp4','-an','-vf','scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,fps=25,tpad=stop_mode=clone:stop_duration=8','-t',String(cuts[1]),'-c:v','libx264','-pix_fmt','yuv420p',dir+'/s0.mp4']);
}
fs.writeFileSync(dir+'/segments.txt',(hasPresenter?[0,1,2,3]:[1,2,3]).map(i=>`file 's${i}.mp4'`).join('\n'));
run(['-f','concat','-safe','0','-i',dir+'/segments.txt','-i',dir+'/narration.mp3','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-af','apad','-t',String(cuts.at(-1)),'-movflags','+faststart',dir+'/video.mp4']);run(['-i',dir+'/video.mp4','-f','null','-']);

}
