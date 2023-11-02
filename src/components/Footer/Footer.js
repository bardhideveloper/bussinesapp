import React from 'react';

function Footer() {
  const footerStyle = {
    backgroundColor: 'white',
    padding: '20px 0',
    bottom: 0,
    width: '100%',
  };

  return (
    <footer style={footerStyle}>
      <div className="container">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Bussines App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;