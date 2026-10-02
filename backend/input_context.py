"""Resolve an explicitly requested headline-only fallback without fetching a page."""
import re
from urllib.parse import urlsplit,unquote

def readable_slug(value):
 try:
  slug=unquote(urlsplit(value).path.rstrip('/').split('/')[-1]) if value.startswith(('http://','https://')) else value
 except ValueError:return None
 slug=re.sub(r'\.(html?|aspx)$','',slug,flags=re.I)
 slug=re.sub(r'-[a-f0-9]{8,}$','',slug,flags=re.I)
 words=slug.replace('-',' ').replace('_',' ').strip()
 return words if 4<=len(words.split())<=40 and len(words)<=250 and sum(c.isalpha() for c in words)>15 else None

def headline_fallback(request):
 current=request['input'].strip()
 explicit=bool(re.search(r'\b(use|just|only|explain|go with)\b.*\b(headline|title)\b|\b(headline|title)\s+only\b',current,re.I))
 slug_input='-' in current and ' ' not in current and not current.startswith(('http://','https://'))
 if not (explicit or slug_input):return None
 if slug_input:
  # Prefer the original complete link over a later accidentally truncated slug.
  for turn in reversed(request.get('history',[])):
   if turn.get('role')=='user':
    for url in re.findall(r'https?://\S+',turn.get('content','')):
     topic=readable_slug(url)
     if topic:return topic
  return readable_slug(current)
 for turn in reversed(request.get('history',[])):
  if turn.get('role')=='user':
   for url in re.findall(r'https?://\S+',turn.get('content','')):
    topic=readable_slug(url)
    if topic:return topic
 return None

def resolved_input(request):
 text=request['input'].strip()
 if re.fullmatch(r'(yes|yeah|yep|ok|okay|sure|please|go ahead|do it|continue)[.! ]*',text,re.I):
  for turn in reversed(request.get('history',[])):
   candidate=turn.get('content','').strip()
   if turn.get('role')=='user' and len(candidate.split())>=4:
    return 'Explain this topic with a video: '+candidate
 return text

def permission_question(message):
 return bool(re.search(r'\b(would you like|do you want|shall i|should i|may i)\b',message,re.I))
