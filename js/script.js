document.addEventListener('DOMContentLoaded', function () {

    const form1 = document.getElementById('earlyLeave');
    const form2 = document.getElementById('plannedLeave');

    const inputNames = ['type', 'date', 'time', 'reason', 'name', 'datePL', 'reasonPL', 'namePL'];

    function setDefaultValues(inputName, defaultValue = '') {
        const element = document.querySelector(`.form__field.field--${inputName}`);
        const storedValue = localStorage.getItem(`leave${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`);
        element.textContent = storedValue ? storedValue : defaultValue;

        element.addEventListener('input', function () {
            localStorage.setItem(`leave${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`, this.textContent);
        });
    }

    function handleFormDisplay(id) {
        if (id === 'radioEarlyLeave') {
            form1.style.display = 'block';
            form2.style.display = 'none';
        }
        else if (id === 'radioPlannedLeave') {
            form1.style.display = 'none';
            form2.style.display = 'block';
        }
    }

    inputNames.forEach(function (name) {
        if (name === 'type') {
            // Handle radio buttons
            document.querySelectorAll(`input[name="${name}"]`).forEach(function (radio) {
                radio.addEventListener('change', function () {
                    localStorage.setItem('leaveType', this.id);

                    handleFormDisplay(this.id);
                });
                const storedType = localStorage.getItem('leaveType');
                if (storedType && radio.id === storedType) {

                    radio.checked = true;

                    handleFormDisplay(storedType);
                }
            });
        } else {
            // Handle other form fields
            setDefaultValues(name);
        }
    });

});
