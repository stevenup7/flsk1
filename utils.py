import hashlib, uuid
from flask import make_response
from config import appConfig
import json

def makeJSONResponse(data):
    resp = make_response(json.dumps(data), 200)
    resp.mimetype = 'application/json'
    return resp

def hashPass(password):
    salt = appConfig["salt"]
    return hashlib.sha512(password + salt).hexdigest()

def createUser(collection, username, password):
    return False

