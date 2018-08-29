$(document).ready(function () {

    $(".loadingSpinner").hide();

    var showItem = [];

    var email = "";
    var password = "";
    var credential = "";
    var auth = "";
    var currentUser = "";

    var watchlist = "";
    var dataReference = "";
    var config = {
        apiKey: "AIzaSyBF0-HGi0c3tguSJlJzuqIWqCo6pEhHqyI",
        authDomain: "tv-show-website.firebaseapp.com",
        databaseURL: "https://tv-show-website.firebaseio.com",
        projectId: "tv-show-website",
        storageBucket: "tv-show-website.appspot.com",
        messagingSenderId: "617203917896"
    };

    firebase.initializeApp(config);

    var ref = firebase.database().ref("users");
    $("#loginSubmit").on("click", function () {
        event.preventDefault();
        event.stopPropagation();
        $(".loadingSpinner").show();

        var email = $("#loginEmail").val();
        var password = $("#loginPassword").val();
        var credential = firebase.auth.EmailAuthProvider.credential(email, password);
        var auth = firebase.auth();
        currentUser = auth.currentUser;

        if (!email || !password) {
            $(".loadingSpinner").hide();

            $("#loginAlerts").html("Email and Password are required.");

        }
        

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            $(".loadingSpinner").hide();

            $("#loginAlerts").html( "\n Invalid Email and Password Combination.");

        });

    });

    $("#signUp").on("click", function () {
        $("#logInWindow").modal('hide');
        event.preventDefault();
        event.stopPropagation();
        $(".loadingSpinner").show();



        var email = $("#signUpEmail").val();
        var password = $("#signUpPassword").val();
        var passwordConfirm = $("#checkSignUpPassword").val();
        if (password === passwordConfirm) {
        var credential = firebase.auth.EmailAuthProvider.credential(email, password);
        var auth = firebase.auth();
        currentUser = auth.currentUser;
        
        if (!email || !password) {
            $(".loadingSpinner").hide();

            $("#signUpAlerts").html("Email and Password Required.")

        }


        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {


        })



            .catch(function (error) {
                var errorCode = error.code;
            var errorMessage = error.message;

                $(".loadingSpinner").hide();

                // $("#signUpAlerts").html("Must be a valid Email Address.")
                $("#signUpAlerts").html("Signup Failed. " + errorMessage)





            });



        }
        else {
            $(".loadingSpinner").hide();

            $("#signUpAlerts").html("The passwords didn't match. Try again.")
        }


    });



    $("#signOut").on("click", function () {

        event.preventDefault();
        event.stopPropagation();

        firebase.auth().signOut();
        location.reload();


    });
    firebase.auth().onAuthStateChanged(function (currentUser) {
        if (currentUser) {
            $("#logInWindow").modal('hide');
            $("#signUpWindow").modal('hide');
            $(".loadingSpinner").hide();


            $("#logInButton").hide();
            $("#signUpButton").hide();
            $("#signOut").show();
           


            dataReference = currentUser.uid;
            var userID = ref.child(currentUser.uid);

            var watchID = ref.child(currentUser.uid +"/watchlist");
         

            userID.update({
                email: currentUser.email,
                uid: currentUser.uid

            });

           
            watchID.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();              
                    var showItem = childSnapshot.val().showItem;
                    $("#watchList").append("<li>" + showItem + "</li>");
              

                });
            });
        }
        else {
            $("#signOut").hide();
           

        }
    });





    $(document).on("click", "#addToWatchList", function () {
        var watchListName = localStorage.getItem("title");


        var showItem = watchListName;
        var listItem = $("<li></li>");
        listItem.append(showItem);
        $("#watchList").append(listItem);



        var watchID = ref.child(dataReference +"/watchlist");

    

            watchID.push({
                showItem: showItem,

            });

       
    });




   


});