from flask import Blueprint, request, render_template, flash, g, session, redirect, url_for
from functools import wraps
from utils import *

from users.views import login_required

mod = Blueprint('tzone', __name__, url_prefix='/tzone')


@mod.route('/home', methods=['GET'])
@templated("tzone/home.html")
def home():
    return {"content" : "home", "content_body" : "body "}

#get 
@mod.route('/', methods=['GET'])
@mod.route('/<entryid>', methods=['GET'])
@login_required()
def tzone(entryid=None):
    if entryid == None:
        data = []
        for f in g.db.friends.find():
            f["id"] = str(f["_id"])
            del f["_id"]
            data.append(f)
        return makeJSONResponse(data)
    else:
        f = g.db.friends.find_one({'_id': ObjectId(entryid)})
        f["id"] = str(f["_id"])
        del f["_id"]
        print f
        return makeJSONResponse(f)

# create
@mod.route('/', methods=['POST'])
@login_required()
def createTZoneEntry():
    return createDocument(g.db.friends, request.json)
    
# update 
@mod.route('/<entryid>', methods=['PUT'])
@login_required()
def updateTZoneEntry(entryid):
    return updateDocumnet(g.db.friends, entryid, request.json)

# delete
@mod.route('/<entryid>', methods=['DELETE'])
@login_required()
def deleteZoneEntry(entryid):
    return deleteDocument(g.db.friends, entryid)
