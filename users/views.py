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

@mod.route('/create_account', methods=['GET'])
@templated('users/create_account.html')
def createUserForm():
    # TODO: replace with user
    email = request.args.get("email")
    if email == None:
        email = ""
    return {"email": email}

@mod.route('/create_account', methods=['POST'])
@templated('users/new_account.html')
def createNewUser():
    email = request.form['email']
    password = request.form['password']
    confirm_password = request.form['confirm_password']
    if password != confirm_password:
        flash(u'Passwords dont match', 'alert-error')
        return redirect(url_for('users.createUserForm',email=email))
    else:
        userQuery = {"username":  request.form['email']}
        u = g.db.users.find_one(userQuery)
        if u == None:
            g.db.users.insert({"username": email, "passwordhashed": hashPass(password), levels: ["USER"]})
            
            # we are all good 
            pass
        else:
            flash(u'This email address is already in use', 'alert-error')
            return redirect(url_for('users.login'))
    print email, password, confirm_password
    #hashifyPassword(json)
    #return createDocument(g.db.users, json)


def isUserNameAvalable():
    json = request.json
    print json

#TODO make a json login required decoator which returns {"status" :  "login-required" }
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
        flash(u'No Pass', 'alert-error')
        del json["password"]
    else:
        flash(u'Hashed Pass', 'alert-info')
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
    session.pop('levels', None)
    session.pop('uid', None)
    return redirect(url_for('index'))

@mod.route('/install')
def install():
    users = g.db.users.find()
    print users.count()
    if users.count() == 0: 
        newUser = {
            "username": "admin",
            "levels": ["SUPERUSER"],
            "passwordhashed": hashPass('admin')            
            }
        createDocument(g.db.users, newUser)       
        return "created admin/admin"
    else:
        return "users already"


