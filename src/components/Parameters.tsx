import { ChangeEvent } from 'react';
import {
  Parameters as ParametersType,
  Genre,
  TimeOfDay,
  Mood,
  Activity,
} from 'src/utils/types';
import Select from 'src/components/Select';

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
      <p
        className="text-stone-300 border-b-[1px] border-spotifyGreen 
        text-[18px] mb-[25px]"
      >
        Parameters
      </p>

      <div className="flex flex-col gap-[20px] w-[300px]">
        <Select
          value={parameters.genre}
          onChange={onParameterChange}
          id="genre"
          label="Genre"
          options={Object.keys(Genre)}
        />

        <Select
          value={parameters.timeOfDay}
          onChange={onParameterChange}
          id="timeOfDay"
          label="Time of Day"
          options={Object.keys(TimeOfDay)}
        />

        <Select
          value={parameters.mood}
          onChange={onParameterChange}
          id="mood"
          label="Mood"
          options={Object.keys(Mood)}
        />

        <Select
          value={parameters.activity}
          onChange={onParameterChange}
          id="activity"
          label="Activity"
          options={Object.keys(Activity)}
        />
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
