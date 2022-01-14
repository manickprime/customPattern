import Component from '@glimmer/component';
import Ember from 'ember';
import { action } from '@ember/object';
import { doc } from 'prettier';

var name = 'manick';
var elements = document.getElementsByClassName('hoverButton');
$('#report').hide();

$(document).on('ready', function () {
  $('#report').hide();
});

function getRules() {

  console.log("i'm called");

  $.ajax({
    type: 'POST',
    data: {},
    url: 'getRules',
    success: function (result) {
      var json = JSON.parse(result);
      var trHTML = "";

      if (json.length == 0) {
        $('#rulesLists').empty();
        $('#rulesLists').append("<tr><td><td><td>No rules have been created<td></tr>");
      }

      for (var item in json) {

        if (json[item] == 0) {
          trHTML += "<tr><td><input class=\"form-check-input status\" type=\"checkbox\" value=\"\" name=\"ruleStatus\" id=\"checkbox" + item + "\"></td><td class=\"ruleList\" id=\"" + item + "\">";
        } else {
          trHTML += "<tr><td><input class=\"form-check-input status\" type=\"checkbox\" value=\"\" name=\"ruleStatus\" id=\"checkbox" + item + "\" checked></td><td class=\"ruleList\" id=\"" + item + "\">";
        }

        trHTML += item;
        trHTML += "</td>";

        trHTML += "<td><button type=\"button\" class=\"btn btn-outline-secondary editButton\" id=\"edit" + item + "\">Edit</button></td><td><button type=\"button\" class=\"btn btn-outline-secondary deleteButton\" id=\"delete" + item + "\">Delete</button></td>";

        trHTML += "</tr>";
      }


      if (json.length != 0) {

        $('#rulesLists').empty();
        var trHead = "<tr><th>Status</th><th>RulesList</th></tr>";
        $('#rulesLists').append(trHead);
        $('#rulesLists').append(trHTML);

      }

    },
  });
}


$(document).on('click', 'td.ruleList', function() {
  var ruleName = this.id;
  console.log(ruleName);
  $.ajax({
    type: 'POST',
    data: { ruleName: ruleName },
    url: 'getRegexFromRule',
    success: function (result) {

      console.log(result);

      $('#ruleNamePreview').text(ruleName);
      $('#regexPreview').text(result);
    },
  });

});






$(document).on('click', '.crossBtn', function () {
  console.log('new way!');
  console.log(this.id);
  // $("#"+ this.id).remove();
  $('#tempFieldId' + this.id).remove();
});

$(document).on('click', '.editButton', function () {
  console.log('new way!');

});

$(document).on('click', '.deleteButton', function () {

  var ruleName = this.id;
  ruleName = ruleName.substr(6);
  console.log("deleting " + ruleName);

  $.ajax({
    type: 'POST',
    data: { ruleName: ruleName },
    url: 'deleteRule',
    success: function (result) {
      console.log("rule deleted");
      getRules();
    },
  });

  

});

$(function () {
  $('.crossBtn').on('click', function () {
    console.log('this should work');
  });
});

var tempFieldId = 0;

function deleteFieldRow() {
  console.log('this is from the function in javascript');
}

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

var myFunction = function () {
  console.log('put modal screen');
};

for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', myFunction);
}

// modalApplyButton

export default class ScientistsComponent extends Component {


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

