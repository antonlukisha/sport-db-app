import React, { useEffect, useState } from 'react';
import { athleteService } from '../services/AthleteService';
import Header from '../components/Header';
import { Athlete } from '../models/type/Athlete';
import { useSession } from '../context/SessionContext';

const Athletes: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [patronymic, setPatronymic] = useState<string | null>(null);
  const [sport, setSport] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { role, setRole } = useSession();

  const fetchAthletes = async () => {
    setLoading(true);
    setError(null);
    try {
      const athletesData = await athleteService.getAthletes();
      setAthletes(athletesData);
    } catch (error) {
      console.error('Failed to fetch athletes:', error);
      setError('Не удалось загрузить спортсменов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить спортсмена?')) {
      try {
        await athleteService.deleteAthlete(id);
        setAthletes(athletes.filter((athlete) => athlete.id !== id));
      } catch (error) {
        console.error('Failed to delete athlete:', error);
        setError('Не удалось удалить спортсмена');
      }
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  if (loading) return (
    <div className="main">
      <Header name={"Спортсмены"} />
      <section>
        <p>Загрузка...</p>
      </section>
    </div>
  );

  return (
    <div className="main">
      <Header name={"Спортсмены"} />
      <section>
        { role === 'admin' && <>
          <h2>Добавить спортсмена</h2>
          <div className="search-field">
            <input type="text" placeholder="Фамилия" onChange={(event) => setLastName(event.target.value)} />
            <input type="text" style={{ borderRadius: '0' }} placeholder="Имя" onChange={(event) => setFirstName(event.target.value)} />
            <input type="text" style={{ borderRadius: '0' }} placeholder="Отчество" onChange={(event) => setPatronymic(event.target.value)} />
            <input type="text" style={{ borderRadius: '0' }} placeholder="Спорт" onChange={(event) => setSport(event.target.value)} />
            <button className="dark-input-button">Добавить</button>
          </div>
          {message && <p>{message}</p>}
        </> }
        <br/>
        {error && <p className="error-message">{error}</p>}
        <table className="document-table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Вид спорта</th>
              {role === 'admin' && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete) => (
              <tr key={athlete.id}>
                <td>
                  {athlete.lastName} {athlete.firstName} {athlete.patronymic}
                </td>
                <td>{athlete.sport}</td>
                {role === 'admin' && <td>
                  <div className="actions">
                    <button className="light-button">Изменить</button>
                    <button className="light-button" onClick={() => handleDelete(athlete.id)}>Удалить</button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
      </section>
    </div>
  );
};

export default Athletes;
