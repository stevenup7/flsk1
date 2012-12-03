from flask import Flask 
from flask import render_template, redirect, request, make_response, session, url_for, flash, g
from bson.objectid import ObjectId
from utils import *
from config import *
from users.views import login_required

app = Flask(__name__)
app.debug = True
# set the secret key.  keep this really secret:
app.secret_key = appConfig['secret_key']

from users.views import mod as usersModule
app.register_blueprint(usersModule)

# init and teardown stuff 
@app.before_request
def before_request():
    g.db, g.friends = getConnection()

@app.teardown_request
def teardown_request(exception):
    dropConnection()

# home page 
@app.route('/')
def index():
    name = "bob"
    return render_template('tzoneui.html', name=name, content_heading='Timezone Helper', content_body='')

#get 
@app.route('/data/tzone/', methods=['GET'])
@app.route('/data/tzone/<entryid>', methods=['GET'])
@login_required
def tzone(entryid=None):
    if entryid == None:
        data = []
        for f in g.friends.find():
            f["id"] = str(f["_id"])
            del f["_id"]
            data.append(f)
        return makeJSONResponse(data)
    else:
        f = g.friends.find_one({'_id': ObjectId(entryid)})
        f["id"] = str(f["_id"])
        del f["_id"]
        print f
        return makeJSONResponse(f)

# create
@app.route('/data/tzone/', methods=['POST'])
@login_required
def createTZoneEntry():
    data = request.json
    oid = g.friends.insert(data)
    tz = g.friends.find_one({'_id': ObjectId(oid)})
    tz['id'] = str(tz['_id'])
    del tz['_id']
    return makeJSONResponse(tz)
    
# update 
@app.route('/data/tzone/<entryid>', methods=['PUT'])
@login_required
def updateTZoneEntry(entryid):
    g.friends.update({'_id': ObjectId(entryid)}, {'$set': request.json})
    return makeJSONResponse({"message": "done"})

# delete
@app.route('/data/tzone/<entryid>', methods=['DELETE'])
@login_required
def deleteZoneEntry(entryid):
    print (entryid)
    f = g.friends.remove({'_id': ObjectId(entryid)})
    resp = make_response(json.dumps({"message": "done"}), 200)
    resp.mimetype = 'application/json'
    return resp

# create the server if running from the command line 
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)



