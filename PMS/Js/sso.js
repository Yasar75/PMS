function axOffice365SessionInit() {
    var msalConfig = {
        auth: {
            clientId: office365clientKey,// "bfff8cad-3c1c-4c14-9499-2423c724f3b7",
            redirectUri: ssoredirecturl,// "http://localhost:56647/",
        },
        cache: {
            cacheLocation: "sessionStorage",                // This configures where your cache will be stored
            storeAuthStateInCookie: false,                 // Set this to "true" if you are having issues on IE11 or Edge
        }
    };

    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    var myMSALObj = new Msal.UserAgentApplication(msalConfig);
    window["myMSALObj"] = myMSALObj;
}

function axOffice365SessionValidate() {
    if (findGetParameter("msg")) {
        myMSALObj.logout();
    } else if (userData = myMSALObj.getAccount()) {
        var userid = userData.userName;  // user email-id
        var username = userData.idToken.tid;   //  user name
        office365SsoFinalise(username, userid)
    }
}


function axOffice365Login() {
    return true;//if multiple logins are to be enabled with multiple buttons, separate function example:`ssoLogin` to be created with exact logic as expected in axPrivateSsoLogin and referred in new button(created from axPrivateSsoSessionInit function) as example:`onclick="ssoLogin();return false;"` and axPrivateSsoLogin should only `return true;`.
}

function ssoLogin() {
    var loginRequest = {
        scopes: ["openid", "profile", "User.Read"]
    };
    myMSALObj.loginPopup(loginRequest)
        .then(loginResponse => {
            axOffice365SessionValidate();
        }).catch(error => {
            showAlertDialog("error", error);
        });
}

function axOffice365LogOut() {
    myMSALObj.logout();
}

//Okta SSO Authentication

function axOktaSessionInit() {
    var authClient = new OktaAuth({
        url: oktadomain, //'https://dev-515805.okta.com',
        clientId: oktaclientKey,//'0oacsbt8oZl24CEmQ4x6',
        redirectUri: ssoredirecturl// "http://localhost:56647/"
    });
    window["authClient"] = authClient;
}

function axOktaSessionValidate() {
    authClient.session.get().then(
        function (res) {
            // Session exists, show logged in state.
            if (findGetParameter("msg")) {
                authClient.session.close();
            } else if (res.status === 'ACTIVE') {
                oktaSsoFinalise(res.userId, res.login);
                return;
            }
        }
    );
}

function axOktaLogin() {
    if (typeof signedin != "undefined")
        localStorage.setItem("staySignedIn", signedin.checked);
    else
        localStorage.setItem("staySignedIn", "false");
    authClient.signIn({ username: axUserName.value, password: axPassword.value })
    .then(res => {
        if (res.status === 'SUCCESS') {
            authClient.session.setCookieAndRedirect(res.sessionToken, window.location.origin);
        }
    }).fail(function (err) {
        showAlertDialog("error", err.message);
    });
}

function axOktaLogOut() {
    authClient.session.close();
}
