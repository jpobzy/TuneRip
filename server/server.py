from flask import Flask, jsonify, make_response
from flask_cors import CORS
from app.controllers.controller import controller
from flask import send_from_directory, redirect
from flask import Flask, render_template, Response, stream_with_context, send_file
import os, time, json, queue
from flask import Flask, flash, request, redirect, url_for
# from werkzeug.utils import secure_filename
from pathlib import Path

basePath = Path.home() / 'Documents' / 'TuneRip'

UPLOAD_FOLDER = basePath / 'server/static/images'
ALBUM_COVER_FOLDER = basePath / 'server/static/albumCovers'
DATABASE_FOLDER = basePath / 'server/database'



app = Flask(__name__)
CORS(app, origins='*')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALBUM_COVER_FOLDER'] = ALBUM_COVER_FOLDER
app.config['DATABASE_FOLDER'] = DATABASE_FOLDER
# path_env = 'MUSIC_PATH'

controller_obj = controller(app.config['DATABASE_FOLDER'])

@app.route("/")
def hello_world():
    print('root')
    return "hello world"


@app.route("/users", methods=['GET'])
def getUsers():
    """
    Sends users from users db 
    """
    return jsonify(controller_obj.db.userCache)


@app.route('/getImage/<string:route>', methods=['GET'])
def get_image(route):
    """
    Sends the requested image file
    """
    return send_from_directory(app.config["UPLOAD_FOLDER"], f'{route}.jpg', mimetype='image/gif')


@app.route('/getAlbumCovers/<string:route>.jpg')
def getAlbumCover(route):
    """
    get request for album cover photos
    example: http://localhost:8080/getAlbumCovers/1
    """
    return send_from_directory(app.config["ALBUM_COVER_FOLDER"], f'{route}.jpg', mimetype='image/gif')


@app.route('/download/')
def download():
    """
    downloads users choice of given user or individial video or playlist
    """
    response, statusCode = controller_obj.downloadVideos(request)
    return make_response(response, statusCode)


@app.route('/uploadImg', methods=['POST'])
def downloadImg():
    if request.method == 'POST':
        data = controller_obj.downloadImg(request.files['file'])
        return make_response(jsonify(data), 201)
    

@app.route('/uploadTxt', methods=['POST'])
def downloadTxt():
    if request.method == 'POST':
        data = controller_obj.downloadTxt(request.files['file'], 'downloaded')
        return make_response(jsonify(data), 201)
    

@app.route('/getAlbumCoverFileNames')
def getAlbumCoverFileNames():
    return jsonify(controller_obj.returnAlbumCoverFileNames())


@app.route('/newUser', methods=['POST'])
def createNewUser():
    response, status = controller_obj.addNewUser(json.loads(request.data))
    return make_response(jsonify({ 'message': response}), status) 


@app.route('/newVideo', methods=['POST'])
def addNewVideo():
    response, status = controller_obj.addNewUser(json.loads(request.data))
    return make_response(jsonify({ 'message': response}), status) 



@app.route('/reload')
def reloadCache():
    response, status = controller_obj.reloadCache()
    return  jsonify(response)


@app.route('/history')
def history():
    historyList, status = controller_obj.getHistory()
    return jsonify(historyList)


@app.route('/downloadCount')
def getDownloadCount():
    return jsonify(controller_obj.getDownloadCount())


@app.route('/filter', methods=['POST'])
def filter():
    # return  {'message': "error cant find track due to"}, 207
    if request.method == 'POST':
        response, statusCode  = controller_obj.addTracksToFilter(request)
    return response, statusCode



@app.route('/getData')
def getInitialRecords():
    """
    For records, query should have "limit" and "page" keys
    """
    return jsonify(controller_obj.getRecords(request.query_string))

@app.route('/getusers')
def getData():
    """
    For filters
    """
    return jsonify(controller_obj.getData())


@app.route('/getrecordsfromuser')
def getUserData():
    return jsonify(controller_obj.getRecordsFromUser(request.query_string))

@app.route('/deleteRecord', methods=['DELETE'])
def deleteRecord():
    return controller_obj.deleteRecord(json.loads(request.data))

@app.route('/deleteMultipleRecord', methods=['DELETE'])
def deleteMultipleRecords():
    return controller_obj.deleteMultipleRecords(json.loads(request.data))


@app.route('/deleteUser', methods=['DELETE'])
def deleteUser():
    return controller_obj.deleteUser(json.loads(request.data))


@app.route('/deleteimg', methods=['DELETE'])
def deleteImg():
    return controller_obj.deleteImg(json.loads(request.data))


@app.route('/killserver')
def killswitch():
    pid = os.getpid()
    os.kill(pid, 9)
    return

@app.route('/croppreview', methods=['POST'])
def croppreview():
    if request.method == 'POST':
        file = request.files['imageFile']
        return controller_obj.croppreview(file, json.loads(request.values.get('cropData')).get('croppedAreaPixels'))

@app.route('/crop', methods=['POST'])
def crop():
    if request.method == 'POST':
        file = request.files['imageFile']
        return controller_obj.crop(file, json.loads(request.values.get('cropData')).get('croppedAreaPixels'))


@app.get("/getalbumtitles")
def getAlbumTitles():
    """
    Sends all album titles from tracks db 
    """
    return jsonify(controller_obj.getAlbumTitles())


@app.get('/getexistingplaylists')
def getExistingPlaylists():
    """
    Returns a list of dicts for the existing playlists
    format:  { value: 'jack', label: 'Jack' },
    """
    return jsonify(controller_obj.getPlaylistDirNames())

@app.get('/getallfoldernamesindownloads')
def getAllFolderNamesInDownloads():
    """
    Returns a list of dicts for ALL the names of folders in downloads
    format:  { value: 'jack', label: 'Jack' },
    """
    return jsonify(controller_obj.getAllFolderNamesInDownloads())


@app.post('/refactor')
def refactor():
    """
    Go through each track in the given playlist and confirm the track number is correct
    """
    return controller_obj.refactorPlaylist(json.loads(request.data))

@app.get('/getplaylistdata')
def getPlaylistData():
    return jsonify(controller_obj.getPlaylistData(request))


@app.put('/updatemetadata')
def updateMetaData():
    controller_obj.updateMetaData(json.loads(request.data))
    return 'ok'


# @app.get('/audio')
# def get_audio():

#     if not Path('./hi.wav').exists():
#         return "file not found", 404
    
#     return send_file('./hi.wav', mimetype='audio/mpeg')


if __name__ == "__main__":
    app.run(debug=False, port=8080, use_reloader=False, threaded=True)
