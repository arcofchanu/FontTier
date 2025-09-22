import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Loader = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loaderContent = (
    <StyledWrapper>
      <div className="loader">
        <div className="square" id="sq1" />
        <div className="square" id="sq2" />
        <div className="square" id="sq3" />
        <div className="square" id="sq4" />
        <div className="square" id="sq5" />
        <div className="square" id="sq6" />
        <div className="square" id="sq7" />
        <div className="square" id="sq8" />
        <div className="square" id="sq9" />
      </div>
    </StyledWrapper>
  );

  if (!isMounted) {
    return null;
  }
  
  return ReactDOM.createPortal(loaderContent, document.body);
}

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 251, 245, 0.7);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .loader {
    position: relative;
    width: 50px;
    height: 50px;
  }

  @keyframes loader_5191 {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .square {
    background: #FF7F50;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -5px;
    margin-left: -5px;
    border-radius: 2px;
  }

  #sq1 {
    margin-top: -25px;
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 0s infinite alternate;
  }

  #sq2 {
    margin-top: -25px;
    animation: loader_5191 675ms ease-in-out 75ms infinite alternate;
  }

  #sq3 {
    margin-top: -25px;
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 150ms infinite alternate;
  }

  #sq4 {
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 225ms infinite alternate;
  }

  #sq5 {
    animation: loader_5191 675ms ease-in-out 300ms infinite alternate;
  }

  #sq6 {
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 375ms infinite alternate;
  }

  #sq7 {
    margin-top: 15px;
    margin-left: -25px;
    animation: loader_5191 675ms ease-in-out 450ms infinite alternate;
  }

  #sq8 {
    margin-top: 15px;
    animation: loader_5191 675ms ease-in-out 525ms infinite alternate;
  }

  #sq9 {
    margin-top: 15px;
    margin-left: 15px;
    animation: loader_5191 675ms ease-in-out 600ms infinite alternate;
  }
`;

export default Loader;