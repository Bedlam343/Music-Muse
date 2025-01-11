import { ChangeEvent, useState } from 'react';
import { Parameters, Genre, TimeOfDay, Mood, Activity } from 'src/utils/types';

const DEFAULT_PARAMETERS: Parameters = {
  genre: Genre['Hip-Hop'],
  timeOfDay: TimeOfDay.Morning,
  mood: Mood.Energetic,
  activity: Activity.Workout,
} as const;

function App() {
  const [parameters, setParameters] = useState<Parameters>({
    ...DEFAULT_PARAMETERS,
  });

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parameter = event.target.id as keyof Parameters;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [parameter]: event.target.value,
    }));
  };

  const handleRecommend = async () => {};

  return (
    <div className="py-[10px] flex flex-col items-center">
      <p className="text-4xl text-center">Music Muse</p>

      <div className="mt-[40px] flex flex-col gap-[50px]">
        <div className="flex flex-col gap-[20px]">
          <select
            id="genre"
            value={parameters.genre}
            onChange={handleParameterChange}
          >
            {Object.keys(Genre).map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
          <select
            id="timeOfDay"
            value={parameters.timeOfDay}
            onChange={handleParameterChange}
          >
            {Object.keys(TimeOfDay).map((timeOfDay) => (
              <option key={timeOfDay}>{timeOfDay}</option>
            ))}
          </select>
          <select
            id="mood"
            value={parameters.mood}
            onChange={handleParameterChange}
          >
            {Object.keys(Mood).map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <select
            id="activity"
            value={parameters.activity}
            onChange={handleParameterChange}
          >
            {Object.keys(Activity).map((activity) => (
              <option key={activity}>{activity}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRecommend}
          className="hover:cursor-pointer border-2 border-black rounded-md px-2 py-1"
        >
          Recommend
        </button>
      </div>
    </div>
  );
}

export default App;
