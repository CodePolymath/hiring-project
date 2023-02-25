import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class CandidatesController extends Controller {
  @service store;

  @tracked showCandidateForm = false;
  @tracked statusMessage = '';

  @tracked candidateName = '';
  @tracked candidateAge = null;
  modalElements = null;

  @action
  addNew() {
    this.showCandidateForm = true;
  }

  @action
  handleKeypress(e) {
    if (e.target.getAttribute('submitonenter') && e.keyCode === 13) { // ENTER
      this.saveForm();
      return;
    }
    if ([8, 9, 37, 39, 46].includes(e.keyCode)) { // BACKSPACE, TAB, Arrows, DEL always allow
      return true;
    }

    if (e.target.getAttribute('limitnumbers') && (e.keyCode < 48 || e.keyCode > 57)) {
      e.preventDefault();
      return false;
    }
    if (e.target.getAttribute('maxlength') && e.target.value.length > parseInt(e.target.getAttribute('maxlength'), 10)) {
      e.preventDefault();
      return false;
    }
  }

  @action
  dialogOpened() {
    document.querySelector('#input-name')?.focus();
    let modal = document.querySelector('.ember-modal-dialog');
    modal.addEventListener('keydown', this.handleModalKeypress); // ember-modal-dialog does not support keyboard events
    this.modalElements = modal.querySelectorAll('input,button'); // collection of tabbable elements in the modal
  }

  @action
  dialogClosed() { // return focus to control prior to modal for a11y; clean up
    document.querySelector('.ember-modal-dialog').removeEventListener('keydown', this.handleModalKeypress); // clean up; no memory leaks
    this.modalElements = null; // clean up; no memory leaks
    this.showCandidateForm = false;
    document.getElementById('btn-add').focus({focusVisible: true});
  }

  @action
  handleModalKeypress(e) { // TAB trapping in a modal for a11y
    if (e.keyCode === 27) { // ESC
      this.cancelModal();
      e.preventDefault();
      return false;
    }
    if (e.keyCode === 9) { // TAB
      if (e.shiftKey && document.activeElement === this.modalElements[0]) {
        e.preventDefault();
        this.modalElements[this.modalElements.length - 1].focus();
      } else if (document.activeElement === this.modalElements[this.modalElements.length - 1]) {
        e.preventDefault();
        this.modalElements[0].focus();
      }
    }
  }

  @action
  cancelModal() {
    this.candidateName = '';
    this.candidateAge = null;
    this.dialogClosed();
    return false;
  }

  @action
  saveForm() {
    if (!this.candidateName) {
      alert('Please enter a Candidate Name');
      return;
    }
    if (!this.candidateAge) {
      alert('Please enter a Candidate Age');
      return;
    }
    if (this.candidateAge && parseInt(this.candidateAge, 10) < 18) {
      alert('Candidate must be at least 18');
      return;
    }
    this.showCandidateForm = false;
    this.dialogClosed();
    this.saveCandidate();
  }

  saveCandidate() {
    let newCandidate = this.store.createRecord('applicant', {
      name: this.candidateName,
      age: this.candidateAge
    });

    newCandidate.save().then((data) => {
      this.model = this.store.query('applicant', {});
      this.statusMessage = `A new candidate was created: ${data.name}, age: ${data.age}`;
      setTimeout(() => {
        this.statusMessage = '';
      }, 3000);
    }).catch(() => {
      alert('Candidate Name must be unique, please try again...');
    });

    this.candidateName = '';
    this.candidateAge = null;
  }
}
