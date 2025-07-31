from pathlib import Path
import json
from urllib.parse import urlparse, parse_qs
import urllib.parse

class backgroundData():
    data = """
    {
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
            "hyperSpeed" : {
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
            }
        }
    }
    """

    def __init__(self): 
        # if Path(Path.home() / 'Documents/TuneRip/server/appdata').exists():
        appdataFolder = Path(Path.home() / 'Documents/Github/TuneRip/server/appdata')
        if not appdataFolder.exists():
            Path.mkdir(appdataFolder)
        self.file =  appdataFolder / 'BackgroundData.json' 
        if not Path(self.file).exists():
            Path.touch(self.file)
            with open(self.file, 'w') as file:
                file.write(backgroundData.data)

        defaultFile = appdataFolder / 'DefaultBackgroundData.json' 
        if not Path(defaultFile).exists():
            Path.touch(defaultFile)
            with open(defaultFile, 'w') as file:
                file.write(backgroundData.data)

        self.defaultDataFile = defaultFile
        return

    def saveBackgroundSettings(self, request):
        url_parts = urllib.parse.urlparse(request.url)
        query_parts = urllib.parse.parse_qs(url_parts.query)
        background = query_parts.get('background')[0]
        changes = json.loads(request.data)
        data = None
        with open(self.file, 'r') as file:
            data = json.load(file)
            for property, value in changes.items():
                data['Backgrounds'][background][property] = value

        with open(self.file, 'w') as file:
            json.dump(data, file, indent=4)   

        return 'ok'
    
    def reset(self):
        with open(self.defaultDataFile, 'r') as file:
            data = json.load(file)

        with open(self.file, 'w') as file:
            json.dump(data, file, indent=4)   

        return 'ok'
