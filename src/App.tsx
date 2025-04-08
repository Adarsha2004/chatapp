   // src/App.tsx
   import React from 'react';
   import Chat from './chat.tsx';
   import './styles.css';

   const App: React.FC = () => {
     return (
       <div className="App">
         <Chat />
       </div>
     );
   };

   export default App;