import React, { useEffect, useState } from 'react';
import { toPersons, ccPersons } from '../config.dev';

interface EmailModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    setDearLabelValue: (value?: string) => void;
}

const EmailModal: React.FC<EmailModalProps> = (props) => {

    const [selectedToEmail, setSelectedToEmail] = useState<string>(localStorage.getItem('toEmail') || 'firstToEmailRadio');


    const [selectedCcEmails, setSelectedCcEmails] = useState<string[]>(() => {
        const storedData = localStorage.getItem('ccEmails');
        return storedData ? JSON.parse(storedData) : Array.from(ccPersons).map(cb => cb.person.email);
    });


    useEffect(() => {

        localStorage.setItem('toEmail', selectedToEmail);
        const person = toPersons.find((item) => item.key + 'Radio' === selectedToEmail)?.person;
        const text = person?.name.split(' ')[0];
        localStorage.setItem('toName', text || '');
        props.setDearLabelValue(text);

    }, [selectedToEmail]);

    useEffect(() => {

        localStorage.setItem('ccEmails', JSON.stringify(selectedCcEmails));
    }, [selectedCcEmails]);

    const handleToEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedToEmail(event.target.id);
        const person = toPersons.find((item) => item.key + 'Radio' === event.target.id)?.person;
        const text = person?.name.split(' ')[0];
        localStorage.setItem('toName', text || '');
        props.setDearLabelValue(text);
    };

    const handleCcEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCc = event.target.value;
        setSelectedCcEmails((prevSelectedCcEmails) => {
            if (prevSelectedCcEmails.includes(selectedCc)) {
                return prevSelectedCcEmails.filter((email) => email !== selectedCc);
            } else {
                return [...prevSelectedCcEmails, selectedCc];
            }
        });
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            props.closeModal();
        }
    };

    return (
        <div className='modal-overlay' style={{ display: props.isModalOpen ? 'flex' : 'none' }}
            onClick={handleOverlayClick}>
            <div className='modal-content'>
                <div id="modal">
                    <fieldset id="toCards" className="checkbox-group">
                        <legend className="checkbox-group-legend">To</legend>
                        {toPersons.map((toPerson) => (
                            <div key={toPerson.key} className="checkbox">
                                <label className="checkbox-wrapper">
                                    <input
                                        type="radio"
                                        id={toPerson.key + 'Radio'}
                                        value={toPerson.person.email}
                                        name="toEmail"
                                        className="checkbox-input"
                                        checked={selectedToEmail === toPerson.key + 'Radio'}
                                        onChange={handleToEmailChange}
                                    />
                                    <span className="checkbox-tile">
                                        <span className="checkbox-label">{toPerson.person.name}</span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset id="ccCards" className="checkbox-group">
                        <legend className="checkbox-group-legend">CC</legend>
                        {ccPersons.map((ccPerson) => (
                            <div key={ccPerson.key} className="checkbox">
                                <label className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        id={ccPerson.key + 'Checkbox'}
                                        value={ccPerson.person.email}
                                        name="ccEmail"
                                        className="checkbox-input"
                                        checked={selectedCcEmails.includes(ccPerson.person.email)}
                                        onChange={handleCcEmailChange}
                                    />
                                    <span className="checkbox-tile">
                                        <span className="checkbox-label">{ccPerson.person.name}</span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </fieldset>
                </div>
            </div>
        </div>

    );
};

export default EmailModal;
