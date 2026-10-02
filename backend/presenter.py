"""Fresh short presenter motion, with durable resume of older requests."""
import json,os,shutil
ENDPOINT='veed/fabric-1.0/fast'
MAX_PRESENTER_SECONDS=3.0

def presenter_input(plan,image_url,audio_url):
 if not image_url or not audio_url:raise ValueError('Presenter image and speech are required')
 return {'image_url':image_url,'audio_url':audio_url,'resolution':'480p'}

def generate_presenter(h,root,plan):
 # A submitted Aurora job must resume its original endpoint, never silently resubmit.
 old=h.OUT/'presenter-fresh-request.json'
 if old.exists() and not (h.OUT/'presenter-fast-request.json').exists():
  request=json.loads(old.read_text())
  payload=json.loads((h.OUT/'presenter-still-input.json').read_text())
  result=h.job('presenter-fresh',request['endpoint'],payload)
  h.download(result['video']['url'],'presenter-fresh.mp4')
  shutil.copyfile(h.OUT/'presenter-fresh.mp4',h.OUT/'presenter.mp4')
  return result
 upload_file=h.OUT/'presenter-fast-upload.json'
 if upload_file.exists():payload=json.loads(upload_file.read_text())
 else:
  reference=os.environ.get('CATALYST_PRESENTER_IMAGE_URL')
  if not reference:
   reference=json.loads((root/'backend/presenter-reference.json').read_text())['image_url']
  payload=presenter_input(plan,reference,h.client.upload_file(str(h.OUT/'opening.wav')))
  h.save('presenter-fast-upload.json',payload)
 result=h.job('presenter-fast',ENDPOINT,payload)
 h.download(result['video']['url'],'presenter-fast.mp4')
 shutil.copyfile(h.OUT/'presenter-fast.mp4',h.OUT/'presenter.mp4')
 return result
