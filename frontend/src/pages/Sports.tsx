import React, { useState } from 'react';
import Header from '../components/Header';
import { sportService } from '../services/SportService';

const Sports: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const responseMessage = await sportService.addSport({name: (name.charAt(0).toUpperCase() + name.slice(1))});
      if (responseMessage === 'Sport added successfully') {
        setMessage('Новый вид спорта успешно добавлен');
      } else {
        setMessage('Что-то пошло не так');
      }
    } catch (error) {
      setMessage('Не удалось добавить результат возможно такой спорт уже есть.');
    }
  };

  return (
    <div className="main">
      <Header
        name={"Добавить спорт"}
      />
      <section>
      <br/>
        <div className="search-field">
          <input type="text" style={{ fontSize: '18px' }} placeholder="Название" onChange={(event) => setName(event.target.value)} />
          <button className="dark-input-button" style={{ fontSize: '18px' }} onClick={handleSubmit}>Добавить</button>
        </div>
        <br/>
        {message && <p style={{ fontWeight: 'bold', fontSize: '12px' }}>{message}</p>}
        <br/>
      </section>
    </div>
  );
};

export default Sports;
