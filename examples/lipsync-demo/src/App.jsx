import { Loader } from "@react-three/drei";
import { Lipsync } from "wawa-lipsync";
import { UI } from "./components/UI";
import { UserCamera } from "./components/UserCamera";

export const lipsyncManager = new Lipsync({});

function App() {
  return (
    <>
      <Loader />
      <UI />
      <UserCamera />
    </>
  );
}

export default App;
