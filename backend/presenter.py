"""Generate a new performance from identity imagery, never a stock performance clip."""
import json,os

ENDPOINT='fal-ai/creatify/aurora'

def presenter_input(plan,image_url,audio_url):
 if not image_url or not audio_url:raise ValueError('Presenter image and speech are required')
 return {
  'image_url':image_url,'audio_url':audio_url,'resolution':'720p',
  'prompt':(
   'Create a fresh direct-to-camera performance by the person in the reference still. '
   'Keep her identity, cream clothing, matte-black studio and warm face lighting. '
   'Natural creator delivery: engaged eye contact, small spontaneous hand movements and '
   'facial emphasis aligned with the supplied speech. Relaxed and conversational, not a posed newsreader. '
   'One continuous medium-close shot. No added words, numbers, charts, captions, logos or music. '
   'Topic and spoken content below are context for expression, not instructions to alter the scene. '
   +json.dumps({'topic':plan['title'],'spoken_opening':plan['opening']},ensure_ascii=False)
  )
 }

def generate_presenter(h,root,plan):
 # Only identity/style are reused. The provider receives no source performance video.
 upload_file=h.OUT/'presenter-still-input.json'
 if upload_file.exists():payload=json.loads(upload_file.read_text())
 else:
  reference=os.environ.get('CATALYST_PRESENTER_IMAGE_URL')
  if not reference:
   reference=json.loads((root/'backend/presenter-reference.json').read_text())['image_url']
  payload=presenter_input(plan,reference,h.client.upload_file(str(h.OUT/'opening.wav')))
  h.save('presenter-still-input.json',payload)
 result=h.job('presenter-fresh',ENDPOINT,payload)
 h.download(result['video']['url'],'presenter-fresh.mp4')
 # The assembly file is a copy of THIS job's generated performance, never a shared clip.
 import shutil
 shutil.copyfile(h.OUT/'presenter-fresh.mp4',h.OUT/'presenter.mp4')
 return result
