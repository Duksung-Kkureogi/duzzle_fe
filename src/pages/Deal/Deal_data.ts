// 이미지
import myImg from "./myImg.png";
import u1Img from "./userImg.png";
import u2Img from "./sun.png";
import blueprintImg from "../../assets/images/blueprint.png";
import brickImg from "../../assets/images/brick.png";
import glassImg from "../../assets/images/glass.png";
import sandImg from "../../assets/images/sand.png";
import hammerImg from "../../assets/images/hammer.png";

export const DealList = [
  { userImg: u1Img, myItem: brickImg, yourItem: glassImg },
  { userImg: u2Img, myItem: blueprintImg, yourItem: hammerImg },
  { userImg: u2Img, myItem: sandImg, yourItem: blueprintImg },
  { userImg: u1Img, myItem: glassImg, yourItem: brickImg },
];

export const myDealList = [
  { userImg: myImg, myItem: blueprintImg, yourItem: hammerImg },
  { userImg: myImg, myItem: glassImg, yourItem: sandImg },
];
