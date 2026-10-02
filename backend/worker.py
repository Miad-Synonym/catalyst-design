"""Durable local worker. Provider receipts prevent automatic duplicate submissions."""
import json,pathlib,sys,time,subprocess,re,os
ROOT=pathlib.Path(__file__).resolve().parents[1]
import providers as h
from presenter import generate_presenter
from input_context import headline_fallback,readable_slug,resolved_input,permission_question

def validate(p):
 def s(v,n):
  if not isinstance(v,str) or not 1<=len(v)<=n:raise ValueError('Invalid text length')
  return v
 s(p['title'],70);s(p['opening'],180);s(p['scope'],180)
 if len(p['opening'].split())>15:raise ValueError('Presenter opening too long')
 if len(p['chat'])!=3 or len(p['scenes'])!=3 or len(p['questions'])!=2:raise ValueError('Invalid plan shape')
 for x in p['chat']:
  s(x,220)
  if re.search(r"(?:i[’']ll|i will|let[’']s|we[’']ll) (?:use|show|explain|explore|look|walk)|not independently verified|based on (?:your|the supplied) text|show the mechanism",x,re.I):raise ValueError('Chat contains process filler; replace with a concrete explanation')
 for q in p['questions']:
  s(q,150)
  if not q.endswith('?'):raise ValueError('Follow-up must be a question')
 for scene in p['scenes']:
  s(scene['title'],70);s(scene['narration'],500)
  if len(scene['steps'])!=3:raise ValueError('Need three diagram labels')
  for x in scene['steps']:s(x,40)
 narration=' '.join([p['opening']]+[x['narration'] for x in p['scenes']])
 if not 45<=len(narration.split())<=75:raise ValueError('Narration outside duration budget')
 return narration

def count_recent_videos(store,current):
 total=0
 for folder in store.iterdir():
  marker=folder/'voice-timing.json'
  if folder!=current and marker.exists():
   try:total+=time.time()-json.loads(marker.read_text())['submitted_epoch']<3600
   except (ValueError,KeyError):pass
 return total

