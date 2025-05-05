from flask import Flask, jsonify
from download import download_video
from controllers.controller import controller
from flask_cors import CORS

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


@app.route("/youtubers")
def getYoutubers():
    return jsonify(controller_obj.getUserInfo())


if __name__ == "__main__":
    app.run(debug=True, port=8080)
