import { Mixer } from "./components/Mixer";
import { MixerMachineContext } from "@/context/MixerMachineContext";

function App() {
  return (
    <MixerMachineContext.Provider>
      <Mixer />
    </MixerMachineContext.Provider>
  );
}

export default App;
