import React from 'react';

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>About This Application</h2>
      <p>This application was developed by <strong>Xojiakbar Akramov, This app is simple Star Wars character profiler</strong>.</p>
      <p>
        It is a part of the <a href="https://app.rs.school/" target="_blank" rel="noopener noreferrer">RS School React course</a>.
      </p>
    </div>
  );
};

export default About;
