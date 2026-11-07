/* Valluvan Kudil — enquiry form helpers.
   - single-select service chips (Thoppu Virundhu / Catering / Industrial Food Services)
   - context hint, labels, group-size minimum (6 for Thoppu Virundhu) and date rules per service
   - guest stepper and past-date guard
   Runs alongside main.js; it does not replace its WhatsApp submit handler. */
(function () {
    var form = document.querySelector('.vk-form');
    if (!form) return;

    var typeInput  = form.querySelector('#reg-type');
    var chips      = form.querySelectorAll('.vk-chip');
    var hint       = form.querySelector('#vkTypeHint');
    var dateInput  = form.querySelector('#reg-date');
    var dateLabel  = form.querySelector('#vkDateLabel');
    var guests     = form.querySelector('#reg-guests');
    var guestLabel = form.querySelector('#vkGuestLabel');
    var notes      = form.querySelector('#reg-activities');
    var notesLabel = form.querySelector('#vkNotesLabel');

    var CONFIG = {
        thoppu: {
            hint: 'Share your preferred date and group size (minimum 6) for a family outing, friends\u2019 gathering or corporate team experience. Pre-booking is required \u2014 order a day ahead for a fresh feast.',
            date: 'Preferred Date', dateRequired: true,
            guests: 'Group Size', min: 6, start: 6,
            notes: 'Menu preference (chicken, mutton, sea food), occasion, special requests...'
        },
        catering: {
            hint: 'Tell us the occasion, number of guests and preferred menu style.',
            date: 'Event Date', dateRequired: true,
            guests: 'Number of Guests', min: 1, start: 25,
            notes: 'Occasion, menu style (vegetarian / non-vegetarian / regional), live counters, dietary needs...'
        },
        industrial: {
            hint: 'Share your location, employee strength and service requirements for managed kitchen, cafeteria or daily meal services.',
            date: 'Preferred Start Date', dateRequired: false,
            guests: 'Employee Strength', min: 1, start: 100,
            notes: 'Location, meals needed (breakfast, lunch, dinner, snacks), menu type, on-site kitchen or delivery...'
        }
    };

    function currentKey() {
        var sel = form.querySelector('.vk-chip.is-selected');
        return sel ? sel.dataset.key : 'thoppu';
    }

    function applyType(key, resetValues) {
        var c = CONFIG[key];
        hint.textContent = c.hint;
        dateLabel.textContent = c.date;
        dateInput.required = c.dateRequired;
        guestLabel.textContent = c.guests;
        guests.min = c.min;
        guests.placeholder = c.start;
        if (resetValues || !guests.value || parseInt(guests.value, 10) < c.min) guests.value = c.start;
        notes.placeholder = c.notes;
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) {
                c.classList.remove('is-selected');
                c.setAttribute('aria-pressed', 'false');
            });
            chip.classList.add('is-selected');
            chip.setAttribute('aria-pressed', 'true');
            typeInput.value = chip.dataset.value;
            applyType(chip.dataset.key, true);
        });
    });

    // Prevent past dates
    if (dateInput) {
        var d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        dateInput.min = d.toISOString().slice(0, 10);
    }

    // Guest stepper
    form.querySelectorAll('.vk-step').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var min = CONFIG[currentKey()].min;
            var next = (parseInt(guests.value, 10) || min) + parseInt(btn.dataset.step, 10);
            guests.value = Math.max(min, Math.min(5000, next));
        });
    });

    applyType(currentKey(), true);
})();
