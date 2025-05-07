from flask import Flask, jsonify
from flask_cors import CORS
from app.controllers.controller import controller


app = Flask(__name__)
CORS(app, origins='*')

path_env = 'MUSIC_PATH'
controller_obj = controller(path_env)



@app.route("/")
def hello_world():
    return "hello world"

@app.route("/test")
def test():
    return {'hello': "world"}


@app.route("/users")
def getUsers():
    data = [controller_obj.db.cache[0]]
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=False, port=8080, use_reloader=True)
