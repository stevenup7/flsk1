import os
import app
import unittest
import tempfile

class tzoneTestCase(unittest.TestCase):

    def setUp(self):
        # self.db_fd, app.app.config['DATABASE'] = tempfile.mkstemp()
        # app.app.config['TESTING'] = True
        self.app = app.app.test_client()
        # app.init_db()

    def tearDown(self):
        # os.close(self.db_fd)
        # os.unlink(app.app.config['DATABASE'])
        pass

    def test_home_exists(self):
    	rv = self.app.get('/')
    	#print dir(rv)
    	assert rv.status_code == 200

    def test_tzonehome_exists(self):
    	rv = self.app.get('/tzone/home')
    	assert rv.status_code == 200

if __name__ == '__main__':
    unittest.main()