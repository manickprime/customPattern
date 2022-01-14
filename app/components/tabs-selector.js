import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TabsSelectorComponent extends Component {
    @action
    changeToConstraint() {
        $('#constraint').show();
        $('#report').hide();
        var element = document.getElementById('constraintNavID');
        element.classList.add('active');
        element = document.getElementById('reportNavID');
        element.classList.remove('active');
    }

    @action
    changeToReport() {
        $('#constraint').hide();
        $('#report').show();

        var element = document.getElementById('reportNavID');
        element.classList.add('active');
        element = document.getElementById('constraintNavID');
        element.classList.remove('active');
    }
}
