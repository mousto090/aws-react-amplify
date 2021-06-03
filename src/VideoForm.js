
import { DataStore } from '@aws-amplify/datastore';
import Storage from '@aws-amplify/storage';
import React, { useState } from 'react'
import { Video } from './models';

const VideoForm = ({ courseId }) => {
    const [formData, setFormData] = useState({
        title: '', description: '',
        order: 0, videoFile: '',
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === 'file' ? e.target.files[0] : e.target.value
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { videoFile, ...rest } = formData
        rest.order = +rest.order;
        try {
            const videoInstance = new Video({ ...rest, courseID: courseId });
            //save the video first
            const video = await DataStore.save(videoInstance)
            //save video to s3 storage 
            await Storage.put(video.id, formData.videoFile)
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <header>Video</header>
            <input type='text' name='title' placeholder='Title' onChange={handleChange} />
            <input type='text' name='description' placeholder='Description' onChange={handleChange} />
            <input type='number' name='order' placeholder='Order' onChange={handleChange} />
            <input type='file' name='videoFile' placeholder='Video' accept='.mov,.mp4' onChange={handleChange} />
            <input type="submit" value="Add video" />
        </form>
    )
}

export default VideoForm;