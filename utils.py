import hashlib, uuid
from flask import request, make_response, session
from config import appConfig
import json
from bson.objectid import ObjectId


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

def makeJSONResponse(data):
    resp = make_response(json.dumps(data), 200)
    resp.mimetype = 'application/json'
    return resp

def hashPass(password):
    salt = appConfig["salt"]
    return hashlib.sha512(password + salt).hexdigest()

def createDocument(db, json):
    oid = db.insert(json)
    entry = db.find_one({'_id': ObjectId(oid)})
    entry['id'] = str(entry['_id'])
    entry['uid'] = session['uid']
    del entry['_id']
    return makeJSONResponse(entry)

def updateDocumnet(db, entryid, json):
    json['uid'] = session['uid']
    db.update({'_id': ObjectId(entryid)}, {'$set': json})
    return makeJSONResponse({"message": "done"})

def deleteDocument(db, entryid):
    entry = db.remove({'_id': ObjectId(entryid)})
    return makeJSONResponse({"message": "done"})

