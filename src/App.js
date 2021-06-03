// import './App.css';
import { DataStore } from '@aws-amplify/datastore';
import { useCallback, useEffect } from 'react';
import { Course } from './models';



const App = () => {

  const addCourse = useCallback(async () => {
    const course = new Course({
      title: "Course 1",
      description: "Course 1 description",
      // "videos": []
    });
    return await DataStore.save(course);
  }, [])


  useEffect(() => {
    const getCourses = async () => {
      const courses = await DataStore.query(Course);
      console.log(courses);
    }
    getCourses()
  }, [])

  return (
    <div className="App">
      <button onClick={addCourse}>Add course</button>

    </div>
  );
}

export default App;
