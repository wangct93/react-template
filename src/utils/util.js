
import {
  getState,
  updateModel
} from "../frame";
import React from "react";
import {setIconScriptUrl} from "@wangct/react/lib/utils/utils";

export function getUserInfo(){
  return getState('user').userInfo;
}

export function initConfig(){
  // setIconScriptUrl('//at.alicdn.com/t/font_2360130_sinuu0hfzgt.js');
}
