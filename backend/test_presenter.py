import unittest
from presenter import presenter_input,ENDPOINT
class Presenter(unittest.TestCase):
 def test_uses_still_not_stock_clip(self):
  payload=presenter_input({'title':'Retail','opening':'Why can higher sales hide weaker profits?'},'https://example.com/identity.png','https://example.com/speech.wav')
  self.assertIn('image_url',payload);self.assertNotIn('video_url',payload)
  self.assertEqual(ENDPOINT,'fal-ai/creatify/aurora')
 def test_script_changes_performance_direction(self):
  a=presenter_input({'title':'Retail','opening':'Why are sales rising?'},'image','audio')
  b=presenter_input({'title':'Rates','opening':'What happens when borrowing costs rise?'},'image','audio')
  self.assertNotEqual(a['prompt'],b['prompt']);self.assertIn('borrowing',b['prompt'])
if __name__=='__main__':unittest.main()
