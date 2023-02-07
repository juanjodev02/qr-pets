import Lottie from "lottie-react";
import KittyFile from "../public/kitty.json";

export const Kitty = () => {
  return (
    <Lottie
      animationData={KittyFile}
      loop={true}
      style={{ height: 300 }}
    />
  );
}