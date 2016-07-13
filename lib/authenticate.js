module.exports = function (req, res, next) {
  var context,
  userRole,
  userInSession,
  userIsAdmin,
  userIsSuper,
  userPath,
  superAdminPath,
  generalAdminPath,
  homePath,
  route,
  subroute,
  path,
  superpath,
  alert,
  dateTimeStamp = new Date(Date.now());

  console.log("THIS IS REQ.PATH",req.path);


  userInSession = req.session.user ? true : false;
  userRole = userInSession ? req.session.user.role : null;
  userIsAdmin = userInSession ? userRole === 'admin' : false;
  userIsUser = userInSession ? userRole === 'user' : false;
  userIsSuper = userInSession ? req.session.user.superuser : null;
  console.log("IS USER SUPER? ", userIsSuper);
  const superPaths = ["edit", "add", "delete", "update"];

  route = req.path.split("/")[1];
  path = req.path;
  console.log("THIS IS REQ PATH SPLIT", req.path.split("/"));
  subroute = req.path.split("/")[2];
  console.log("THIS IS ROUTE: ", route);
  console.log("THIS IS SUBROUTE: ", subroute);
  superpath = superPaths.indexOf(subroute)!==-1;

  homePath = req.path==="/"
             || req.path==="/home";

  userPath = path==="/login"
             || path==="/signup"
             || path==="/logout"
             || path==="/login/check"
             || route==="products"
             || path==="/about";


  superAdminPath = route==="sales" && superpath
                || route==="products" && superpath
                || route==="purchases" && superpath
                || route==="categories" && superpath
                || route==="suppliers" && superpath
                || route==="users" && superpath;

  generalAdminPath = path==="/admin"
                    || path==="/sales"
                    || path==="/categories"
                    || path==="/products"
                    || path==="/purchases"
                    || path==="/suppliers"
                    || path==="/users"
                    || route==="stats"
                    || route==="graphs"
                    || route==="summary";


  var anyAdminPath = generalAdminPath || superAdminPath;
  console.log(req.path.split("/")[1]);

  allPath = generalAdminPath || superAdminPath || userPath || homePath;

  if ((!userInSession || userIsUser) && (userPath || homePath)) {
    console.log("user is not in session and trying to go to a user path");
    next();
  } else if (userIsUser && anyAdminPath) {
    console.log("User is not authorised to view this page");
    res.redirect('/login');
  } else if (userIsAdmin && !userIsSuper && superAdminPath) {
    console.log("This user is admin and attempting to access a superuser path, but is not a superuser");
    res.redirect('/'+route);
  } else if (userIsAdmin && !userIsSuper && (userPath || homePath || generalAdminPath)) {
    console.log("User is admin, but not a superuser")
    next();
  } else if (userIsSuper) {
    console.log("User is in session and user is admin and a superuser");
    next();
  }
};
