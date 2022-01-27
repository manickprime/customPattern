import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class EditModalComponent extends Component {
  @action
  editRuleUpdate() {
    var ruleName = $('#editRuleText').text();
    var updatedRegex = $('#updatedRegex').val();

    $.ajax({
      type: 'POST',
      data: { ruleName: ruleName, regex: updatedRegex },
      url: 'updateRule',
      success: function (result) {},
    });
  }
}
