import React from 'react';
import Home from '../../Pages/Home/Home';
import Counter from '../../Pages/Counter/Counter';
import Why from '../../Pages/Why/Why';
import Faq from '../../Pages/Faq/Faq';
import Review from '../../Pages/Review/Review';
import InstructorCard from '../../Pages/Why/InstructorCard';
import Video from '../../Pages/Review/Video';


const HomePage = () => {
    return (
        <div>
            <Home></Home>
            <Counter></Counter> 
            <Why></Why>
            <InstructorCard></InstructorCard>
            <Review></Review>
            <Video></Video>
            <Faq></Faq>
            
            
            

            
        </div>
    );
};

export default HomePage;