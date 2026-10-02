import unittest
from input_context import headline_fallback,readable_slug,resolved_input,permission_question
URL='https://www.wsj.com/cio-journal/why-companies-are-unlikely-to-hit-pause-on-ai-9a4f6818'
class Context(unittest.TestCase):
 def test_accepts_headline(self):
  for text in ['use the headline','just use the headline','hy-companies-are-unlikely-to-hit-pause-on-ai']:
   self.assertEqual(headline_fallback({'input':text,'history':[{'role':'user','content':URL}]}),'why companies are unlikely to hit pause on ai')
 def test_acceptance_uses_topic(self):
  self.assertIn('Canada',resolved_input({'input':'yes','history':[{'role':'user','content':'EU proposes closer ties with Canada'},{'role':'assistant','content':'Would you like an explanation?'}]}))
  self.assertTrue(permission_question('Would you like a general explanation?'))
  self.assertFalse(permission_question('Which company do you mean?'))
 def test_opaque_link(self):self.assertIsNone(readable_slug('https://example.com/12345'))
 def test_no_implicit_acceptance(self):self.assertIsNone(headline_fallback({'input':URL}))
if __name__=='__main__':unittest.main()
