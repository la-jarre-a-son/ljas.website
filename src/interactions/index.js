import RoomAppear from "./RoomAppear"
import LightsHueScenes from "./LightsHueScenes"
import LightSwitch from "./LightSwitch"
import LightColorRotate from "./LightColorRotate"
import CymbalTap from "./CymbalTap"
import PadSample from "./PadSample"
import DrumTap from "./DrumTap"
import DrumKick from "./DrumKick"
import DrumSeat from "./DrumSeat"
import TableTop from "./TableTop"
import ScreenVideo from "./ScreenVideo"
import ScreenWebcam from "./ScreenWebcam"
import ChairRotate from "./ChairRotate"
import DoorRotate from "./DoorRotate"
import DeskDrawer from "./DeskDrawer"
import ChairSeat from "./ChairSeat"
import TetrominoZoom from "./TetrominoZoom"
import GuitarSamples from "./GuitarSamples"
import PianoSamples from "./PianoSamples"
import RandomSamples from "./RandomSamples"
import MacBookScreen from "./MacBookScreen"
import VinylZoom from "./VinylZoom"
import VinylSlide from "./VinylSlide"
import InteractionLabel from "./InteractionLabel"

export function registerInteractions(scene) {
  const interactions = [


    new LightsHueScenes("HueRemote", "click", scene),
    new LightSwitch("TreeLamp", "click", scene),
    new LightSwitch("DeskLampBase", "click", scene),
    new LightColorRotate("NameLight", "init", scene),
    new LightSwitch("NameLight", "click", scene),
    new LightSwitch("BedLamp", "click", scene),
    new LightSwitch("NeonLight", "click", scene),
    
    new LightColorRotate("Keyboard", "init", scene, 10000),
    new LightColorRotate("Mouse", "init", scene, 10000),
    new TableTop("TableTop_1", "click", scene),

    // Drumkit
    new PadSample("DrumKickHead", "down", scene),
    new DrumTap("DrumKickHead", "down", scene),
    new DrumKick("DrumKickHead", "down", scene, "DrumKickPedalBatter"),

    new PadSample("DrumSnareHead", "down", scene),
    new DrumTap("DrumSnareHead", "down", scene),
    new PadSample("DrumTomHead", "down", scene),
    new DrumTap("DrumTomHead", "down", scene),
    new PadSample("DrumFloorTomHead", "down", scene),
    new DrumTap("DrumFloorTomHead", "down", scene),

    new PadSample("DrumCrash", "down", scene),
    new CymbalTap("DrumCrash", "down", scene),
    new PadSample("DrumRide", "down", scene),
    new CymbalTap("DrumRide", "down", scene),
    new PadSample("HiHatTop", "down", scene),
    new CymbalTap("HiHatTop", "down", scene),

    // Electronic Drumkit
    new PadSample("EDrumKickHead", "down", scene),
    new DrumTap("EDrumKickHead", "down", scene),
    new DrumKick("EDrumKickHead", "down", scene, "EDrumKickPedalBatter"),

    new PadSample("EDrumSnareHead", "down", scene),
    new DrumTap("EDrumSnareHead", "down", scene),
    new PadSample("EDrumTomHiTomHead", "down", scene),
    new DrumTap("EDrumTomHiTomHead", "down", scene),
    new PadSample("EDrumTomMidTomHead", "down", scene),
    new DrumTap("EDrumTomMidTomHead", "down", scene),
    new PadSample("EDrumFloorTomHead", "down", scene),
    new DrumTap("EDrumFloorTomHead", "down", scene),

    new PadSample("EDrumCrashL", "down", scene),
    new CymbalTap("EDrumCrashL", "down", scene),
    new PadSample("EDrumCrashR", "down", scene),
    new CymbalTap("EDrumCrashR", "down", scene),
    new PadSample("EDrumRide", "down", scene),
    new CymbalTap("EDrumRide", "down", scene),
    new PadSample("EDrumHiHatTop", "down", scene),
    new CymbalTap("EDrumHiHatTop", "down", scene),
    
    new DrumSeat("DrumSeat", "click", scene, "DrumKick"),
    new DrumSeat("EDrumSeat", "click", scene, "EDrumKick"),

    new ScreenVideo("ScreenMain_1", "click", scene, "//files.ljas.fr/videos/LJAS001-GreyHell.1080p.mp4"),
    // new ScreenWebcam("ScreenSecond_1", "init", scene, "OBS Virtual Camera"),
    new ChairRotate("ChairSquab", "drag", scene),
    new DoorRotate("Door", "drag", scene),
    new DeskDrawer("DeskDrawer", "click", scene),
    new ChairSeat("ChairSquab", "click", scene, "ScreenMain_1"),
    
    new GuitarSamples("GuitarStrato", "drag", scene, "ElectricGuitar"),
    new GuitarSamples("GuitarBassAria", "drag", scene, "ElectricBass"),
    new GuitarSamples("GuitarCP100", "drag", scene, "AcousticGuitar"),
    new GuitarSamples("GuitarBassHB", "drag", scene, "AcousticBass"),
    new GuitarSamples("GuitarRune", "drag", scene, "ClassicGuitar"),
    new GuitarSamples("GuitarYamaha", "drag", scene, "ClassicGuitar"),

    new PianoSamples("Piano", "drag", scene, "Piano"),
    new PianoSamples("Piano001", "drag", scene, "Rhodes"),
    new RandomSamples("Cajon", "down", scene, "Cajon"),

    new MacBookScreen("MacbookLid_2", "update", scene),

    // VinylShelf
    new VinylZoom("VinylShelf", "click", scene),
    new VinylSlide("VinylCover001", "hover", scene),
    new VinylSlide("VinylCover002", "hover", scene),
    new VinylSlide("VinylCover003", "hover", scene),
    new VinylSlide("VinylCover004", "hover", scene),
    new VinylSlide("VinylCover005", "hover", scene),
    new VinylSlide("VinylCover006", "hover", scene),
    new VinylSlide("VinylCover007", "hover", scene),
    new VinylSlide("VinylCover008", "hover", scene),
    new VinylSlide("VinylCover009", "hover", scene),
    new VinylSlide("VinylCover010", "hover", scene),
    new VinylSlide("VinylCover011", "hover", scene),
    new VinylSlide("VinylCover012", "hover", scene),
    new VinylSlide("VinylCover013", "hover", scene),
    new VinylSlide("VinylCover014", "hover", scene),
    new VinylSlide("VinylCover015", "hover", scene),
    new VinylSlide("VinylCover016", "hover", scene),


    // // Tetris 0
    // new TetrominoZoom("Tetromino", "click", scene),
    // new TetrominoZoom("Tetromino001", "click", scene),
    // new TetrominoZoom("Tetromino002", "click", scene),
    // new TetrominoZoom("Tetromino003", "click", scene),

    // // Tetris T
    // new TetrominoZoom("Tetromino004", "click", scene),
    // new TetrominoZoom("Tetromino005", "click", scene),
    // new TetrominoZoom("Tetromino006", "click", scene),
    // new TetrominoZoom("Tetromino007", "click", scene),

    // // Tetris S
    // new TetrominoZoom("Tetromino008", "click", scene),
    // new TetrominoZoom("Tetromino009", "click", scene),
    // new TetrominoZoom("Tetromino010", "click", scene),
    // new TetrominoZoom("Tetromino011", "click", scene),

    // // Tetris J
    // new TetrominoZoom("Tetromino012", "click", scene),
    // new TetrominoZoom("Tetromino013", "click", scene),
    // new TetrominoZoom("Tetromino014", "click", scene),
    // new TetrominoZoom("Tetromino015", "click", scene),

    // // Tetris I
    // new TetrominoZoom("Tetromino016", "click", scene),
    // new TetrominoZoom("Tetromino017", "click", scene),
    // new TetrominoZoom("Tetromino018", "click", scene),
    // new TetrominoZoom("Tetromino019", "click", scene),

    new InteractionLabel("NORTH", "outline", scene),
    new InteractionLabel("EAST", "outline", scene),
    new InteractionLabel("SOUTH", "outline", scene),
    new InteractionLabel("WEST", "outline", scene),

    new RoomAppear("Scene", "init", scene),
  ];

  return interactions;
}

export function runInteractions(interactions, trigger, event) {
  // console.log("RUN INTERACTIONS", trigger, event);
  if (!interactions) return;

  for (let interaction of interactions) {
    if (interaction.trigger === trigger) {
      interaction.run(event);
    }
  }
}