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

    def login(self, username, password):
        return self.app.post('/users/login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.app.get('/users/logout', 
        	follow_redirects=True)

    def test_home_exists(self):
    	rv = self.app.get('/')
    	assert rv.status_code == 200

    def test_tzonehome_exists(self):
    	rv = self.app.get('/tzone/home')
    	assert rv.status_code == 200

    def test_failed_login(self):
    	rv = self.login('testUser', 'badPassword')
    	assert 'Invalid username or password' in rv.data 

    def test_login_and_logout(self):
        rv = self.login('testUser', 'test')
        assert 'Invalid username or password' not in rv.data
        rv = self.logout()
        assert 'Logout successful' in rv.data

    def test_user_list(self):
    	rv = self.login('testUser', 'test')
    	rv = self.app.get('/users/admin', 
            follow_redirects=True)
        assert 'User List' in rv.data




if __name__ == '__main__':
    unittest.main()