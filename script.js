function toggleEnvelope(open) {
    const envelope = document.getElementById('sobre');
    if (open) {
        envelope.classList.add('open');
    } else {
        envelope.classList.remove('open');
    }
}
