// Reqiure the model
// This is a different way to export the model
// Still works but just a bit weird
const { CAT, model } = require('../models/event');

// Returns all events: /events/allEvents
exports.index = (req, res) => {
    let CATegories = CAT();

    model.find()
    .then(events => res.render('../views/event/allEvents', {events, CATegories}))
    .catch(err => console.log(err.message));
};

// Returns a form for creating a new event: /events/new
exports.new = (req, res) => {
    let CATegories = CAT();
    res.render('../views/event/newEvent', {CATegories});
};

// Creates a new event: /events
exports.create = (req, res, next) => {
    let event = new model(req.body);
    let image = '/images/' + req.file.filename;
    event.image = image;
    event.save()
    .then((event) => res.redirect('/events'))
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

// Shows a specific event: /events/:id
exports.show = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 404;
        return next(err);
    }
    model.findById(id)
    .then(event => {
        if(event) {
            // Format the start date and time
            const startDateTime = new Date(event.startDateTime);
            const formattedStart = startDateTime.toLocaleString('en-US', { month: '2-digit', 
            day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

            // Formate the end date and time
            const endDateTime = new Date(event.endDateTime);
            const formattedEnd = endDateTime.toLocaleString('en-US', { month: '2-digit', 
            day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

            res.render('../views/event/event', {event , formattedStart, formattedEnd});
        } else {
            let err = new Error('Cannot locate event with id of ' + req.url);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

// Returns a form for editing a specific event: /events/:id/edit
exports.edit = (req, res, next) => {
    let id = req.params.id;
    let CATegories = CAT();
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
    .then(event => {
        if(event) {
            // Format the start date and time
            const startDateTime = new Date(event.startDateTime);
            const formattedStart = startDateTime.toISOString().slice(0, 16);

            // Formate the end date and time
            const endDateTime = new Date(event.endDateTime);
            const formattedEnd = endDateTime.toISOString().slice(0, 16);

            res.render('./event/editEvent', {event, CATegories, formattedStart, formattedEnd});
        } else {
            let err = new Error('Cannot locate event with id ' + req.url);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

// Updates a specific event: /events/:id
exports.update = (req, res, next) => {
    let id = req.params.id;
    let event = req.body;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        // Sets the image path to path and filename
        if(req.file) {
            let image = '/images/' + req.file.filename;
            event.image = image;
        } else {
            delete req.body.image;
        }

        if(event) {
            res.redirect('/events/' + id);
        } else {
            let err = new Error('Cannot locate event with id ' + req.url);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

// Deletes a specific event: /events/:id
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
        if(event) {
            res.redirect('/events');
        } else {
            let err = new Error('Cannot locate event with id ' + req.url);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};