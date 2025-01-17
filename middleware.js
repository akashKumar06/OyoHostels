const { campgroundSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema} = require('./schemas.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = function(req, res, next){
    // console.log("req. user ...", req.user);
    // store the url they are requesting
    // console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');  
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        // console.log(error.error.details.message);
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    };
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    };
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}