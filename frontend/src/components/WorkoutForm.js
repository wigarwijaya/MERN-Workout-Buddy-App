import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext()

  const [workout, setWorkout] = useState({
    title: "",
    load: "",
    reps: "",
  });
  const [error, setError] = useState(null);
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [loadIsValid, setLoadIsValid] = useState(true);
  const [repsIsValid, setRepsIsValid] = useState(true);

  const changeHandler = (event) => {
    const { name, value } = event.target;

    if (value.trim().length > 0) {
      setTitleIsValid(true);
      setLoadIsValid(true);
      setRepsIsValid(true);
    }

    setWorkout((prevWorkout) => {
      return {
        ...prevWorkout,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in')
      setWorkout({
        title: "",
        load: "",
        reps: "",
      });
      return
    }

    const { title, load, reps } = workout;

    const work = { title, load, reps };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(work),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setWorkout({
        title: "",
        load: "",
        reps: "",
      });
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
    if (title.trim().length === 0) {
      setTitleIsValid(false);
    }
    if (load.trim().length === 0) {
      setLoadIsValid(false);
    }
    if (reps.trim().length === 0) {
      setRepsIsValid(false);
      return;
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input
        type="text"
        onChange={changeHandler}
        name="title"
        value={workout.title}
        className={!titleIsValid ? "error" : undefined}
      />

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={changeHandler}
        name="load"
        value={workout.load}
        className={!loadIsValid ? "error" : undefined}
      />

      <label>Number of Reps:</label>
      <input
        type="number"
        onChange={changeHandler}
        name="reps"
        value={workout.reps}
        className={!repsIsValid ? "error" : undefined}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
