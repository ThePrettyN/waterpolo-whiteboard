import React from 'react';
import Board from './components/board/Board';
import ToolBar from './components/layout/ToolBar';
import PositionSelector from './components/layout/PositionSelector';
import RightPanel from './components/layout/RightPanel';
import { BoardProvider } from './context/BoardContext';
import { PositionProvider } from './context/PositionContext';

function App() {
  return (
    <BoardProvider>
      <PositionProvider>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
          <div className="flex flex-col col-span-3 gap-y-2">
            <PositionSelector />
            <Board />
            <ToolBar />
          </div>
          <div className="col-span-2">
            <RightPanel />
          </div>
        </div>
      </PositionProvider>
    </BoardProvider>
  );
}

export default App;
