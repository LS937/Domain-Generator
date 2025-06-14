let mongoose = require('mongoose');


const domainSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    savedDomains: [String]
})

module.exports = mongoose.model('domain', domainSchema);