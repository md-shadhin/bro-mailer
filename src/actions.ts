import { toPersons } from "./config.dev";
import Swal from 'sweetalert2'

export async function sendEmail(type: string, body: string | null) {

    Swal.fire({
        title: 'Sending Email...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    })

    let fromField = 'From: ';

    try {
        const peopleResponse = await window.gapi.client.people.people.get({
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
        console.log(e);
        fromField += 'me\r\n';
    }

    const toPerson = toPersons.find(item => item.key + "Radio" === localStorage.getItem('toEmail'))?.person;
    const toField = `To: ${toPerson?.name} <${toPerson?.email}>\r\n`;

    const cc = `Cc: ${JSON.parse(localStorage.getItem('ccEmails') || '').join()}\r\n`;

    let subject = 'Subject: Request for Early Leave\r\n';

    if (type === 'PL') {
        subject = 'Subject: Request for Planned Leave\r\n';
    }

    const mime = 'MIME-Version: 1.0\r\n';
    const contentType = 'Content-Type: text/html; charset=utf-8\r\n\r\n';

    const fullEmail = `${fromField}${toField}${cc}${subject}${mime}${contentType}${body}`;

    // alert(fullEmail); return;

    const base64EncodedEmail = btoa(fullEmail);

    try {
        const res = await window.gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': {
                'raw': base64EncodedEmail
            }
        });
        if (res.status === 200) {
            // alert('Email sent successfully!');

            Swal.fire({
                title: 'Email sent successfully!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            });
        }
        else {
            // alert('Email could not send!');

            Swal.fire({
                title: 'Email could not send!',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000
            });
        }

    }
    catch (e: any) {
        // alert('Error sending email: ' + e.result.error.message)

        Swal.fire({
            title: 'Error sending email: ' + e.result.error.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
        });
    }

}