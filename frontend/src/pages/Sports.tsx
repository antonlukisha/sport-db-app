import React, { useState } from 'react';
import Header from '../components/Header';

const Sports: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  return (
    <div className="main">
      <Header
        name={"Добавить спорт"}
      />
      <section>
      <br/>
        <div className="search-field">
          <input type="text" style={{ fontSize: '18px' }} placeholder="Название" onChange={(event) => setName(event.target.value)} />
          <button className="dark-input-button" style={{ fontSize: '18px' }}>Добавить</button>
        </div>
        {message && <p>{message}</p>}
        <br/>
      </section>
    </div>
  );
};

export default Sports;
