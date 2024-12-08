import React, { useEffect, useState } from 'react';
import { athleteService } from '../services/AthleteService';
import Header from '../components/Header';
import { Athlete } from '../models/type/Athlete';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [editAthlete, setEditAthlete] = useState<Athlete | null>(null);

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    try {
      const responseMessage = await athleteService.createAthlete({
        firstName: (firstName.charAt(0).toUpperCase() + firstName.slice(1)),
        lastName: (lastName.charAt(0).toUpperCase() + lastName.slice(1)),
        patronymic: (patronymic ? (patronymic.charAt(0).toUpperCase() + patronymic.slice(1)) : ''),
        sport: (sport.charAt(0).toUpperCase() + sport.slice(1))
      });
      if (responseMessage === 'Athlete added successfully') {
        setMessage('Спортсмен добавлен.');
        fetchAthletes();
        await sleep(1000);
        setMessage('');
      } else {
        setError('Что-то пошло не так');
        await sleep(1000);
        setError('');
      }
    } catch (error) {
      setError('Не удалось добавить спортсмена.');
      await sleep(1000);
      setError('');
    }
  };

  const handleEditClick = (athlete: Athlete) => {
    setEditAthlete(athlete);
  };

  const handleEditSave = async () => {
    try {
      if (
        !editAthlete?.lastName ||
        !editAthlete?.firstName ||
        !editAthlete?.sport
      ) {
        setError("Все поля должны быть заполнены.");
        await sleep(1000);
        setError('');
        return;
      }

      const responseMessage = await athleteService.updateAthlete({
        id: editAthlete.id,
        firstName: (editAthlete.firstName.charAt(0).toUpperCase() + editAthlete.firstName.slice(1)),
        lastName: (editAthlete.lastName.charAt(0).toUpperCase() + editAthlete.lastName.slice(1)),
        patronymic: (editAthlete.patronymic ? (editAthlete.patronymic.charAt(0).toUpperCase() + editAthlete.patronymic.slice(1)) : ''),
        sport: (editAthlete.sport.charAt(0).toUpperCase() + editAthlete.sport.slice(1))
      });
      setEditAthlete(null);
      setError("");
      if (responseMessage === 'Athlete updated successfully') {
        setMessage('Спортсмен изменён.');
        fetchAthletes();
        await sleep(1000);
        setMessage('');
      } else {
        setError('Что-то пошло не так');
        await sleep(1000);
        setError('');
      }
    } catch (error) {
      setError('Не удалось изменить данные спортсмена.');
      await sleep(1000);
      setError('');
    }
  };

  const fetchAthletes = async () => {
    setLoading(true);
    setError(null);
    try {
      const athletesData = await athleteService.getAthletes();
      setAthletes(athletesData);
    } catch (error) {
      console.error('Failed to fetch athletes:', error);
      setError('Не удалось загрузить спортсменов');
      await sleep(1000);
      setError('');
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
        await sleep(1000);
        setError('');
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
            <button className="dark-input-button" onClick={handleSubmit}>Добавить</button>
          </div>
          {message && <p style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}>{message}</p>}
          {error && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>{error}</p>}
        </> }
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
                    <button className="light-button" onClick={() => handleEditClick(athlete)}>Изменить</button>
                    <button className="light-button" onClick={() => handleDelete(athlete.id)}>Удалить</button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
      </section>
      {editAthlete && (
        <>
          <br/>
          <section>
            <h2>Редактировать данные спортсмена</h2>
            <div className="search-field">
              <input
                type="text"
                placeholder="Фамилия"
                value={editAthlete.lastName}
                onChange={(e) =>
                  setEditAthlete({ ...editAthlete, lastName: e.target.value })
                }
              />
              <input
                type="text"
                style={{ borderRadius: "0" }}
                placeholder="Имя"
                value={editAthlete.firstName}
                onChange={(e) =>
                  setEditAthlete({ ...editAthlete, firstName: e.target.value })
                }
              />
              <input
                type="text"
                style={{ borderRadius: "0" }}
                placeholder="Отчество"
                value={editAthlete.patronymic}
                onChange={(e) =>
                  setEditAthlete({ ...editAthlete, patronymic: e.target.value })
                }
              />
              <input
                type="text"
                style={{ borderRadius: "0" }}
                placeholder="Спорт"
                value={editAthlete.sport}
                onChange={(e) =>
                  setEditAthlete({ ...editAthlete, sport: e.target.value })
                }
              />
              <div className="actions">
                <button className="dark-input-button" onClick={handleEditSave}>
                  Сохранить
                </button>
                <button
                  className="light-button"
                  onClick={() => setEditAthlete(null)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </section>
        </>
        )}
    </div>
  );
};

export default Athletes;
