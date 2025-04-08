import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
  return (
    // Bootstrap container for responsive width and centering
    <div className="container mt-4">
      {/* You could add a Navbar here later */}
      <div className="row justify-content-center">
        {/* Center content in a medium-sized column */}
        <div className="col-md-16 col-lg-16">
          {children} {/* Render the actual page content here */}
        </div>
      </div>
      {/* You could add a Footer here later */}
    </div>
  );
}

export default Layout;