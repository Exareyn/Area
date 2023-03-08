import React from "react";
import { push as Menu } from "react-burger-menu";
import "./BurgerMenu.css";
import Twitter from "../components/Twitter/Twitter";
import Discord from "../components/Discord/Discord";
import Google from "../components/Google/Google";
import Facebook from "../components/Facebook/Facebook";
import Github from "../components/Github/Github";

const SignOther = () => {
    return (
      <div className="sign">
        <Twitter/>
        <Discord/>
        <Google/>
        <Facebook/>
        <Github/>
      </div>
    );
}

const BurgerMenu = (props) => {
  return (
    <Menu {...props}>
        <SignOther/>
    </Menu>
  );
};

export default BurgerMenu;