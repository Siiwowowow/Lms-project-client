import React from 'react';
import './About.css'; // We'll define styles below

const About = () => {
    return (
        <div className="about-container">
            {/* Angled "About Us" Tag */}
            <div className="about-tag">About Us</div>
            
            {/* Centered Mission Statement */}
            <div className="mission-statement">
                We are passionate about empowering learners Worldwide with high-quality, accessible & engaging education. Our mission offering a diverse range of courses.
            </div>
            
            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-item">
                    <div className="stat-number">25+</div>
                    <div className="stat-label">Years of eLearning Education Experience</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">56k</div>
                    <div className="stat-label">Students Enrolled in LMSZONE Courses</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">170+</div>
                    <div className="stat-label">Experienced Teacher's service.</div>
                </div>
            </div>
        </div>
    );
};

export default About;