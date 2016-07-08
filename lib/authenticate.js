module.exports = function (req, res, next) {
  var context,
  userInSession,
  userIsAdmin,
  userPath,
  adminPath,
  homePath,
  alert,
  dateTimeStamp = new Date(Date.now());

  console.log("THIS IS REQ.PATH",req.path);

  homePath = req.path==="/"
             || req.path==="/home";

  userPath = req.path==="/"
             || req.path==="/home"
             || req.path==="/login"
             || req.path==="/signup"
             || req.path==="/logout"
             || req.path==="/login/check"
             || req.path.split("/")[1]==="products"
             || req.path==="/about";

  adminPath = req.path==="/admin"
              || req.path.split("/")[1]==="sales"
              || req.path.split("/")[1]==="products"
              || req.path.split("/")[1]==="purchases"
              || req.path.split("/")[1]==="categories"
              || req.path.split("/")[1]==="stats"
              || req.path.split("/")[1]==="graphs"
              || req.path.split("/")[1]==="suppliers"
              || req.path.split("/")[1]==="summary"
              || req.path.split("/")[1]==="users";

console.log(req.path.split("/")[1]);

  allPath = userPath || adminPath || homePath;

  userInSession = req.session.user ? true : false;
  userIsAdmin = userInSession ? req.session.user.role === 'admin' : false;
  userIsUser = userInSession ? req.session.user.role === 'user' : false;


  if (!userInSession && userPath) {
    console.log("user is not in session and trying to go to a user path");
    next();
  } else if (userInSession && (userIsAdmin || userIsUser) && userPath) {
    console.log("user is in session, is admin: ",userIsAdmin, ", is user: ",userIsUser," and is trying to go to a userPath");
    next();
  } else if ((!userInSession || (userInSession && userIsUser)) && adminPath) {
    console.log("User is not authorised to view this page");
    res.redirect('/login');
  } else if (userInSession && userIsAdmin && allPath) {
    console.log("User is in session and user is admin");
    next();
  }
};
