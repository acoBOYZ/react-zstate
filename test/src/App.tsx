import './App.css'
import GithubLogo from '/github-mark-white.svg'
import { useZState } from '@acoboyz/react-zstate';

function App() {
  const [, setData, resetData] = useZState(['g', 'z'], 'App');

  return (
    <>
      <div>
        <a href="https://github.com/acoBOYZ/react-qstate.git" target="_blank">
          <img src={GithubLogo} className="logo react" alt="Github logo" />
        </a>
      </div>
      <StateHeader />
      <div className="card">
        <input onChange={(e) => setData(e.target.value)} />
        <p>
          <button onClick={resetData} ><h2>RESET QSTATE</h2></button>
        </p>
        {/* <p>
        <input onChange={(e) => setData(e.target.value)} /> {" "} {data}
        </p> */}
        <p>
          Change above label input value and you can see the async magic!
        </p>
      </div>
    </>
  )
}

function StateHeader() {
  const [d] = useZState(['g', 'z'], 'StateHeader');
  return (
    <>
      <h1>{d}</h1>
    </>
  );
}

export default App
