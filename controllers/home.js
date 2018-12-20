/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

/*
* GET /hotel/:id
* Hotel page
*/
exports.hotel = (req, res) => {
  res.render('hotel', {
    title: 'Hotel'
  });
};
