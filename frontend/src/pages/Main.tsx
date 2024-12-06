import React, { useState } from 'react';
import FloatingShapes from '../components/FloatingShapes';
import { testService } from '../services/TestService';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { role, setRole } = useSession();
  const navigate = useNavigate();

  const handleStart = (): void => {
    navigate('/competitions');
  };

  const toggleRole = () => {
    setRole(role === 'user' ? 'admin' : 'user');
  };

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleTestData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await testService.uploadTestData();
      setTestResponse('Успешно загруженные тестовые данные');
      await sleep(2000);
      setTestResponse('');
    } catch (error) {
      console.error('Failed to fetch test data:', error);
      setError('Не удалось загрузить тестовые данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <section className="main-container">
        <div className="main-text-section">
          <div className="main-header">
            Спортивная БД
            <span className="main-span">Агрегатор спортивных мероприятий</span>
            <div className="divider"></div>
          </div>
          <div className="main-text">
            Приложение которое поможет вам эффективно управлять спортивными мероприятиями, их участниками и результатами.
          </div>
          <button
            className="dark-button"
            style={{ fontSize: '22px' }}
            onClick={handleStart}
          >
            Начать
          </button>
          {role == 'admin' && <button
            className="light-button"
            onClick={handleTestData}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить тестовые данные'}
          </button>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {testResponse && <p style={{ color: 'green', padding: '0', margin: '0' }}>{testResponse}</p>}
        </div>
        <div className="art-container">
          <FloatingShapes />
        </div>
      </section>
      <div className="role-switcher">
        <button className="toggle-role-button" onClick={toggleRole}>
          {role === 'admin' ? 'Администратор' : 'Пользователь'}
        </button>
      </div>
    </div>
  );
};

export default Main;
