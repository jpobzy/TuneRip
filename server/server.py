from flask import Flask, jsonify, make_response
from flask_cors import CORS
from app.controllers.controller import controller
from flask import send_from_directory, redirect
from flask import Flask, render_template, Response, stream_with_context, send_file
import os, time, json, queue
from flask import Flask, flash, request, redirect, url_for
# from werkzeug.utils import secure_filename
from pathlib import Path
from app.controllers.backgroundDataController import backgroundData
from app.controllers.cursorDataController import cursorData
from app.controllers.titleFilterController import titleFilterController
from datetime import datetime
from app.controllers.loggingController import logController
from app.controllers.prevUsedImagesController import prevUsedImagesController

basePath = Path.home() / 'Documents' / 'TuneRip'

UPLOAD_FOLDER = basePath / 'server/static/channelImages'
ALBUM_COVER_FOLDER = basePath / 'server/static/albumCovers'
DATABASE_FOLDER = basePath / 'server/database'



app = Flask(__name__)
CORS(app, origins='*')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALBUM_COVER_FOLDER'] = ALBUM_COVER_FOLDER
app.config['DATABASE_FOLDER'] = DATABASE_FOLDER


logger = logController()
controller_obj = controller(app.config['DATABASE_FOLDER'], logger)
backgrounddata_obj = backgroundData()
cursordata_obj = cursorData()
titleFilterObj = titleFilterController()
prevUsedObj = prevUsedImagesController(logger)



@app.route("/")
def hello_world():
    return "hello world"


@app.route("/channels", methods=['GET'])
def getChannels():
    """
    Sends channels from channels db 
    """
    return jsonify(controller_obj.db.channelCache)


@app.route('/getChannelImage/<string:route>', methods=['GET'])
def get_image(route):
    """
    Sends the requested image file
    """
    print(f'route: {route}')
    x = Path(Path.home() / 'Documents/TuneRip/server/static/channelImages' / route)
    if x.exists():
        print('hueawswdsa')
    return send_from_directory(app.config["UPLOAD_FOLDER"], f'{route}.jpg', mimetype='image/gif')


@app.route('/getAlbumCovers/<string:route>')
def getAlbumCover(route):
    """
    get request for album cover photos
    example: http://localhost:8080/getAlbumCovers/1
    """
    return send_from_directory(app.config["ALBUM_COVER_FOLDER"], f'{route}', mimetype='image/gif')


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


@app.route('/newChannel', methods=['POST'])
def createNewChannel():
    response, status = controller_obj.addNewChannel(json.loads(request.data))
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

@app.route('/getchannels')
def getData():
    """
    For filters
    """
    return jsonify(controller_obj.getData())


@app.route('/getrecordsfromchannel')
def getChannelData():
    return jsonify(controller_obj.getRecordsFromChannel(request.query_string))

@app.route('/deleteRecord', methods=['DELETE'])
def deleteRecord():
    return controller_obj.deleteRecord(json.loads(request.data))

@app.route('/deleteMultipleRecord', methods=['DELETE'])
def deleteMultipleRecords():
    return controller_obj.deleteMultipleRecords(json.loads(request.data))


@app.route('/deleteChannel', methods=['DELETE'])
def deleteChannel():
    return controller_obj.deleteChannel(json.loads(request.data))


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
    return controller_obj.updateMetaData(json.loads(request.data))

@app.get('/getbackgroundsettings')
def getBackgroundSettings():
    return jsonify(backgrounddata_obj.getBackgroundSettings())

@app.post('/savebackgroundsettings')
def saveBackgroundSettings():
    return backgrounddata_obj.saveBackgroundSettings(request)

@app.post('/resetbackgroundsettings')
def resetBackgroundSettings():
    return backgrounddata_obj.reset(request)

@app.get('/getcursorsettings')
def getCursorSettings():
    return jsonify(cursordata_obj.getCursorSettings())

@app.post('/savecursorsettings')
def saveCursorSettings():
    return cursordata_obj.saveCursorSettings(request)

@app.post('/resetcursorsettings')
def resetCursorSettings():
    return cursordata_obj.reset(request)

@app.post('/disablecurrentcursor')
def disableCurrentCursor():
    return cursordata_obj.disableCurrCursor()





@app.route('/stream')
def stream():
    def getData():
        count = 0
        while True:
            yield f"data: {datetime.now()}\n\n"
            time.sleep(1)  # prevent hammering the CPU
            count+=1
            if count == 5:
                break
    return Response(getData(), mimetype="text/event-stream")

@app.route('/downloadStream')
def streamDownload(): 
    return Response(controller_obj.downloadStream(dict(request.args)), mimetype="text/event-stream")


@app.route('/refactorpfp')
def refactorpfp():
    controller_obj.refactorpfp()
    return 'ok'

@app.post('/foldermerge')
def mergeStream():
    return controller_obj.folderMerge(json.loads(request.data))


@app.get('/filterWords')
def getFilterWords():
    return jsonify(titleFilterObj.getFilterSettings())

@app.delete('/deleteTitleFilter')
def deleteWord():
    return titleFilterObj.deleteTitleFilterFromData(json.loads(request.data))

@app.post('/addTitleFilter')
def addWord():
    
    return titleFilterObj.addTitleFilterData(json.loads(request.data).get('data'))

@app.put('/editTitleFilter')
def editTitleFilter():
    return titleFilterObj.editTitleFilter(json.loads(request.data).get('data'))


@app.post('/toggleShowPrevUsedImages')
def toggleShowPrevUsedImages():
    return prevUsedObj.toggleShowPrevUsed(json.loads(request.data))

@app.get('/getPrevUseStatus')
def getPrevUseStatus():
    return jsonify(prevUsedObj.getPrevUsedStatus())

@app.get('/getChannelAndArtCoverData')
def getChannelAndArtCoverData():
    data = controller_obj.returnAlbumCoverFileNames()
    data['prevUsedCoverArtInfo'] = prevUsedObj.getRecords()
    return jsonify(data)



if __name__ == "__main__":
    app.run(debug=False, port=8080, use_reloader=False, threaded=True)