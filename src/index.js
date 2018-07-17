import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Welcome from './Welcome';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/*
interface Promise<T> {
  readonly state: string;
  readonly error?: string;
  readonly value?: T;
}

interface State {
  readonly program: Promise<Program>;
}

interface Program {
  readonly name: string;
  readonly isa: string;
  readonly functions: ReadonlyArray<Promise<Function>>;
}

interface Function {
  readonly name: string;
  readonly uuid: string;
  readonly entry_point: int;
  readonly cflow_edges: Promise<ReadonlyArray<Edge>>;
  readonly cflow_nodes: Block;
  readonly mnemonics: ReadonlyArray<Mnemonic>;
  readonly interpretations: ReadonlyArray<Interpretation>;
  readonly pseudo_code: Promise<Ast>;
}

interface Interpretation {
  readonly description: string;
  readonly values: Promise<ReadonlyArray<Value>>;
}

interface Block {
  readonly start: int;
  readonly end: int;
  readonly first_mnemonic: int;
  readonly last_mneonic: int;
}

interface Mnemonic {
  readonly opcode: string;
  readonly args: ReadonlyArray<string>;
  readonly length: int;
}
*/

//ReactDOM.render(<Welcome />, document.getElementById('root'));

// XXX: what? buggy

setInterval(() => {
  let state = window.panopticon.current();
  console.log(state);
  ReactDOM.render(<App value={state} />, document.getElementById('root'));
},200);
registerServiceWorker();
