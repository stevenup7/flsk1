from flask import Blueprint, request, render_template, flash, g, session, redirect, url_for
from functools import wraps
from utils import *

mod = Blueprint('users', __name__, url_prefix='/users')

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

@mod.route('/admin', methods=['GET'])
@login_required('SUPERUSER')
@templated('users/admin.html')
def userAdmin():
    return {"content": "ok"}

@mod.route('/admin/userlist', methods=['GET'])
@login_required('SUPERUSER')
def userList():
    users = cleanMongoList(g.db.users.find())
    return makeJSONResponse(users)


#login/logout code
@mod.route('/login', methods=['GET', 'POST'])
def login():
    print "login" 
    if request.method == 'POST':
        print "post"
        userQuery = {"username":        request.form['username'],
                     "passwordhashed": hashPass(request.form['password'])}
        u = g.db.users.find_one(userQuery)
        print u
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

def isLoggedIn():
    print "checking login"
    try:
        if session['username']:
            return session['levels']
        else:
            return False
    except:
        return False
