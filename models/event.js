const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CATegories = ['Cat Related Events', 'Cat & Human Help Events', 'Cat Exclusive Events', 'Cat & Dog Events', 'Other'];

const eventSchema = new Schema({
    hostName: { type: String, required: [true, 'Host name is required']},
    title: { type: String, required: [true, 'Title is required']},
    category: { type: String, 
                required: [true, 'Category is required'],
                enum: ['Cat Related Events', 'Cat & Human Help Events',
                       'Cat Exclusive Events', 'Cat & Dog Events', 'Other']},
    location: { type: String, required: [true, 'Location is required']},
    startDateTime: { type: Date},
    endDateTime: { type: Date},
    details: { type: String, required: [true, 'Details are required']},
    image: { type: String }
},
{timestamps: true}
);

module.exports = {
    CAT: () => CATegories,
    model: mongoose.model('Event', eventSchema)
}