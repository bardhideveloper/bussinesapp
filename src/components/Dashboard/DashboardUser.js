import React from 'react';
import Footer from '../Footer/Footer'


function DashboardUser() {
  return (
      <div className="container fluid mt-5">
        <div className="row">
          <div className="col-md-12">
              <h1 className="display-4">Welcome to Our Dashboard</h1>
              <p className="lead">
                We're excited to have you on board. Explore our website and
                discover everything we have to offer.
              </p>
              <hr className="my-4" />
              <a className="btn btn-primary btn-lg" href="#" role="button">
                Learn More
              </a>
            </div>
          </div>
          <Footer/>
        </div>
  );
}

export default DashboardUser;