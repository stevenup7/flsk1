from flask import Flask 
from flask import render_template, redirect, request, make_response, session, url_for, flash, g
from utils import *
from config import *

app = Flask(__name__)
app.debug = True
# set the secret key.  keep this really secret:
app.secret_key = appConfig['secret_key']

# register the modules 
# user module allows login and other user functions
from users.views import mod as usersModule
app.register_blueprint(usersModule)

# tzone module - timezone stuff
from tzone.views import mod as tzoneModule
app.register_blueprint(tzoneModule)

# init and teardown stuff 
@app.before_request
def before_request():
    g.db  = getConnection()

@app.teardown_request
def teardown_request(exception):
    dropConnection()

# home page 
@app.route('/')
def index():
    # todo: add real content
    name = "bob"
    return render_template('tzoneui.html', name=name, content_heading='Timezone Helper', content_body='')

# create the server if running from the command line 
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)



