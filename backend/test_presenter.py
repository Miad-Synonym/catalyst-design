import unittest
from presenter import presenter_input,ENDPOINT
class Presenter(unittest.TestCase):
 def test_uses_still_not_stock_clip(self):
  payload=presenter_input({'title':'Retail','opening':'Why can sales mislead?'},'https://example.com/identity.png','https://example.com/speech.wav')
  self.assertEqual(set(payload),{'image_url','audio_url','resolution'})
  self.assertEqual(payload['resolution'],'480p')
  self.assertEqual(ENDPOINT,'veed/fabric-1.0/fast')
 def test_requires_real_inputs(self):
  with self.assertRaises(ValueError):presenter_input({},'', 'audio')
  with self.assertRaises(ValueError):presenter_input({},'image','')
if __name__=='__main__':unittest.main()
