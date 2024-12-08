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
  const [sports, setSports] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [editCompetition, setEditCompetition] = useState<Competition | null>(null);
  const { role } = useSession();

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const competitionsData = await competitionService.getCompetitions();
      setCompetitions(competitionsData);
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
      setError('Не удалось загрузить соревнования');
      await sleep(1000);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const responseMessage = await competitionService.createCompetition({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        season: season.charAt(0).toUpperCase() + season.slice(1),
        sports: sports.split(',').map((sport) => (sport.trim()).charAt(0).toUpperCase() + (sport.trim()).slice(1)).join('&'),
      });
      if (responseMessage === 'Competition added successfully') {
        setMessage('Соревнование добавлено.');
        fetchCompetitions();
        await sleep(1000);
        setMessage('');
      } else {
        setError('Что-то пошло не так');
        await sleep(1000);
        setError('');
      }
    } catch (error) {
      console.error('Failed to create competition:', error);
      setError('Не удалось добавить соревнование.');
      await sleep(1000);
      setError('');
    }
  };

  const handleEditClick = (competition: Competition) => {
    setEditCompetition(competition);
  };

  const handleEditSave = async () => {
    try {
      if (!editCompetition?.name || !editCompetition?.season || !editCompetition?.sports) {
        setError('Все поля должны быть заполнены.');
        await sleep(1000);
        setError('');
        return;
      }
      const responseMessage = await competitionService.updateCompetition({
        id: editCompetition.id,
        name: editCompetition.name.charAt(0).toUpperCase() + editCompetition.name.slice(1),
        season: editCompetition.season.charAt(0).toUpperCase() + editCompetition.season.slice(1),
        sports: editCompetition.sports.split(',').map((sport) => (sport.trim()).charAt(0).toUpperCase() + (sport.trim()).slice(1)).join('&'),
      });
      setEditCompetition(null);
      setError('');
      if (responseMessage === 'Competition updated successfully') {
        setMessage('Соревнование изменено.');
        fetchCompetitions();
        await sleep(1000);
        setMessage('');
      } else {
        setError('Что-то пошло не так');
        await sleep(1000);
        setError('');
      }
    } catch (error) {
      console.error('Failed to update competition:', error);
      setError('Не удалось изменить данные соревнования.');
      await sleep(1000);
      setError('');
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
        await sleep(1000);
        setError('');
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
            <input type="text" style={{ borderRadius: '0' }} placeholder="Спорт: Футбол, Гольф, ..." onChange={(event) => setSports(event.target.value)} />
            <button className="dark-input-button" onClick={handleSubmit}>Добавить</button>
          </div>
          {message && <p style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}>{message}</p>}
          {error && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '12px' }}>{error}</p>}
        </> }
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
                <td>{competition.sports.split('&').join(', ')}</td>
                { role === 'admin' && <td>
                  <div className="actions">
                    <button className="light-button" onClick={() => handleEditClick(competition)}>Изменить</button>
                    <button className="light-button" onClick={() => handleDelete(competition.id)}>Удалить</button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
      </section>
      {editCompetition && (
       <>
         <section>
           <h2>Редактировать соревнование</h2>
           <div className="search-field">
             <input
               type="text"
               placeholder="Название"
               value={editCompetition.name}
               onChange={(e) =>
                 setEditCompetition({ ...editCompetition, name: e.target.value })
               }
             />
             <input
               type="text"
               style={{ borderRadius: '0' }}
               placeholder="Сезон"
               value={editCompetition.season}
               onChange={(e) =>
                 setEditCompetition({ ...editCompetition, season: e.target.value })
               }
             />
             <input
               type="text"
               style={{ borderRadius: '0' }}
               placeholder="Виды спорта (через запятую)"
               value={editCompetition.sports.split('&').join(', ')}
               onChange={(e) =>
                 setEditCompetition({ ...editCompetition, sports: e.target.value })
               }
             />
             <div className="actions">
               <button className="dark-input-button" onClick={handleEditSave}>
                 Сохранить
               </button>
               <button className="light-button" onClick={() => setEditCompetition(null)}>
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

export default Competitions;
