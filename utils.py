import hashlib, uuid
from flask import request, make_response, session, render_template
from config import appConfig
import json
from bson.objectid import ObjectId
from functools import wraps

# templated decorator wrap it around a function to put a template on it.
def templated(template=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            template_name = template
            if template_name is None:
                template_name = request.endpoint.replace('.', '/') + '.html'
            ctx = f(*args, **kwargs)
            if ctx is None:
                ctx = {}
            elif not isinstance(ctx, dict):
                return ctx
            return render_template(template_name, **ctx)
        return decorated_function
    return decorator

def getOneByID(db, oid):
    return db.find_one({'_id': ObjectId(oid)})

# switches the mongo _id and switch it for a id attribute for backbock
def cleanMongoList(cursor):
    data = []
    for i in cursor:
        i[u'id'] = str(i[u'_id'])
        del i[u'_id']
        data.append(i)
    return data

# make a JSON response object 
def makeJSONResponse(data):
    resp = make_response(json.dumps(data), 200)
    resp.mimetype = 'application/json'
    return resp

# hash a cleartext password 
def hashPass(password):
    salt = appConfig["salt"]
    return hashlib.sha512(password + salt).hexdigest()

# creates a mongo document 
def createMongoDocument(db, json):
    oid = db.insert(json)
    entry = db.find_one({'_id': ObjectId(oid)})
    entry['id'] = str(entry['_id'])
    return entry

# some generic wrapper functions to get json into mongo CrUD
def createDocument(db, json):
    entry = createMongoDocument(db, json);
    # if a logged in user then put the uid in (owner of the docuemnt)
    if "uid" in session: 
        entry['uid'] = session['uid']
    del entry['_id']
    return makeJSONResponse(entry)

def updateDocumnet(db, entryid, json):
    print json
    json['uid'] = session['uid']
    db.update({'_id': ObjectId(entryid)}, {'$set': json})
    entry = db.find_one({'_id': ObjectId(entryid)})
    entry['id'] = str(entry['_id'])
    # if a logged in user then put the uid in (owner of the docuemnt)
    if "uid" in session: 
        entry['uid'] = session['uid']
    del entry['_id']
    return makeJSONResponse(entry)

def deleteMongoDocument(db, entryid):
    entry = db.remove({'_id': ObjectId(entryid)})
    return entry

def deleteDocument(db, entryid):
    entry = deleteMongoDocument(db, entryid)
    return makeJSONResponse({"message": "done"})

