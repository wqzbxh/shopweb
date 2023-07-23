import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import './App.css';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import { Notifications } from '@mantine/notifications';
import Home from './pages/Home/Home';
import GoodGategory from './pages/Goods/Category/Category';
import { ModalsProvider } from '@mantine/modals';
import UserIndex from './pages/User/User/UserIndex';
import RoleIndex from './pages/User/Role/RoleIndex';
import Goods from './pages/Goods/Goods/Goods';
import Specification from './pages/Goods/Specification/Specification';
import Project from './pages/TimeMange/Project/Project';
import TimeTracker from './pages/TimeMange/TimeSheet/TimeTracker';

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
      
    <ModalsProvider>
    <Notifications />
    <BrowserRouter> 
          <Routes> 
            <Route path="/login" element={ <Login />} />
               <Route path="/" element={<Admin/>} >
                <Route path="/admin" element={<Home />} />
                <Route path="/home" element={<Home/>} />
                <Route path="/goods" element={<Goods/>} > </Route>
                <Route path="/user" element={<UserIndex/>} > </Route>
                <Route path="/user_role" element={<RoleIndex/>} > </Route>
               <Route path="/specification" element={<Specification/>} > </Route>
               <Route path="/goods_catregory" element={<GoodGategory/>} > </Route>
                <Route path="/time_project" element={<Project/>} > </Route>
                <Route path="/time_sheet" element={<TimeTracker/>} > </Route>
            </Route>
          </Routes>
        </BrowserRouter> </ModalsProvider>
    </MantineProvider>
  </ColorSchemeProvider>
   
  );
}

export default App;
