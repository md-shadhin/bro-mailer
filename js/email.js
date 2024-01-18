// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    // 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
    'https://people.googleapis.com/$discovery/rest?version=v1'
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.send ' +
    'https://www.googleapis.com/auth/userinfo.profile ' +
    'https://www.googleapis.com/auth/userinfo.email ';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// document.getElementById('authorize_button').style.visibility = 'hidden';
// document.getElementById('signout_button').style.visibility = 'hidden';

document.getElementById('earlyLeave').addEventListener('submit', function (event) {
    event.preventDefault();

    handleAuthClick('EL');
    // alert(prepareEarlyLeaveMailText());
});

document.getElementById('plannedLeave').addEventListener('submit', function (event) {
    event.preventDefault();

    handleAuthClick('PL');
    // alert(preparePlannedLeaveMailText());
});


/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: '<API_KEY>',
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '<CLIENT_ID>',
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        // document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(type) {

    let body = null;

    if (type === 'EL') {
        body = prepareEarlyLeaveMailText();
    }
    else if (type === 'PL') {
        body = preparePlannedLeaveMailText();
    }

    if (body === null) {
        return;
    }

    //alert(body); return;

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        // document.getElementById('signout_button').style.visibility = 'visible';

        await sendEmail(type, body);
    };

    // if (gapi.client.getToken() === null) {
    //     tokenClient.requestAccessToken({ prompt: 'consent' });
    // } else {
    tokenClient.requestAccessToken({ prompt: '' });
    // }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        // document.getElementById('content').innerText = '';
        // document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function sendEmail(type, body) {


    let fromField = 'From: ';

    try {
        const peopleResponse = await gapi.client.people.people.get({
            'resourceName': 'people/me',
            'personFields': 'names,emailAddresses'
        });

        // console.log(peopleResponse);

        if (peopleResponse.result) {
            const userName = peopleResponse.result.names && peopleResponse.result.names.length > 0 ? peopleResponse.result.names[0].displayName : '';
            const userEmail = peopleResponse.result.emailAddresses && peopleResponse.result.emailAddresses.length > 0 ? peopleResponse.result.emailAddresses[0].value : '';

            fromField += `${userName} <${userEmail}>\r\n`;
        }
    }
    catch (e) {
        //console.log(e);
        fromField += 'me\r\n';
    }

    const toPerson = toPersons.find(item => item.key + "Radio" === localStorage.getItem('toEmail')).person;
    const toField = `To: ${toPerson.name} <${toPerson.email}>\r\n`;

    const cc = `Cc: ${JSON.parse(localStorage.getItem('ccEmails')).join()}\r\n`;

    let subject = 'Subject: Request for Early Leave\r\n';

    if (type === 'PL') {
        subject = 'Subject: Request for Planned Leave\r\n';
    }

    const mime = 'MIME-Version: 1.0\r\n';
    const contentType = 'Content-Type: text/html; charset=utf-8\r\n\r\n';

    const fullEmail = `${fromField}${toField}${cc}${subject}${mime}${contentType}${body}`;

    // swal(fullEmail); return;

    const base64EncodedEmail = btoa(fullEmail);

    try {
        const res = await gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': {
                'raw': base64EncodedEmail
            }
        });
        if (res.status === 200) {
            // alert('Email sent successfully!');
            swal("", "Email sent successfully!", "success", {
                buttons: false,
                timer: 2000,
            });
        }
        else {
            // alert('Email could not send!');
            swal("", "Email could not send!", "error", {
                buttons: false,
                timer: 2000,
            });
        }

    }
    catch (e) {
        // alert('Error sending email: ' + e.result.error.message)
        swal("", "Error sending email: " + e.result.error.message, "error", {
            buttons: false,
            timer: 2000,
        });
    }

}

function prepareEarlyLeaveMailText() {

    var dear = localStorage.getItem('toName');
    var date = localStorage.getItem('leaveDate');
    var time = localStorage.getItem('leaveTime');
    var reason = localStorage.getItem('leaveReason');
    var name = localStorage.getItem('leaveName');

    if (date === null || time === null || reason === null || name === null) {
        // alert('Please fill in all required fields.');
        swal("", "Please fill in all required fields.", "warning", {
            buttons: false,
            timer: 2000,
        });
        return null;
    }


    var emailText = '<p>Dear ' + dear + ' Bhai,<br/>' +
        '<br/>I trust this message finds you well. I am writing to request your approval for an early leave on <b>' + date + '</b> at <b>' + time + '</b> due to <b>' + reason + '</b>. I have ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure.' +
        '<br/><br/>I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this further if necessary.' +
        '<br/><br/>Best Regards,<br/>' + name + '</p>';



    return emailText;
}

function preparePlannedLeaveMailText() {

    var dear = localStorage.getItem('toName');
    var date = localStorage.getItem('leaveDatePL');
    var reason = localStorage.getItem('leaveReasonPL');
    var name = localStorage.getItem('leaveNamePL');

    if (date === null || reason === null || name === null) {
        // alert('Please fill in all required fields.');
        swal("", "Please fill in all required fields.", "warning", {
            buttons: false,
            timer: 2000,
        });
        return null;
    }

    var emailText = "<p>Dear " + dear + " Bhai,<br/>" +
        "<br/>I trust this message finds you well. I am writing to request your approval for a planned leave on <b>" + date + "</b> due to <b>" + reason + "</b>. I have ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure." +
        "<br/><br/>I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this further if necessary." +
        "<br/><br/>Best Regards,<br/>" + name + "</p>";

    return emailText;
}