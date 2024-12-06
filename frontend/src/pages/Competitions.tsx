import React, { useEffect, useState } from 'react';
import { competitionService } from '../services/CompetitionService';
import Header from '../components/Header';
import { Competition } from '../models/type/Competition';
import { useSession } from '../context/SessionContext';

const Competitions: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { role, setRole } = useSession();

  const fetchCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const competitionsData = await competitionService.getCompetitions();
      setCompetitions(competitionsData);
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
      setError('Не удалось загрузить соревнования');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить соревнование?')) {
      try {
        await competitionService.deleteCompetition(id);
        setCompetitions(competitions.filter((competition) => competition.id !== id));
      } catch (error) {
        console.error('Failed to delete competition:', error);
        setError('Не удалось удалить соревнование');
      }
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (loading) return (
    <div className="main">
      <Header name={"Соревнования"} />
      <section>
        <p>Загрузка...</p>
      </section>
    </div>
  );

  return (
    <div className="main">
      <Header name={"Соревнования"} />
      <section>
        { role === 'admin' && <>
          <h2>Добавить спортсмена</h2>
          <div className="search-field">
            <input type="text" placeholder="Название" onChange={(event) => setName(event.target.value)} />
            <input type="text" style={{ borderRadius: '0' }} placeholder="Сезон" onChange={(event) => setSeason(event.target.value)} />
            <button className="dark-input-button">Добавить</button>
          </div>
          {message && <p>{message}</p>}
        </> }
        <br/>
        {error && <p className="error-message">{error}</p>}
        <table className="document-table">
          <thead>
            <tr>
              <th>Название соревнования</th>
              <th>Сезон</th>
              <th>Виды спорта</th>
              { role === 'admin' && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {competitions.map((competition) => (
              <tr key={competition.id}>
                <td>{competition.name}</td>
                <td>{competition.season}</td>
                <td>{competition.sports.split(',').join(', ')}</td>
                { role === 'admin' && <td>
                  <div className="actions">
                    <button className="light-button">Изменить</button>
                    <button className="light-button" onClick={() => handleDelete(competition.id)}>Удалить</button>
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

export default Competitions;
