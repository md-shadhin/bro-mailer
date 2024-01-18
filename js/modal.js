document.addEventListener('DOMContentLoaded', function () {

    populateToCards(toPersons);
    populateCcCards(ccPersons);
    populateModal();

    const dearLabel = document.getElementById('dear')
    const dearLabelPL = document.getElementById('dearPL')

    const ccCheckboxes = document.querySelectorAll('[name="ccEmail"]');

    if (!localStorage.getItem('visited')) {
        localStorage.setItem('toEmail', 'firstToEmailRadio');
        const ccEmails = Array.from(ccCheckboxes).map(cb => cb.value);
        localStorage.setItem('ccEmails', JSON.stringify(ccEmails));
        localStorage.setItem('visited', 'true');
    }
    
    document.querySelectorAll(`input[name="toEmail"]`).forEach(function (radio) {
        radio.addEventListener('change', function () {
            localStorage.setItem('toEmail', this.id);
            const person = toPersons.find(item => item.key + "Radio" === this.id).person;
            const text = person.name.split(' ')[0];
            localStorage.setItem('toName', text);
            dearLabel.innerHTML = text;
            dearLabelPL.innerHTML = text;

        });
        const storedType = localStorage.getItem('toEmail');
        if (storedType && radio.id === storedType) {
            radio.checked = true;
            const person = toPersons.find(item => item.key + "Radio" === storedType).person;
            const text = person.name.split(' ')[0];
            localStorage.setItem('toName', text);
            dearLabel.innerHTML = text;
            dearLabelPL.innerHTML = text;
        }
    });


    // Save CC emails to local storage on checkbox change
    

    ccCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const ccEmails = Array.from(ccCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            localStorage.setItem('ccEmails', JSON.stringify(ccEmails));
        });
    });

    // Load saved CC emails from local storage
    const ccEmails = JSON.parse(localStorage.getItem('ccEmails')) || [];
    ccEmails.forEach(email => {
        const checkbox = document.querySelector(`[value="${email}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

});



function populateToCards(toPersons) {

    var container = document.getElementById('toCards');

    toPersons.forEach(function (toPerson) {

        var viewHtml = '<div class="checkbox">' +
            '<label class="checkbox-wrapper">' +
            '<input type="radio" id="' + toPerson.key + 'Radio" value="' + toPerson.person.email + '" name="toEmail" class="checkbox-input" />' +
            '<span class="checkbox-tile">' +
            '<span class="checkbox-label">' + toPerson.person.name + '</span>' +
            '</span>' +
            '</label>' +
            '</div>';


        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = viewHtml;

        container.appendChild(tempContainer.firstChild);
    });
}

function populateCcCards(ccPersons) {


    var container = document.getElementById('ccCards');

    ccPersons.forEach(function (ccPerson) {

        var viewHtml = '<div class="checkbox">' +
            '<label class="checkbox-wrapper">' +
            '<input type="checkbox" id="' + ccPerson.key + 'Checkbox" value="' + ccPerson.person.email + '" name="ccEmail" class="checkbox-input"  />' +
            '<span class="checkbox-tile">' +
            '<span class="checkbox-label">' + ccPerson.person.name + '</span>' +
            '</span>' +
            '</label>' +
            '</div>';

        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = viewHtml;

        container.appendChild(tempContainer.firstChild);
    });
}

function populateModal() {
    var modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append your existing body content to the modal content
    modalContent.appendChild(document.body.firstElementChild);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    function openModal() {
        modalOverlay.style.display = "flex";
    }

    function closeModal() {
        modalOverlay.style.display = "none";
    }


    var dearLabel = document.getElementById("dear");
    if (dearLabel) {
        dearLabel.addEventListener("click", openModal);
    }
    var dearLabelPL = document.getElementById("dearPL");
    if (dearLabelPL) {
        dearLabelPL.addEventListener("click", openModal);
    }


    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}