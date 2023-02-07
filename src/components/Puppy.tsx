import Lottie from "lottie-react";
import PuppyFile from "../public/puppy.json";

export const Puppy = () => {
  return (
    <Lottie
      animationData={PuppyFile}
      loop={true}
    />
  );
}