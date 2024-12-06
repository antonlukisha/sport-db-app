import React, { useState } from 'react';
import { resultService } from '../services/ResultService';
import Header from '../components/Header';
import { useSession } from '../context/SessionContext';

const Results: React.FC = () => {
  const [athleteId, setAthleteId] = useState<number>(0);
  const [competitionId, setCompetitionId] = useState<number>(0);
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [averageResult, setAverageResult] = useState<number | null>(null);
  const [bestResult, setBestResult] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const { role } = useSession();

  const handleSubmit = async () => {
    try {
      const responseMessage = await resultService.addResult({athleteId: athleteId, competitionId: competitionId, result: result});
      setMessage(responseMessage);
    } catch (error) {
      setMessage('Не удалось добавить результат.');
    }
  };

  const handleFetchWinner = async () => {
    try {
      const data = await resultService.fetchWinner(competitionId);
      setWinner(data.winner);
    } catch {
      setWinner('Ошибка получения данных о победителе.');
    }
  };

  const handleFetchAverageResult = async () => {
    try {
      const data = await resultService.fetchAverageResult(season);
      setAverageResult(data.average_result);
    } catch {
      setAverageResult(null);
    }
  };

  const handleFetchBestResult = async () => {
    try {
      const data = await resultService.fetchBestResult(athleteId);
      setBestResult(data.best_result);
    } catch {
      setBestResult(null);
    }
  };

  return (
    <div className="main">
      <Header name="Посмотреть результаты" />
      {role === 'admin' && (
        <section style={{ marginBottom: '20px' }}>
          <h2>Добавить результат</h2>
          <div className="search-field">
            <input
              type="number"
              placeholder="ID спортсмена"
              onChange={(event) => setAthleteId(Number(event.target.value))}
            />
            <input
              type="number"
              placeholder="ID соревнования"
              onChange={(event) => setCompetitionId(Number(event.target.value))}
              style={{ borderRadius: '0' }}
            />
            <input
              type="text"
              placeholder="Результат"
              onChange={(event) => setResult(event.target.value)}
              style={{ borderRadius: '0' }}
            />
            <button onClick={handleSubmit} className="dark-input-button">
              Добавить
            </button>
          </div>
          {message && <p>{message}</p>}
        </section>
      )}
      <div className="" style={{ gap: '20px', display: 'flex', padding: '5px 50px'}}>
        <section>
          <h2>Победитель соревнования</h2>
          <div className="search-field">
            <input
              type="number"
              placeholder="ID соревнования"
              onChange={(event) => setCompetitionId(Number(event.target.value))}
            />
            <button onClick={handleFetchWinner} className="dark-input-button">
              Найти
            </button>
          </div>
          {winner && <p>Победитель: {winner}</p>}
        </section>

        <section>
          <h2>Средний результат сезона</h2>
          <div className="search-field">
            <input
              type="text"
              placeholder="Сезон"
              onChange={(event) => setSeason(event.target.value)}
            />
            <button onClick={handleFetchAverageResult} className="dark-input-button">
              Найти
            </button>
          </div>
          {averageResult !== null && <p>Средний результат: {averageResult}</p>}
        </section>

        <section>
          <h2>Лучший результат</h2>
          <div className="search-field">
            <input
              type="number"
              placeholder="ID спортсмена"
              onChange={(event) => setAthleteId(Number(event.target.value))}
            />
            <button onClick={handleFetchBestResult} className="dark-input-button">
              Найти
            </button>
          </div>
          {bestResult !== null && <p>Лучший результат: {bestResult}</p>}
        </section>
      </div>
    </div>
  );
};

export default Results;
