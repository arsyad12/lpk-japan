import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = ({ sumFinish, resultQuiz, learningChapter }) => {
  const [localSumFinish, setLocalSumFinish] = useState(0);
  const [localResultQuiz, setLocalResultQuiz] = useState({ total_correct: 0, total_question: 0 });

  useEffect(() => {
    setLocalSumFinish(sumFinish);
  }, [sumFinish]);

  useEffect(() => {
    setLocalResultQuiz(resultQuiz);
  }, [resultQuiz]);

  return (
    <div className='flex gap-4 items-center justify-center'>
      <div>
        <div className="flex justify-center items-center mb-2">
          <CircularProgressbar
            className="w-24 h-24"
            value={localSumFinish ? localSumFinish : 0}
            text={localSumFinish ? `${localSumFinish.toFixed(2)}%` : '0%'}
            maxValue={learningChapter.material?.length / (learningChapter.material?.length || 1) * 100 || 0}
          />
        </div>
        <div className="flex justify-center items-center mb-4">Rangkuman</div>
      </div>
      <div>
        <div className="flex justify-center items-center mb-2">
          <CircularProgressbar className="w-24 h-24"
            value={localResultQuiz?.total_correct ? localResultQuiz?.total_correct : 0}
            text={localResultQuiz?.total_correct ? `${localResultQuiz?.total_correct * 10}%` : `0%`}
            maxValue={localResultQuiz?.total_question} />
        </div>
        <div className="flex justify-center items-center mb-4">Quiz</div>
      </div>
    </div>
  );
};

export default ProgressBar;