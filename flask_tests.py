import os
import app
import unittest
import tempfile
from flask import g
from utils import *
import functools
from config import getConnection

class tzoneTestCase(unittest.TestCase):


    def setUp(self):
        self.app = app.app.test_client()
        db = getConnection()
        newUser = {
            "username": "testUser",
            "levels": ["SUPERUSER"],
            "passwordhashed": hashPass('test')        
            }
        self.entry = createMongoDocument(db.users, newUser)  

    def tearDown(self):
    	db = getConnection()
        deleteMongoDocument(db.users, self.entry['id'])

    def test_home_exists(self):
    	rv = self.app.get('/')
    	#print dir(rv)
    	assert rv.status_code == 200

    def test_tzonehome_exists(self):
    	rv = self.app.get('/tzone/home')
    	assert rv.status_code == 200

if __name__ == '__main__':
    unittest.main()