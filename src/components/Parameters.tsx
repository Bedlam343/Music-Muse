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
};

const Parameters = ({ parameters, onParameterChange }: ParametersProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <select id="genre" value={parameters.genre} onChange={onParameterChange}>
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
  );
};

export default Parameters;