    getRules();
  }

  @action
  updateStatus() {
    console.log("it should show all the checked stuff");
    var rules = [];

    $("input:checkbox[name=ruleStatus]:checked").each(function () {
			rules.push((this.id).substring(8));
		});

    console.log(rules);
    $.ajax({
      type: 'POST',
      data: { ruleNames: rules },
      url: 'updateStatus',
      success: function (result) { 
        getRules();
      },
    });

    
  }

  @action
  clearField() {
    document.getElementById('selectedText').value = '';
  }

  @action
  deleteFieldRow() {
    console.log('should delete a row');
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

  @action
  addPattern() {
    var ruleName, fields;
    ruleName = document.getElementById('ruleName').value;

    var table = document.getElementById('modalFieldTable');

    // for(var i=0, row; row = table.rows[i]; i++){
    //     for(var j=0, col; col = row.cells[j]; j++){
    //         // console.log($.parseHTML(col));
    //         console.log(col);
    //     }
    // }

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
      success: function (result) { },
    });
  }

  @action
  showSuggestion() {
    var fileName = null;
    fileName = document.getElementById('fileName').files[0].name;
    fileName = 'D:\\' + fileName;

    console.log(fileName);

    $.ajax({
      type: 'POST',
      data: { fileName: fileName },
      url: 'find',
      success: function (result) {
        console.log('suggested separator is ' + result);
        // console.log(result);

        console.log(result);
        var json = JSON.parse(result);
        console.log('================');
        console.log(json['separator']);
        console.log('================');

        document.getElementById('separator').value = String(json['separator']);
      },
    });
  }

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
  addField() {
    var trHTML = '',
      before,
      after,
      current;
    before = document.getElementById('before').value;
    after = document.getElementById('after').value;
    current = document.getElementById('current').value;

    console.log(before + ':' + current + ':' + after);

    console.log(name);

    trHTML +=
      '<tr><td>' +
      before +
      '</td><td>' +
      current +
      '</td><td>' +
      after +
      '</td></tr>';
    $('#fieldTable').append(trHTML);
    $('#matchedLogs').empty();
    this.showAlert();
  }

  @action
  showTraverse() {
    var fileName, separator;

    fileName = document.getElementById('fileName').files[0].name;
    separator = $('#separator').val();

    console.log('fileName is :' + fileName);
    console.log('separator is : ' + separator);

    fileName = 'D:\\' + fileName;

    $.ajax({
      type: 'POST',
      data: { fileName: fileName, separator: separator },
      url: 'traverser',
      success: function (result) {
        console.log('file uploaded successfully');

        // console.log(result);
        var json = JSON.parse(result);
        console.log(json);
        var trHTML = '';
        if (json.length != 0) {
          // trHTML += "<tr>";
          // for (var i = 0; i < attributes.length; i++) {
          //     trHTML += "<th>" + attributes[i] + "</th>";
          // }
          // trHTML += "</tr>";

          console.log(json.length);
          console.log(json);

          console.log('this should print icky');

          trHTML += '<thead><tr><th>Complete log</th></tr></thead>';

          trHTML += '<tbody>';

          for (var i = 0; i < json.length; i++) {
            trHTML += '<tr>';
            for (var stuff in json[i]) {
              trHTML +=
                '<td>' +
                json[i][stuff] +
                '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
                json[i][stuff] +
                '\'"><i class="fa fa-clone"></i></button></td>';
              // trHTML += "<i class=\"fa fa-clone\"></i>";
            }
            // for (var j = 0; j < json[i].length; j++) {
            //     trHTML += "<td>" + json[i][j] + "</td>";

            // }

            trHTML += '</tr>';
          }
          trHTML += '</tbody>';
          console.log(trHTML);
          $('#matchedLogs').append(trHTML);
        }
      },
    });
  }

  @action
  uploadLogs() {
    var fileName, separator;

    fileName = document.getElementById('fileName').files[0].name;
    separator = $('#separator').val();

    console.log('fileName is :' + fileName);
    console.log('separator is : ' + separator);

    fileName = 'D:\\' + fileName;
    // $.ajax({
    //   type: 'POST',
    //   data: { },
    //   url: 'getIncludedRules',
    //   success: function (result) {
    //     console.log(result);
    //     $.ajax({
    //       type: 'POST',
    //       data: { fileName: fileName, separator: separator, regexArray : result },
    //       url: 'upload',
    //       success: function (result) {
    //         console.log(result);
    //       },
    //     });
    //   },
    // });

    $.ajax({
      type: 'POST',
      data: { fileName: fileName, separator: separator },
      url: 'upload',
      success: function (result) {
        console.log(result);

        var json = JSON.parse(result);
        console.log(json);
        var trHTML = '';
        if (json.length != 0) {
          // trHTML += "<tr>";
          // for (var i = 0; i < attributes.length; i++) {
          //     trHTML += "<th>" + attributes[i] + "</th>";
          // }
          // trHTML += "</tr>";

          console.log(json.length);
          console.log(json);

          console.log('this should print icky');

          trHTML += '<thead><tr><th>Complete log</th></tr></thead>';

          trHTML += '<tbody>';

          for (var i = 0; i < json.length; i++) {
            trHTML += '<tr>';
            for (var stuff in json[i]) {
              trHTML +=
                '<td>' +
                json[i][stuff] +
                '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
                json[i][stuff] +
                '\'"><i class="fa fa-clone"></i></button></td>';
              // trHTML += "<i class=\"fa fa-clone\"></i>";
            }
            // for (var j = 0; j < json[i].length; j++) {
            //     trHTML += "<td>" + json[i][j] + "</td>";

            // }

            trHTML += '</tr>';
          }
          trHTML += '</tbody>';
          console.log(trHTML);
          $('#matchedLogs').empty();
          $('#matchedLogs').append(trHTML);
        }
      },
    });

    // $.ajax({
    //   type: 'POST',
    //   data: { fileName: fileName, separator: separator },
    //   url: 'upload',
    //   success: function (result) {
    //     console.log('file uploaded successfully');

    //     // console.log(result);
    //     var json = JSON.parse(result);
    //     console.log(json);
    //     var trHTML = '';
    //     if (json.length != 0) {
    //       // trHTML += "<tr>";
    //       // for (var i = 0; i < attributes.length; i++) {
    //       //     trHTML += "<th>" + attributes[i] + "</th>";
    //       // }
    //       // trHTML += "</tr>";

    //       console.log(json.length);
    //       console.log(json);

    //       console.log('this should print icky');
    //       // console.log(json[2][0]);

    //       // for(var stuff in json[2]){
    //       //     console.log(stuff + " :: " + json[2][stuff]);
    //       // }

    //       trHTML += '<tr>';
    //       for (var stuff in json[0]) {
    //         trHTML += '<th>' + stuff + '</th>';
    //       }
    //       trHTML += '</tr>';

    //       for (var i = 0; i < json.length; i++) {
    //         trHTML += '<tr>';
    //         for (var stuff in json[i]) {
    //           trHTML += '<td>' + json[i][stuff] + '</td>';
    //         }
    //         // for (var j = 0; j < json[i].length; j++) {
    //         //     trHTML += "<td>" + json[i][j] + "</td>";

    //         // }
    //         trHTML += '</tr>';
    //       }
    //       console.log(trHTML);
    //       $('#matchedLogs').append(trHTML);
    //     }
    //   },
    // });
  }
}

// export default file-selector(deleteFieldRow);