def main(folder):
 h.OUT=pathlib.Path(folder);start=time.time();request=json.loads((h.OUT/'input.json').read_text())
 def status(stage,**data):
  target=h.OUT/'status.json';old=json.loads(target.read_text()) if target.exists() else {}
  old.pop('message',None);old.update(stage=stage,updated=time.time(),**data);tmp=target.with_suffix('.tmp');tmp.write_text(json.dumps(old));tmp.replace(target)
 try:
  if not h.key:raise RuntimeError('Set FAL_KEY in the server environment or private local config')
  status('planning')
  if re.fullmatch(r'https?://\S+',request['input'].strip()):
   topic=readable_slug(request['input'])
   message='I can’t read the full article here. Paste its text for an article-based explanation.'
   if topic:message+=' Or say “use the headline” for a general explanation of the topic in this link.'
   status('needs_text',message=message);return
  fallback=headline_fallback(request)
  raw=h.job('plan-v4','openrouter/router',{'model':'openai/gpt-6-luna','system_prompt':(ROOT/'backend/planner.txt').read_text(),'prompt':json.dumps({'input':resolved_input(request),'headline_only_topic':fallback,'previous':request.get('context'),'conversation':request.get('history',[]),'date':time.strftime('%Y-%m-%d')}),'temperature':0.2,'max_tokens':2500})
  if raw.get('error') or raw.get('partial'):raise ValueError('Script provider returned incomplete output')
  text=raw['output'].strip();text=re.sub(r'^```(?:json)?\s*|\s*```$','',text)
  plan=None
  try:
   plan=json.loads(text)
   if plan.get('route')=='clarify':
    message=plan.get('message')
    if not isinstance(message,str) or not 1<=len(message)<=500:raise ValueError('Invalid clarification')
    if permission_question(message):raise ValueError('Input already authorizes explanation')
    status('needs_text',message=message);return
   narration=validate(plan)
  except (ValueError,KeyError,TypeError):
   fixed=h.job('plan-repair-v4','openrouter/router',{'model':'openai/gpt-6-luna','system_prompt':(ROOT/'backend/planner.txt').read_text(),'prompt':'Original request: '+resolved_input(request)+'\nConversation: '+json.dumps(request.get('history',[]))+'\nThe user already requested a video. Do not ask permission. Repair this plan to EXACTLY THREE substantive chat messages (no process announcements, generic disclaimers, or padding), THREE scenes and 55-75 spoken words total. Keep the original topic, its central mechanism, one illustrative example, and a conditional market implication. Return JSON only: '+(json.dumps(plan) if plan else text),'temperature':0,'max_tokens':2500})
   plan=json.loads(re.sub(r'^```(?:json)?\s*|\s*```$','',fixed['output'].strip()));narration=validate(plan)
  if fallback:plan['scope']='Topic inferred from link · Full article not read'
  h.save('plan.json',plan)
  # Only actual media submissions consume the video allowance, not clarification turns.
  recent=count_recent_videos(h.OUT.parent,h.OUT)
  limit=int(os.environ.get('CATALYST_VIDEO_HOURLY_LIMIT','0'))
  if limit>0 and recent>=limit and not (h.OUT/'voice-request.json').exists():
   status('needs_text',plan=plan,message=f'Your explanation is ready, but the configured limit of {limit} video generations per hour has been reached. Please try again later.');return
  status('narrating',plan=plan)
  voice=h.job('voice','fal-ai/elevenlabs/tts/turbo-v2.5',{'text':narration,'voice':'Jessica','stability':0.5,'language_code':'en','timestamps':True})
  h.download(voice['audio']['url'],'narration.mp3')
  chunks=voice['timestamps'];letters=''.join(''.join(c['characters']) for c in chunks);starts=[v for c in chunks for v in c['character_start_times_seconds']];ends=[v for c in chunks for v in c['character_end_times_seconds']]
  cuts=[0];offset=len(plan['opening'])
  for scene in plan['scenes']:
   fold=lambda value:value.translate(str.maketrans({'’':"'",'‘':"'",'“':'\"','”':'\"','–':'-','—':'-'}))
   i=fold(letters).find(fold(scene['narration']),offset)
   if i<0:raise ValueError('Voice alignment does not match script')
   cuts.append(round(starts[i]*25)/25);offset=i+len(scene['narration'])
  cuts.append(round((ends[-1]+1)*25)/25)
  if not 0<cuts[1]<=8 or cuts[-1]>38:raise ValueError('Voice exceeds timing budget')
  h.save('cuts.json',cuts)
  graphics=subprocess.Popen(['node',str(ROOT/'backend/render.mjs'),str(h.OUT),'graphics'])
  has_presenter=not request.get('context')
  status('presenter' if has_presenter else 'rendering')
  try:
   if has_presenter:
    subprocess.run([h.ffmpeg,'-y','-loglevel','error','-i',str(h.OUT/'narration.mp3'),'-t',str(cuts[1]),'-ar','24000','-ac','1',str(h.OUT/'opening.wav')],check=True)
    if (h.OUT/'presenter-request.json').exists():
     # Resume an already submitted old-model job without spending on a second performance.
     result=h.job('presenter','veed/lipsync/v2',json.loads((h.OUT/'uploads.json').read_text()))
     h.download(result['video']['url'],'presenter.mp4')
    else:generate_presenter(h,ROOT,plan)
  finally:
   if graphics.wait()!=0:raise RuntimeError('Graphics render failed')
  status('rendering')
  subprocess.run(['node',str(ROOT/'backend/render.mjs'),str(h.OUT),'assemble'],check=True)
  status('ready',renderedOnly=not has_presenter,duration=cuts[-1],elapsed=round(time.time()-request['created'],1),file='/api/jobs/'+h.OUT.name+'/video.mp4')
 except Exception as e:
  # Detailed receipts remain private; never return provider exceptions/credentials to browser.
  (h.OUT/'error.txt').write_text((str(e).replace(h.key,'<redacted>') if h.key else str(e)))
  status('failed',message='The explainer could not finish. Your input and completed steps are saved; retry resumes them without resubmitting saved requests.')
if __name__=='__main__':main(sys.argv[1])
