from pathlib import Path


basePath = Path.home() / 'Documents' / 'TuneRip'
def pathMaker( path):
    """
    Lazy way to create paths
    """
    if not Path(path).exists():
        Path.mkdir(path)
    return

pathMaker(basePath / 'server')
pathMaker(basePath / 'server/static')
pathMaker(basePath / 'server/static/images')
pathMaker(basePath / 'server/static/albumCovers')
pathMaker(basePath / 'downloads')
pathMaker(basePath / 'downloads/custom')









