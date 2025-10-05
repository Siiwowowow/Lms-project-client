import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../ShareComponent/Navbar/Navbar';
import Footer from '../ShareComponent/Footer/Footer';

const Roots = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-117px)] mx-auto  max-w-[1400px]'>
            <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Roots;