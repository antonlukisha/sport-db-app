import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Surfing, Sports, BarChart, Logout, Login, EmojiEvents, SportsBasketball, AccountCircle } from '@mui/icons-material';
import { useSession } from '../context/SessionContext';

const SideBar: React.FC = () => {
  const { role, setRole } = useSession();
  
  return (
    <div className="nav">
      <Link to="/">
        <div className="logo">
          <h1>Sport</h1>
          <h1 className="black-part">DB</h1>
        </div>
      </Link>
      <div className="pages">
        <div className="general">
          <div className="general-label">
            МЕНЮ
          </div>
          <ul className="general-nav">
            <li><Link to="/athletes"><Surfing />Список спортсменов</Link></li>
            <li><Link to="/competitions"><EmojiEvents />Список соревнований</Link></li>
            { role === 'admin' && <li><Link to="/add-sport"><SportsBasketball />Добавить новый спорт</Link></li>}
            <li><Link to="/results" style={{fontSize: '17px'}}><Sports />Отчётность по соревнованиям</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
