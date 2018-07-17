import React, { Component } from 'react';
import logo from './logo.svg';
import './Welcome.css';
import { MenuItem, Button, Intent, ControlGroup } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import fuzzaldrin from 'fuzzaldrin-plus';

class Welcome extends Component {
  render() {
    return (
      <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', minHeight: '100%', alignItems: 'center'}}>
        <HeaderLogo logo={logo} />

        <div style={{flexGrow: 1}}>
          <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
            <Container title='Analyse a new file'>
              <OpenFilePrompt />
            </Container>

            <Container title='Recent sessions'>
              <RecentSessions />
            </Container>
          </div>
        </div>

        <footer>Hello, World</footer>
      </div>
    );
  }
}

const Container = (props) => {
  return (
       <div style={{marginTop: '50px', marginBottom: '20px', width: '600px'}}>
        <h5>{props.title}</h5>
        {props.children}
      </div>);
}

const HeaderLogo = (props) => {
  return (
    <header className='Welcome-header'>
      <img src={props.logo} className='Welcome-logo' alt='logo' />
    </header>);
}

const FileSuggestion = (file, props) => {
  return (
    <MenuItem
      active={props.modifiers.active}
      label={file.isdir ? "Directory" : ""}
      key={file.name}
      text={file.name}
    />);
}

class OpenFilePrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      dirname: null
    };
  }

  render() {
    return (
      <ControlGroup vertical={false} fill={true}>
        <Suggest
          inputProps={{
            leftIcon: 'document-open',
            placeholder: 'Drop here or browse for files...',
            onChange: (ev) => this.pathChanged(ev.target.value)
          }}
          popoverProps={{
            minimal: true,
            modifiers: {
              preventOverflow: {
                enabled: true,
                boundariesElement: "scrollParent"
              },
            },
            className: "Popover",
            usePortal: false
          }}
          items={this.state.suggestions}
          onItemSelect={(a,b) => this.pathSelected(a,b)}
          itemRenderer={FileSuggestion}
          inputValueRenderer={(t) => t.name}
          itemListPredicate={this.filterList}
        />
        <Button
          text='Browse'
          style={{flexGrow: 0}}
          intent={Intent.PRIMARY}
          onClick={(ev) => { window.ipc.send("", "open_file_browser"); }}
        />
      </ControlGroup>);
  }

  componentDidMount() {
    this.lstId = window.ipc.on('',(ev, cmd, args) => {
      console.log("got",cmd,args);
      switch (cmd) {
        case 'file_suggestions':
          console.log("dir:",this.state.dirname, args['dir']);
          if (this.state.dirname === args['dir']) {
            console.log("set suggests",args['contents'])
            this.setState({
              dirname: this.state.dirname,
              suggestions: args['contents']
            });
          }
          break;
        default:
          break;
      }
    });
    window.ipc.send('','get_suggestions', window.homedir);
  }

  componentWillUnmount() {
    window.ipc.removeListener(this.lstId);
  }

  filterList(query, items) {
    let base = window.path.basename(query);
    let f = fuzzaldrin.filter(items, base);

    if (f.length === 0) {
      console.log("return default");
      return items;
    } else {
      return f;
    }
  }

  pathChanged(path) {
    const respath = window.path.normalize(path);
    const abspath = window.path.resolve(window.homedir, respath);
    const dir = path === '' || path.endsWith(window.path.sep) ? abspath : window.path.dirname(abspath);

    if (dir !== this.state.dirname) {
      this.setState({
        suggestions: [],
        dirname: dir
      });
      window.ipc.send("", "get_suggestions", dir);
    }
  }

  pathSelected(file, ev) {
    const path = window.path.resolve(this.state.dirname, file.name);

    if (file.isdir) {
      this.pathChanged(path);
    } else {
      window.panopticon.peek(path);
    }
  }
}

class RecentSessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: []
    };
  }

  render() {
    return (
      <table className='pt-html-table pt-interactive' style={{width: '100%'}}>
        <tbody>
          {this.state.sessions.map((x) => (
            <tr key={x.key}>
              <td>{x.name}</td>
              <td>{x.details}</td>
              <td>{x.timestamp}</td>
            </tr>))
          }
        </tbody>
      </table>);
  }

  componentDidMount() {
    this.lstId = window.ipc.on('',(ev, cmd, args) => {
      console.log(ev,cmd,args);
      switch (cmd) {
        case 'recent_sessions':
          this.setState({ sessions: args });
          break;
        default:
          break;
      }
    });
    window.ipc.send('','get_sessions');
  }

  componentWillUnmount() {
    window.ipc.removeListener(this.lstId);
  }
}


export default Welcome;
