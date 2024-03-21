import Scene from "./Scene";
function App() {
  let urls = [
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Soldier.glb",
    "https://store.redbrick.land/redbrick-asset/asset/vehicle_chariot_002.glb",
    "https://store.redbrick.land/redbrick-asset/asset/building_chocohouse_001.glb",
  ];
  return (
    <div className="App">
      <Scene urlGlb={urls[2]} />
    </div>
  );
}

export default App;
