import React from 'react';
import "./dashboardUser.scss"


function DashboardUser() {
  return (
    <div className="container fluid mt-5">
      <div className='dashboard-container'>
      <div className="row">
        <div className="col-md-6">
          <h1 className="display-4">Welcome to Our Dashboard</h1>
        </div>
        <div className='col-md-6'>
          <p className="lead">
            We're excited to have you on board. Explore our website and
            discover everything we have to offer.
          </p>
          <a className="btn btn-primary btn-lg" href="#" role="button">
            Learn More
          </a>
        </div>
      </div>
     
      </div>
      <div className='content-container'>
        <div className='row'>
          <div className='col-md-12'>
            <h1 className='display-4'>Here is the content of the webpage</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;