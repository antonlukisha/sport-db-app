import React from 'react';

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => (
  <div className="header">
    <div>
      <h1>{name}</h1>
    </div>
  </div>
);

export default Header;
