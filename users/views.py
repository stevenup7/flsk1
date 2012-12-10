from flask import Blueprint, request, render_template, flash, g, session, redirect, url_for
from functools import wraps
from utils import *

mod = Blueprint('users', __name__, url_prefix='/users')

# check the session to see if they are logged in 
def isLoggedIn():
    try:
        if session['username']:
            return session['levels']
        else:
            return False
    except:
        return False

# grab all of the details for the current user
def getCurrentUser():
    user = getOneByID(g.db.users, session['uid'])
    return user

# decorator for login levels 
def login_required(level=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            levels = isLoggedIn()
            if not levels:
                return redirect(url_for('users.login', next=request.url))
            else:
                if level == None or level in levels:
                    return f(*args, **kwargs)
                else:
                    return redirect(url_for('users.login', next=request.url))
        return decorated_function
    return decorator

#todo make a json login required decoator which returns {"status" :  "login-required" }


@mod.route('/admin', methods=['GET'])
@login_required('SUPERUSER')
@templated('users/admin.html')
def userAdmin():
    return {"content": "ok"}

@mod.route('/admin/changepass', methods=['GET'])
@login_required()
@templated('users/changepass.html')
def changePassword():
    return getCurrentUser()

def hashifyPassword(json):
    json["passwordhashed"] = hashPass(json["password"])
    del json["password"]

@mod.route('/admin/data', methods=['GET'])
@login_required('SUPERUSER')
def userList():
    users = cleanMongoList(g.db.users.find())
    return makeJSONResponse(users)

# create
@mod.route('/admin/data', methods=['POST'])
@login_required('SUPERUSER')
def createUser():
    json = request.json
    hashifyPassword(json)
    return createDocument(g.db.users, json)


# update 
@mod.route('/admin/data/<entryid>', methods=['PUT'])
@login_required('SUPERUSER')
def updateUser(entryid):
    json = request.json
    if json["password"] == "": 
        del json["password"]
    else:
        hashifyPassword(json)
    return updateDocumnet(g.db.users, entryid, request.json)

# delete
@mod.route('/admin/data/<entryid>', methods=['DELETE'])
@login_required('SUPERUSER')
def deleteUser(entryid):
    return deleteDocument(g.db.users, entryid)

#login/logout code
@mod.route('/login', methods=['GET', 'POST'])
def login():
    print "login" 
    if request.method == 'POST':
        userQuery = {"username":        request.form['username'],
                     "passwordhashed": hashPass(request.form['password'])}
        u = g.db.users.find_one(userQuery)
        if u == None:
            session.pop('username', None)
            flash(u'Invalid username or password', 'alert-error')
            return redirect(url_for('users.login') + "?failed=true")
        else:
            flash(u'Login successful', 'alert-info')
            session['username'] = request.form['username']
            session['uid'] = str(u['_id'])
            session['levels'] = u['levels']
            return redirect(url_for('index'))
    return render_template('users/login.html')

@mod.route('/logout')
def logout():
    flash(u'Logout successful', 'alert-info')
    # remove the username from the session if it's there
    session.pop('username', None)
    return redirect(url_for('index'))

