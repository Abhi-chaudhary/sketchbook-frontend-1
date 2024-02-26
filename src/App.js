
import './App.css';
import Menu from './components/Menu';
import Toolbox from './components/Toolbox'
import Board from './components/Board';
import MobileWarning from './components/mobilewarning/MobileWarning';
import { useState, useEffect } from 'react';

function App() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    < div style={{ overflowX: 'hidden' }}>
      {isMobile ?
        (
          <MobileWarning />
        ) : (
          <div className="content">
            <Menu />
            <Toolbox />
            <Board />
          </div>
        )}

    </div>


  );
}

export default App;
