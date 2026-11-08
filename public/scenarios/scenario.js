const cases = {
  'card-payment-dispute': {
    contacts: [
      ['Leila', 'Customer', 'What happened after you reported it?', 'I called twice. I got a case number the first time, but nobody told me when I’d hear back. I don’t always have access to the app.'],
      ['Dev', 'Support adviser', 'What can support see?', 'I can see the case number and the contact preference. I can’t see whether disputes accepted the case or who owns the next update.'],
      ['Marion', 'Disputes lead', 'What happens when disputes receive a case?', 'We check each case before accepting it. The queue shows acceptance to our team only. We could test sharing that event with support and naming the owner of the update.']
    ],
    question: 'Which change would you ask the teams to test?',
    choices: [
      ['screen', 'Add a tracker to the app', 'The app has a new screen, but it still has no reliable acceptance event or named owner. Leila may still need to call.'],
      ['handover', 'Share acceptance, name the update owner and honour the contact preference', 'Support can see when the case is accepted. Disputes own the update and can use Leila’s agreed contact route. Test whether the next update reaches her without a chase.'],
      ['script', 'Give support a clearer callback script', 'Support can explain the process more clearly. The script cannot tell the adviser who accepted the case or who will make the call.']
    ],
    evidenceGap: 'The approach is a proposal. Confirm the customer’s contact needs, what support can see and who in disputes can accept the handover before running a trial.'
  },
  'apprenticeship-start': {
    contacts: [
      ['Kemi', 'Learner', 'What have you been told about the start?', 'My manager gave me a date, so I booked time off. The provider sent me a welcome email but I can’t tell whether I’m meant to go in.'],
      ['Alia', 'Employer', 'What did your team confirm?', 'We set a date based on the intake calendar. We sent the learner’s details, but we don’t get anything back to say the provider has accepted them.'],
      ['Rob', 'Training coordinator', 'What stops you confirming the place?', 'We have one eligibility check outstanding. Our team can take responsibility for that check and send one clear confirmation to both the learner and employer when it’s done.']
    ],
    question: 'How would you prevent the next learner receiving conflicting dates?',
    choices: [
      ['calendar', 'Publish a clearer intake calendar', 'Everyone can find the intake dates. A date on the calendar still does not tell Kemi whether her place is confirmed.'],
      ['handover', 'Name the check owner and send one confirmation to both sides', 'The provider owns the outstanding check. Once it is cleared, the learner and employer get the same confirmed start date. Test that both can tell a proposed date from a confirmed one.'],
      ['reminder', 'Send more reminders to the learner', 'Kemi receives more messages, but the check is still waiting on the provider. The reminders add activity without resolving the handover.']
    ],
    evidenceGap: 'The approach is a proposal. Check what the learner understood, what the employer promised and what the provider still needs to do before testing it.'
  }
};

const host = document.getElementById('short-scenario');
const scenario = cases[host.dataset.scenario];
const heard = new Set();
let selected = null;
function render() {
  host.innerHTML = `
    <h2>Ask the people involved</h2>
    <div class="short-contacts" role="group" aria-label="People">${scenario.contacts.map(([name, role, question], index) =>
      `<button type="button" data-ask="${index}" aria-pressed="false"><strong>${name}</strong> · ${role}<br>${question}</button>`).join('')}</div>
    <p data-reply tabindex="-1" hidden></p>
    <form><fieldset><legend>${scenario.question}</legend>
      ${scenario.choices.map(([id, label]) => `<label><input type="radio" name="approach" value="${id}"> ${label}</label>`).join('')}
    </fieldset><button type="submit" data-record disabled>Record decision</button></form>
    <div data-result tabindex="-1" hidden><h3>Decision recorded</h3><p></p><button type="button" data-reset>Try again</button></div>`;
  const asks = [...host.querySelectorAll('[data-ask]')];
  const reply = host.querySelector('[data-reply]');
  const form = host.querySelector('form');
  const record = host.querySelector('[data-record]');
  const result = host.querySelector('[data-result]');
  asks.forEach((button, i) => button.onclick = () => {
    heard.add(i);
    asks.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const [name, , , answer] = scenario.contacts[i];
    reply.textContent = name + ': “' + answer + '”';
    reply.hidden = false;
    reply.focus();
  });
  form.onchange = () => { selected = new FormData(form).get('approach'); record.disabled = !selected; };
  form.onsubmit = event => {
    event.preventDefault();
    const choice = scenario.choices.find(([id]) => id === selected);
    if (!choice || !result.hidden) return;
    result.querySelector('p').textContent = choice[0] === 'handover' && heard.size !== asks.length ? scenario.evidenceGap : choice[2];
    result.hidden = false;
    form.hidden = true;
    result.focus();
  };
  result.querySelector('[data-reset]').onclick = () => {
    heard.clear();
    selected = null;
    render();
    host.querySelector('[data-ask]').focus();
  };
}
render();
