from flask import Flask, jsonify, make_response
from flask_cors import CORS
from app.controllers.controller import controller
from flask import send_from_directory, redirect
from flask import Flask, render_template, Response, stream_with_context
import os, time, json, queue
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

controller_obj = controller()

@app.route("/")
def hello_world():
    return "hello world"


@app.route("/users", methods=['GET'])
def getUsers():
    """
    Sends users from users db 
    """
    cache = controller_obj.db.cache 
    return jsonify(cache)


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

@app.route('/downloadProgress')
def sse():
    print('download progress was req')
    def event_stream():
        print('hello world')
        while True:
            try:
                data = controller_obj.queue.get_nowait()
                print(f'new data is {data}')
                time.sleep(1)
                yield f'data: Downloaded {data} \n\n'
            except queue.Empty:
                # print('keeping connection alive')
                time.sleep(1)
                data = None
                yield ": keep-alive\n\n"
            except Exception as e:
                print("Caught other exception:", e)
                data = None
    return Response(stream_with_context(event_stream()), content_type='text/event-stream')



@app.route('/reload')
def reloadCache():
    response, status = controller_obj.reloadCache()
    return  jsonify(response)

@app.route('/history')
def history():
    historyList, status = controller_obj.getHistory()
    return jsonify(historyList)

if __name__ == "__main__":
    app.run(debug=False, port=8080, use_reloader=False, threaded=True)
