import tempfile,pathlib,json,time,unittest
from worker import count_recent_videos
class Quota(unittest.TestCase):
 def test_clarifications_are_not_videos(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d)
   for i in range(8):
    p=root/str(i);p.mkdir();(p/'input.json').write_text(json.dumps({'created':time.time()}));(p/'status.json').write_text('{"stage":"needs_text"}')
   self.assertEqual(count_recent_videos(root,root/'new'),0)
   (root/'0'/'voice-timing.json').write_text(json.dumps({'submitted_epoch':time.time()}))
   self.assertEqual(count_recent_videos(root,root/'new'),1)
   self.assertEqual(count_recent_videos(root,root/'0'),0)
if __name__=='__main__':unittest.main()
