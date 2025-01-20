import { ChangeEvent } from 'react';
import {
  Parameters as ParametersType,
  Genre,
  TimeOfDay,
  Mood,
  Activity,
} from 'src/utils/types';

type ParametersProps = {
  parameters: ParametersType;
  onParameterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onRecommend: () => void;
};

const Parameters = ({
  parameters,
  onParameterChange,
  onRecommend,
}: ParametersProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-stone-400 text-lg mb-[20px]">
        Tune Parameters and Go!
      </p>

      <div className="flex flex-col gap-[20px]">
        <select
          id="genre"
          value={parameters.genre}
          onChange={onParameterChange}
        >
          {Object.keys(Genre).map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
        <select
          id="timeOfDay"
          value={parameters.timeOfDay}
          onChange={onParameterChange}
        >
          {Object.keys(TimeOfDay).map((timeOfDay) => (
            <option key={timeOfDay}>{timeOfDay}</option>
          ))}
        </select>
        <select id="mood" value={parameters.mood} onChange={onParameterChange}>
          {Object.keys(Mood).map((mood) => (
            <option key={mood}>{mood}</option>
          ))}
        </select>
        <select
          id="activity"
          value={parameters.activity}
          onChange={onParameterChange}
        >
          {Object.keys(Activity).map((activity) => (
            <option key={activity}>{activity}</option>
          ))}
        </select>
      </div>

      <div className="w-full flex justify-center mt-[30px]">
        <button
          onClick={onRecommend}
          className="hover:cursor-pointer border-2 border-stone-400 rounded-md 
          px-2 py-1"
        >
          <p className="text-stone-300">Recommend</p>
        </button>
      </div>
    </div>
  );
};

export default Parameters;
