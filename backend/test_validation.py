import unittest,json,pathlib
from worker import validate
class Plans(unittest.TestCase):
 def setUp(self):
  self.plan={'title':'Example','opening':'What does this change mean for a typical business?','scope':'Based on supplied text; not independently verified','chat':['One','Two','Three'],'questions':['What changes?','Who is affected?'],'scenes':[{'title':'A mechanism','steps':['One','Two','Three'],'narration':'This illustrative example explains a possible business effect, while recognizing that actual outcomes depend on circumstances.'} for _ in range(3)]}
 def test_valid(self):self.assertIn('illustrative',validate(self.plan))
 def test_long_script_rejected(self):
  for scene in self.plan['scenes']:scene['narration']='word '*26
  with self.assertRaises(ValueError):validate(self.plan)
 def test_no_canned_padding(self):
  self.plan['chat']=['One','Two']
  with self.assertRaises(ValueError):validate(self.plan)
  self.assertEqual(len(self.plan['chat']),2)
 def test_reject_process_filler(self):
  self.plan['chat'][2]='I’ll use an illustrative example to show the mechanism.'
  with self.assertRaises(ValueError):validate(self.plan)
 def test_bad_shape(self):
  self.plan['scenes']=[]
  with self.assertRaises(ValueError):validate(self.plan)
 def test_question(self):
  self.plan['questions'][0]='Not a question'
  with self.assertRaises(ValueError):validate(self.plan)
 def test_opening_bound(self):
  self.plan['opening']='word '*20
  with self.assertRaises(ValueError):validate(self.plan)
if __name__=='__main__':unittest.main()
