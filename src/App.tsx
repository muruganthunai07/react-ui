import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className='font-sans bg-gray-50 min-h-screen w-full'>
      <Outlet />
    </div>
  );
};

export default App;
