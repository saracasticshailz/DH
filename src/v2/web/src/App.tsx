import { useState } from 'react';
import reactLogo from 'resources/assets/adcb.svg';
import './App.css';
import { print, message } from 'common/global';

//@ts-ignore
import useHandShake from 'common/hooks/useHandShake';

function App() {
  let msg = message('web');
  print('Web');
  useHandShake();
  console.log('meta: ' + JSON.stringify(import.meta.env));

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
          <h1>{msg}</h1>
        </a>
      </div>
    </>
  );
}

export default App;
