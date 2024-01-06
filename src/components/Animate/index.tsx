/* eslint-disable jsx-a11y/iframe-has-title */
import * as React from 'react';
import { useState } from 'react';
import './styles.css'

const MyAnimate = ({src}: any) => {
    
  return (
    <div id="wrap">
      <iframe id="scaled-frame" src={src} />
    </div>
  );
};

export default MyAnimate;