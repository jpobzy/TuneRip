from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse

class backgroundData():
    data = """
    {
        "selectedBackground" : "aurora",
        "Backgrounds" : {
            "aurora" : {
                "blend" : 0.5,
                "amplitude" : 1.0,
                "speed" : 0.5,
                "colorStops" : ["#3A29FF", "#FF94B4", "#FF3232"]
            },
            "veil" : {
                "speed" : 0.5,
                "hueShift" : 0,
                "noiseIntensity" : 0,
                "scanlineFrequency" : 0,
                "scanlineIntensity" : 0,
                "warpAmount" : 0
            },
            "dotGrid" : {
                "baseColor" : "#5227FF",
                "activeColor" : "#5227FF",
                "dotSize" : 5,
                "gap" : 15,
                "proximity" : 120,
                "shockRadius" : 250,
                "shockStrength" : 5,
                "resistance" : 750, 
                "returnDuration" : 1.5
            },
            "faultyTerminal" : {
                "tintColor" : "#A7EF9E",
                "scale" : 1.5,
                "digitSize" : 1.2,
                "speed" : 0.5,
                "noiseAmplitude" : 1,
                "brightness" : 0.6,
                "scanlineIntensity" : 0.5,
                "curvature" : 0.1,
                "mouseStrength" : 0.5,
                "mouseReact" : true, 
                "pageLoadAnimation" : true 
            },
            "galaxy" : {
                "starSpeed" : 0.5,
                "density" : 1,
                "hueShift" : 140,
                "speed" : 1.0, 
                "glowIntensity" : 0.3,
                "saturation" : 0.0, 
                "twinkleIntensity" : 0.3,
                "transparent" : true   
            },
            "hyperspeed" : {
                "preset" : "default"
            }, 
            "iridescence" : {
                "color" : [1, 1, 1],
                "mouseReact" : false,
                "amplitude" : 0.1,
                "speed" : 1.0
            },
            "lightning" : {
                "hue" : 260,
                "xOffset" : 0,
                "speed" : 1,
                "intensity" : 1,
                "size" : 1
            },
            "waves" : {
                "waveSpeedX" : 0.0125,
                "wavesColor" : "#FFFFFF"
            },
            "letterGlitch" : {
                "glitchColors" : ["#2b4539", "#61dca3", "#61b3dc"],
                "glitchSpeed" : 10,
                "smoothAnimation" : true,
                "showCenterVignette": true,
                "showOuterVignette": false
            },
            "squares" : {
                "direction" : "diagonal",
                "speed" : 0.5,
                "squareSize" : 40,
                "borderColor" : "#fff",
                "hoverFillColor" : "#222"
            },
            "liquidChrome" : {
                "red" : 0.1,
                "green" : 0.1,
                "blue" : 0.1,
                "speed" : 0.3,
                "amplitude" : 0.3     
            },
            "balatro" : {
                "color1" : "#DE443B",
                "color2" : "#006BB4",
                "color3" : "#162325",
                "pixelFilter" : 745
            }
        }
    }
    """

    def __init__(self): 
        # if Path(Path.home() / 'Documents/TuneRip/server/appdata').exists():
        appdataFolder = Path(Path.home() / 'Documents/TuneRip/server/appdata')
        if not appdataFolder.exists():
            Path.mkdir(appdataFolder)
        self.file =  appdataFolder / 'BackgroundData.json' 
        if not Path(self.file).exists():
            Path.touch(self.file)
            with open(self.file, 'w') as file:
                file.write(backgroundData.data)

        self.defaultDataFile = appdataFolder / 'DefaultBackgroundData.json' 
        if not Path(self.defaultDataFile).exists():
            Path.touch(self.defaultDataFile)
            with open(self.defaultDataFile, 'w') as file:
                file.write(backgroundData.data)

        return

    def saveBackgroundSettings(self, request):
        url_parts = urllib.parse.urlparse(request.url)
        query_parts = urllib.parse.parse_qs(url_parts.query)
        if 'background' in query_parts:
            background = str(query_parts.get('background')[0])
        else:
            background = json.loads(request.data)['params']['background']
        changes = json.loads(request.data)

        data = None

        with open(self.file, 'r') as file:
            data = json.load(file)
            for property, value in changes.items():
                if background == 'aurora':
                    if property == 'color1':
                        data['Backgrounds'][background]['colorStops'][0] = value

                    if property == 'color2':
                        data['Backgrounds'][background]['colorStops'][1] = value

                    if property == 'color3':
                        data['Backgrounds'][background]['colorStops'][2] = value

                    if property == 'blend':
                        data['Backgrounds'][background]['blend'] = value

                    if property == 'speed':
                        data['Backgrounds'][background]['speed'] = value

                elif background == 'veil':
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value

                    if property == 'hueShift':
                        data['Backgrounds'][background][property] = value

                    if property == 'noiseIntensity':
                        data['Backgrounds'][background][property] = value

                    if property == 'scanlineFrequency':
                        data['Backgrounds'][background][property] = value

                    if property == 'scanlineIntensity':
                        data['Backgrounds'][background][property] = value

                    if property == 'warpAmount':
                        data['Backgrounds'][background][property] = value

                elif background == 'galaxy':
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value                
                    if property == 'density':
                        data['Backgrounds'][background][property] = value
                    if property == 'glowIntensity':
                        data['Backgrounds'][background][property] = value
                    if property == 'saturation':
                        data['Backgrounds'][background][property] = value
                    if property == 'hueShift':
                        data['Backgrounds'][background][property] = value
                    if property == 'twinkleIntensity':
                        data['Backgrounds'][background][property] = value
                    if property == 'transparent':
                        data['Backgrounds'][background][property] = value
                    if property == 'starSpeed':
                        data['Backgrounds'][background][property] = value
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value     

                elif background == 'dotGrid':
                    if property == 'baseColor':
                        data['Backgrounds'][background][property] = value
                    if property == 'activeColor':
                        data['Backgrounds'][background][property] = value
                    if property == 'dotSize':
                        data['Backgrounds'][background][property] = value
                    if property == 'gap':
                        data['Backgrounds'][background][property] = value
                    if property == 'proximity':
                        data['Backgrounds'][background][property] = value
                    if property == 'shockRadius':
                        data['Backgrounds'][background][property] = value
                    if property == 'shockStrength':
                        data['Backgrounds'][background][property] = value
                    if property == 'resistance':
                        data['Backgrounds'][background][property] = value
                    if property == 'returnDuration':
                        data['Backgrounds'][background][property] = value

                elif background == 'faultyTerminal':
                    if property == 'scale':
                        data['Backgrounds'][background][property] = value
                    if property == 'tintColor':
                        data['Backgrounds'][background][property] = value
                    if property == 'digitSize':
                        data['Backgrounds'][background][property] = value
                    if property == 'noiseAmplitude':
                        data['Backgrounds'][background][property] = value
                    if property == 'brightness':
                        data['Backgrounds'][background][property] = value
                    if property == 'scanlineIntensity':
                        data['Backgrounds'][background][property] = value
                    if property == 'curvature':
                        data['Backgrounds'][background][property] = value
                    if property == 'mouseStrength':
                        data['Backgrounds'][background][property] = value
                    if property == 'mouseReact':
                        data['Backgrounds'][background][property] = value
                    if property == 'pageLoadAnimation':
                        data['Backgrounds'][background][property] = value

                elif background == 'hyperspeed':
                    if property == 'preset':
                        data['Backgrounds'][background][property] = value

                elif background == 'iridescence':
                    
                    if property == 'red':
                        data['Backgrounds'][background]['color'][0] = value
                    if property == 'blue':
                        data['Backgrounds'][background]['color'][2] = value                        
                    if property == 'green':
                        data['Backgrounds'][background]['color'][1] = value
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value
                    if property == 'amplitude':
                        data['Backgrounds'][background][property] = value

                elif background == 'lightning':
                    if property == 'hue':
                        data['Backgrounds'][background][property] = value
                    if property == 'xOffset':
                        data['Backgrounds'][background][property] = value
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value
                    if property == 'intensity':
                        data['Backgrounds'][background][property] = value
                    if property == 'size':
                        data['Backgrounds'][background][property] = value

                elif background == 'waves':
                    if property == 'waveSpeedX':
                        data['Backgrounds'][background][property] = value
                    if property == 'wavesColor':
                        data['Backgrounds'][background][property] = value

                elif background == 'letterGlitch':
                    if property == 'glitchSpeed':
                        data['Backgrounds'][background][property] = value
                    if property == 'glitchColor1':
                        data['Backgrounds'][background]['glitchColors'][0] = value
                    if property == 'glitchColor2':
                        data['Backgrounds'][background]['glitchColors'][1]  = value
                    if property == 'glitchColor3':
                        data['Backgrounds'][background]['glitchColors'][2] = value

                elif background == 'squares':
                    if property == 'direction':
                        data['Backgrounds'][background][property] = value
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value
                    if property == 'squareSize':
                        data['Backgrounds'][background][property] = value
                    if property == 'borderColor':
                        data['Backgrounds'][background][property] = value

                elif background == 'liquidChrome':
                    if property == 'red':
                        data['Backgrounds'][background][property] = value
                    if property == 'green':
                        data['Backgrounds'][background][property] = value
                    if property == 'blue':
                        data['Backgrounds'][background][property] = value
                    if property == 'speed':
                        data['Backgrounds'][background][property] = value
                    if property == 'amplitude':
                        data['Backgrounds'][background][property] = value

                elif background == 'balatro':
                    if property == 'color1':
                        data['Backgrounds'][background][property] = value
                    if property == 'color2':
                        data['Backgrounds'][background][property] = value
                    if property == 'color3':
                        data['Backgrounds'][background][property] = value
                    if property == 'pixelFilter':
                        data['Backgrounds'][background][property] = value                

            data['selectedBackground'] = background
 

        with open(self.file, 'w') as file:
            json.dump(data, file, indent=4)   

        return 'ok'
    
    def reset(self, request):
        background = json.loads(request.data)['params']['background']
        with open(self.defaultDataFile, 'r') as file:
            data = json.load(file)
            defaultData = data['Backgrounds'][background]

        with open(self.file, 'r') as file:
            currData = json.load(file)
            currData['Backgrounds'][background] = defaultData

        with open(self.file, 'w') as file:
            json.dump(currData, file, indent=4)   

        return 'ok'

    def getBackgroundSettings(self):
        jsonFile = self.file
        with open(jsonFile, 'r') as file:
            data = json.load(file)

        currentBackground = data['selectedBackground']
        currentBackgroundSettings = data['Backgrounds'][currentBackground]

        with open(self.defaultDataFile, 'r') as file:
            defaultData = json.load(file)

        res = {}
        keyList = []
        for key, val in data['Backgrounds'].items():
            if val != defaultData['Backgrounds'][key]:
                res[key] = val
                keyList.append(key)

        return currentBackground, res, keyList
    

