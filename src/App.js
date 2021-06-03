// import './App.css';
import { DataStore, Predicates } from '@aws-amplify/datastore';
import Storage from '@aws-amplify/storage';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { Course, Video } from './models';
import VideoForm from './VideoForm';



const CourseItem = ({ course, onDelete }) => {
  const { id, title, description } = course;
  return (
    <div className='courseItem' style={{ margin: '5px 0' }}>
      <div className='title' style={{ marginRight: 10 }}><strong>{title}</strong></div>
      <div className='descritpion' style={{ marginRight: 10 }}><em>{description}</em></div>
      <VideoForm courseId={id} />
      <button onClick={() => onDelete(id)}>Delete course</button>
      <br />
    </div>
  )
}

const App = () => {

  const [courses, setCourses] = useState([])
  const [videoURL, setVideoURL] = useState({}) //getting only one video for now

  const addCourse = useCallback(async () => {
    const courseInstance = new Course({
      title: window.prompt('Course title'),
      description: window.prompt('Course description'),
    });
    const course = await DataStore.save(courseInstance);
    setCourses([...courses, course])
  }, [courses])

  const deleteCourse = useCallback(async (courseId) => {
    try {
      const modelToDelete = await DataStore.query(Course, courseId);
      await DataStore.delete(modelToDelete);
    } catch (err) {
      console.log(err);
    }
  }, [])


  useEffect(() => {
    const pullData = async () => {
      try {
        const courses = await DataStore.query(Course, Predicates.ALL, { page: 0, limit: 1 })
        // const courses = await DataStore.query(Course);
        setCourses(courses)
        if (courses.length) {
          const courseVideos = await DataStore.query(Video, Predicates.ALL, { page: 0, limit: 1 })
          if (courseVideos.length) {
            const [firstVideo] = courseVideos
            const videoLink = await Storage.get(firstVideo.id)
            setVideoURL(videoLink)
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    pullData()
  }, [])

  return (
    <div className="App">
      <button onClick={addCourse}>Add course</button>
      <div className="courses">
        {courses.map(course => (
          <CourseItem key={course.id} course={course} onDelete={deleteCourse} />
        ))}
      </div>
      <video src={videoURL} controls />
    </div>
  );
}

export default withAuthenticator(App);
