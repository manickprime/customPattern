import Component from '@glimmer/component';
import { action } from '@ember/object';

var tempFieldId = 0;
var elements = document.getElementsByClassName('hoverButton');

document.addEventListener('mouseup', (event) => {
  if (window.getSelection().toString().length) {
    console.log(window.getSelection().toString());
    document.getElementById('selectedText').value = window
      .getSelection()
      .toString();

    console.log(elements.length);
    for (var i = 0; i < elements.length; i++) {
      console.log('modal');
      console.log(elements[i].id);
    }

    var trHTML =
      "<tr id='tempFieldId" +
      tempFieldId +
      "'><td><input type='text' id='fieldName" +
      tempFieldId +
      '\'></input></td><td><p id="fieldValue' +
      tempFieldId +
      '">' +
      window.getSelection().toString() +
      '<p></td>';
    if ($('#modalPrefix').is(':checked'))
      trHTML +=
        "<td><input type='text' id='modalPrefix" +
        tempFieldId +
        "'></input></td>";
    else
      trHTML +=
        "<td class='d-none'><input type='text' id='modalPrefix" +
        tempFieldId +
        "'></input></td>";
    if ($('#modalSuffix').is(':checked'))
      trHTML +=
        "<td><input type='text' id='modalSuffix" +
        tempFieldId +
        "'></input></td>";
    else
      trHTML +=
        "<td class='d-none'><input type='text' id='modalSuffix" +
        tempFieldId +
        "'></input></td>";

    trHTML +=
      "<td><button class='btn crossBtn' id='" +
      tempFieldId +
      "'><i class='fa fa-times' aria-hidden='true'></i></button></td></tr>";
    $('#modalFieldTable tbody').append(trHTML);

    tempFieldId += 1;
  }
});

export default class ModalComponent extends Component {
  @action
  generatePattern() {
    console.log('copperfield is alive');
    var ruleName, fields;
    ruleName = document.getElementById('ruleName').value;

    var table = document.getElementById('modalFieldTable');

    var ruleJSON = '{',
      fieldJSONstring = '[';
    ruleJSON += '"ruleName": "' + ruleName + '", "fields":  ';

    for (var i = 0; i < tempFieldId; i++) {
      if (i != 0) fieldJSONstring += ', ';
      // tempFieldId
      var element = document.getElementById('tempFieldId' + i);

      if (typeof element != 'undefined' && element != null) {
        fieldJSONstring += '{';
        fieldJSONstring +=
          '"fieldName": "' +
          document.getElementById('fieldName' + i).value +
          '",';
        fieldJSONstring += '"value": "' + $('#fieldValue' + i).html() + '",';
        fieldJSONstring +=
          '"prefix": "' +
          document.getElementById('modalPrefix' + i).value +
          '",';
        fieldJSONstring +=
          '"suffix": "' +
          document.getElementById('modalSuffix' + i).value +
          '"';
        fieldJSONstring += '}';
      }
    }

    fieldJSONstring += ']';

    ruleJSON += fieldJSONstring + '}';

    console.log(ruleJSON);
    console.log(fieldJSONstring);

    $.ajax({
      type: 'POST',
      data: { ruleJSON: ruleJSON, fieldJSONstring: fieldJSONstring },
      url: 'generatePattern',
      success: function (result) {
        var json = JSON.parse(result);
        document.getElementById('generatedPatternTextArea').value = String(
          json['regex']
        );
      },
    });
  }

  @action
  addPattern() {
    var ruleName, fields;
    ruleName = document.getElementById('ruleName').value;

    var table = document.getElementById('modalFieldTable');

    $('#modalFieldTable tr').each(function () {
      $(this)
        .find('td')
        .each(function () {
          console.log($(this).html());
        });
    });

    var ruleJSON = '{',
      fieldJSONstring = '[';
    ruleJSON += '"ruleName": "' + ruleName + '", "fields":  ';

    for (var i = 0; i < tempFieldId; i++) {
      if (i != 0) fieldJSONstring += ', ';
      // tempFieldId
      var element = document.getElementById('tempFieldId' + i);

      if (typeof element != 'undefined' && element != null) {
        fieldJSONstring += '{';
        fieldJSONstring +=
          '"fieldName": "' +
          document.getElementById('fieldName' + i).value +
          '",';
        fieldJSONstring += '"value": "' + $('#fieldValue' + i).html() + '",';
        fieldJSONstring +=
          '"prefix": "' +
          document.getElementById('modalPrefix' + i).value +
          '",';
        fieldJSONstring +=
          '"suffix": "' +
          document.getElementById('modalSuffix' + i).value +
          '"';
        fieldJSONstring += '}';
      }
    }

    fieldJSONstring += ']';

    ruleJSON += fieldJSONstring + '}';

    console.log(ruleJSON);
    console.log(fieldJSONstring);

    $.ajax({
      type: 'POST',
      data: { ruleJSON: ruleJSON, fieldJSONstring: fieldJSONstring },
      url: 'addPattern',
      success: function (result) {},
    });
  }

  @action
  applyChangesToModalTable() {
    var table = document.getElementById('modalFieldTable');

    // console.log("prefix : " + $('#modalPrefix').is(":checked"));
    // console.log("suffix : " + $('#modalSuffix').is(":checked"));

    if ($('#modalPrefix').is(':checked')) {
      $('#modalPrefixColumn').removeClass('d-none');

      for (var i = 0, row; (row = table.rows[i]); i++) {
        for (var j = 0, col; (col = row.cells[j]); j++) {
          if (j == 2) {
            col.classList.remove('d-none');
          }
        }
      }
    } else {
      $('#modalPrefixColumn').addClass('d-none');

      for (var i = 0, row; (row = table.rows[i]); i++) {
        for (var j = 0, col; (col = row.cells[j]); j++) {
          if (j == 2) {
            col.classList.add('d-none');
          }
        }
      }
    }

    if ($('#modalSuffix').is(':checked')) {
      $('#modalSuffixColumn').removeClass('d-none');

      for (var i = 0, row; (row = table.rows[i]); i++) {
        for (var j = 0, col; (col = row.cells[j]); j++) {
          if (j == 3) {
            col.classList.remove('d-none');
          }
        }
      }
    } else {
      $('#modalSuffixColumn').addClass('d-none');

      for (var i = 0, row; (row = table.rows[i]); i++) {
        for (var j = 0, col; (col = row.cells[j]); j++) {
          if (j == 3) {
            col.classList.add('d-none');
          }
        }
      }
    }
  }
}
