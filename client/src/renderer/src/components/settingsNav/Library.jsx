import TrackTable from "components/trackTable/TrackTable";
import ReorderTracks from "components/reorder/ReorderTracks";
import Crop from "components/crop/Crop";
import EditMetaData from "components/editMetaData/EditMetaData";
import SelectBackground from "components/selectBackground/SelectBackground";
import SelectCursor from "components/selectCursor/SelectCursor";
import FolderMerge from "components/folderMerge/FolderMerge";
import CoverArtSettings from "components/coverArtSettings/CoverArtSettings";
import PhraseFilter from "components/phraseFilter/PhraseFilter";
import About from "components/about/About";
import AudioTrimmer from "components/audioTrimmer/AudioTrimmer";
import VideoFilter from "components/videoFilter/VideoFilter";
import ChannelCardEditor from "components/channelCardEditor/ChannelCardEditor";

function Library({}){

    return (
        <>
            <div className="text-white font-[50px]">
                hello world
            </div>

            <div className="text-center mt-[20px]">
                <VideoFilter setRefresh={setRefresh} setTabsDisabled={setTabsDisabled}/>
            </div>
        </>
    )
}

export default Library;