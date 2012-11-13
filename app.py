from flask import Flask
from flask import render_template, redirect, request, make_response, session, url_for
from bson.objectid import ObjectId
from utils import *
from config import *

app = Flask(__name__)
app.debug = True
# set the secret key.  keep this really secret:
app.secret_key = appConfig['secret_key']

# init and teardown stuff 
@app.before_request
def before_request():
    app.db, app.friends = getConnection()

@app.teardown_request
def teardown_request(exception):
    dropConnection()

@app.route('/login', methods=['GET', 'POST'])
def login():
    print "login" 
    if request.method == 'POST':
        print "post"
        userQuery = {"username":        request.form['username'],
                     "passwordhashed": hashPass(request.form['password'])}
        u = app.db.users.find_one(userQuery)
        print u
        if u == None:
            session.pop('username', None)
            return redirect(url_for('login') + "?failed=true")
        else:
            session['username'] = request.form['username']
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/')
def index():
    name = "bob"
    return render_template('1col.html', name=name, content_heading='test', content_body='<p>hi</p>')

@app.route('/data/tzone/', methods=['GET'])
def getAllTzone():
    data = []
    for f in app.friends.find():
        f["id"] = str(f["_id"])
        del f["_id"]
        data.append(f)
    return makeJSONResponse(data)

@app.route('/data/tzone/', methods=['POST'])
def createTZoneEntry():
    data = request.json
    oid = app.friends.insert(data)
    tz = app.friends.find_one({'_id': ObjectId(oid)})
    tz['id'] = str(tz['_id'])
    del tz['_id']
    return makeJSONResponse(tz)
    
@app.route('/data/tzone/<entryid>', methods=['PUT'])
def updateTZoneEntry(entryid):
    app.friends.update({'_id': ObjectId(entryid)}, {'$set': request.json})
    return makeJSONResponse({"message": "done"})

@app.route('/data/tzone/<entryid>', methods=['DELETE'])
def deleteZoneEntry(entryid):
    print (entryid)
    f = app.friends.remove({'_id': ObjectId(entryid)})
    resp = make_response(json.dumps({"message": "done"}), 200)
    resp.mimetype = 'application/json'
    return resp

@app.route('/data/tzone/<int:entryid>', methods=['GET', 'POST'])
def tzone(entryid=None):
    print entryid 
    if entryid == None:
        print request.json, type(request.json)
        i = request.json
        print i
        id = app.friends.insert(i)
        return makeJSONResponse({"id": str(id)})
    else:
        return "tzone"

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)



