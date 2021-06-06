import {callFunc, classNames, random} from "@wangct/util/lib/util";
import {isStr} from "@wangct/util/lib/typeUtil";
import React from "react";
import {Modal,message} from "antd";
import {addFragment, getState, removeFragment} from "../frame";
import {toStr} from "@wangct/util/lib/stringUtil";
import {Form} from "@wangct/react";
import {toAry} from '@wangct/util';

/**
 * 打开弹窗
 * @param options
 * @returns {{close: close}}
 */
export function openModal(options = {}) {
  options = {
    width: 400,
    ...options,
  };
  const close = () => {
    removeFragment(target);
  };

  function onOk() {
    const contentElem = getElem();
    if (!contentElem) {
      return;
    }
    let pro;
    if (contentElem.validator) {
      pro = contentElem.validator().then(options.onOk).catch((err) => {
        throw Object.values(err)[0];
      });
    } else {
      const value = contentElem.getValue && contentElem.getValue();
      pro = callFunc(options.onOk, value);
    }
    Promise.resolve(pro).then(close).catch((msg) => {
      alertErrInfo(msg);
    });
  }

  const {component, content: Com = component} = options;
  let elem = null;

  function setElem(com) {
    elem = com;
  }

  function getElem() {
    return elem;
  }
  const content = Com
    ? <Com targetRef={setElem} contentRef={setElem} ref={setElem} {...options.contentProps} />
    : <Form
      options={options.options}
      defaultValue={options.value}
      {...options.contentProps}
      ref={setElem}
    />;
  const target = <Modal
    title={options.title}
    visible
    onCancel={close}
    width={options.width}
    key={random()}
    onOk={options.onOk && onOk}
    className={options.className}
    {...options.modalProps}
  >
    {content}
  </Modal>;
  addFragment(target);
  return {
    close,
  };
}
