import React, { useEffect } from 'react';
import Swal from 'sweetalert2'

interface LeaveFormProps {
    openModal: () => void;
    dearLabel: string | undefined;
    selectedType: string;
    handleAuthClick: (type: string, body: string | null) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = (props) => {

    const form1 = document.getElementById('earlyLeave');
    const form2 = document.getElementById('plannedLeave');


    useEffect(() => {
        const id = props.selectedType;
        if (id === 'radioEarlyLeave') {
            if (form1) form1.style.display = 'block';
            if (form2) form2.style.display = 'none';
        } else if (id === 'radioPlannedLeave') {
            if (form1) form1.style.display = 'none';
            if (form2) form2.style.display = 'block';
        }
    }, [props.selectedType, form1, form2]);

    const setDefaultValues = (inputName: string, defaultValue = '') => {
        const element = document.querySelector(`.form__field.field--${inputName}`);
        const storedValue = localStorage.getItem(`leave${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`);
        if (element instanceof HTMLElement) {
            element.textContent = storedValue ? storedValue : defaultValue;

            element.addEventListener('input', function () {
                localStorage.setItem(`leave${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`, this.textContent || '');
            });
        }
    }

    useEffect(() => {

        const inputNames = ['date', 'time', 'reason', 'name', 'datePL', 'reasonPL', 'namePL'];

        inputNames.forEach((name) => {
            setDefaultValues(name);
        });
    }, []);

    const prepareEarlyLeaveMailText = () => {

        var dear = localStorage.getItem('toName');
        var date = localStorage.getItem('leaveDate') || '';
        var time = localStorage.getItem('leaveTime') || '';
        var reason = localStorage.getItem('leaveReason') || '';
        var name = localStorage.getItem('leaveName') || '';

        if (date === '' || time === '' || reason === '' || name === '') {
            // alert('Please fill in all required fields.');

            Swal.fire({
                title: 'Please fill in all required fields.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2000
            });
            return null;
        }


        var emailText = '<p>Dear ' + dear + ' Bhai,<br/>' +
            '<br/>I trust this message finds you well. I am writing to request your approval for an early leave on <b>' + date + '</b> at <b>' + time + '</b> due to <b>' + reason + '</b>. I have ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure.' +
            '<br/><br/>I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this further if necessary.' +
            '<br/><br/>Best Regards,<br/>' + name + '</p>';



        return emailText;
    }

    const preparePlannedLeaveMailText = () => {

        var dear = localStorage.getItem('toName');
        var date = localStorage.getItem('leaveDatePL') || '';
        var reason = localStorage.getItem('leaveReasonPL') || '';
        var name = localStorage.getItem('leaveNamePL') || '';

        if (date === '' || reason === '' || name === '') {
            // alert('Please fill in all required fields.');

            Swal.fire({
                title: 'Please fill in all required fields.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2000
            });
            return null;
        }

        var emailText = "<p>Dear " + dear + " Bhai,<br/>" +
            "<br/>I trust this message finds you well. I am writing to request your approval for a planned leave on <b>" + date + "</b> due to <b>" + reason + "</b>. I have ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure." +
            "<br/><br/>I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this further if necessary." +
            "<br/><br/>Best Regards,<br/>" + name + "</p>";

        return emailText;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (event.currentTarget.id === 'earlyLeave') {
            const prepareEarlyLeaveMailBody = prepareEarlyLeaveMailText();
            prepareEarlyLeaveMailBody && props.handleAuthClick('EL', prepareEarlyLeaveMailBody);
        }
        else if (event.currentTarget.id === 'plannedLeave') {
            const preparePlannedLeaveMailBody = preparePlannedLeaveMailText();
            preparePlannedLeaveMailBody && props.handleAuthClick('PL', preparePlannedLeaveMailBody);
        }

    };

    const handleToClick = (event: React.MouseEvent<HTMLDivElement>) => {
        props.openModal();
    };

    return (
        <div>
            <form id="earlyLeave" className="form__contact" onSubmit={handleSubmit}>
                <fieldset>
                    <p>
                        Dear [<span className="form__field field--dear" id="dear" onClick={handleToClick}>{props.dearLabel}</span>] Bhai,
                    </p>
                    <p>
                        I trust this message finds you well. I am writing to request your approval for an early leave on{' '}
                        <span className="form__field field--date" data-placeholder="[date]" tabIndex={1} contentEditable></span> at{' '}
                        <span className="form__field field--time" data-placeholder="[time]" tabIndex={2} contentEditable></span> due to{' '}
                        <span className="form__field field--reason" data-placeholder="[mention the reason]" tabIndex={3} contentEditable></span>. I have
                        ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure.
                    </p>
                    <p>
                        I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this
                        further if necessary.
                    </p>
                    <p>
                        Best Regards,<br />
                        <span className="form__field field--name" data-placeholder="[Engineer Name]" tabIndex={4} contentEditable></span>
                    </p>
                    <button type="submit" className="button button--xlarge" tabIndex={5}>
                        Send Email &#187;
                    </button>
                </fieldset>
            </form>

            <form id="plannedLeave" style={{ display: "none" }} className="form__contact" onSubmit={handleSubmit}>

                <fieldset>
                    <p>
                        Dear [<span className="form__field field--dearPL" id="dearPL" onClick={handleToClick}>{props.dearLabel}</span>] Bhai,
                    </p>
                    <p>
                        I trust this message finds you well. I am writing to request your approval for a planned leave on{' '}
                        <span className="form__field field--datePL" data-placeholder="[date]" tabIndex={1} contentEditable></span> due to{' '}
                        <span className="form__field field--reasonPL" data-placeholder="[mention the reason]" tabIndex={2} contentEditable></span>. I have
                        ensured that all my pending tasks are up to date, and I will make sure to complete any outstanding work before my departure.
                    </p>
                    <p>
                        I appreciate your understanding and consideration of this request. I look forward to your approval and am willing to discuss this
                        further if necessary.
                    </p>
                    <p>
                        Best Regards,<br />
                        <span className="form__field field--namePL" data-placeholder="[Engineer Name]" tabIndex={3} contentEditable></span>
                    </p>
                    <button type="submit" className="button button--xlarge" tabIndex={4}>
                        Send Email &#187;
                    </button>
                </fieldset>
            </form>
        </div>

    );
};

export default LeaveForm;
