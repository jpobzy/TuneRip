from flask import Flask, jsonify, make_response
from flask_cors import CORS
from app.controllers.controller import controller
from flask import send_from_directory 

import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './static/images'
ALBUM_COVER_FOLDER = './static/albumCovers'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}



app = Flask(__name__)
CORS(app, origins='*')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALBUM_COVER_FOLDER'] = ALBUM_COVER_FOLDER

path_env = 'MUSIC_PATH'
controller_obj = controller(path_env)



@app.route("/")
def hello_world():
    return "hello world"


@app.route("/users")
def getUsers():
    cache = controller_obj.db.cache 
    return jsonify(cache)


@app.route('/getImage/<string:route>')
def get_image(route):
    """
    get request for user pfp images
    """
    return send_from_directory(app.config["UPLOAD_FOLDER"], f'{route}.jpg', mimetype='image/gif')


@app.route('/getAlbumCovers/<string:route>.jpg')
def getAlbumCover(route):
    """
    get request for album cover photos
    example: http://localhost:8080/getAlbumCovers/1
    """
    return send_from_directory(app.config["ALBUM_COVER_FOLDER"], f'{route}.jpg', mimetype='image/gif')


@app.route('/download/<string:user>/<string:albumcoverfilename>')
def downloadUser(user, albumcoverfilename):
    print(f'downloding for user {user}, with album cover {albumcoverfilename}')
    controller_obj.downloadVideos(user, albumcoverfilename)
    
    return {'Success': True}


@app.route('/uploadImg', methods=['POST'])
def downloadImg():
    if request.method == 'POST':
        data = controller_obj.downloadImg(request.files['file'])
        return make_response(jsonify(data), 201)
    
@app.route('/getAlbumCoverFileNames')
def getAlbumCoverFileNames():
    return jsonify(controller_obj.returnAlbumCoverFileNames())






if __name__ == "__main__":
    app.run(debug=False, port=8080, use_reloader=False)
