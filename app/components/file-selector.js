import Component from '@glimmer/component';
import Ember from 'ember';
import { action } from '@ember/object';
import { doc } from 'prettier';

var name = 'manick';
var jsonLogs = [];
var pageNum = 0;


console.log("im ready imready imready imready");



//shows the list of rules from the database
function getRules() {
  console.log("i'm called");

  $.ajax({
    type: 'POST',
    data: {},
    url: 'getRules',
    success: function (result) {
      var json = JSON.parse(result);
      var trHTML = '';

      if (json.length == 0) {
        $('#rulesLists').empty();
        $('#rulesLists').append(
          '<tr><td><td><td>No rules have been created<td></tr>'
        );
      }

      for (var item in json) {
        if (json[item] == 0) {
          trHTML +=
            '<tr><td><input class="form-check-input status" type="checkbox" value="" name="ruleStatus" id="checkbox' +
            item +
            '"></td><td class="ruleList" id="' +
            item +
            '">';
        } else {
          trHTML +=
            '<tr><td><input class="form-check-input status" type="checkbox" value="" name="ruleStatus" id="checkbox' +
            item +
            '" checked></td><td class="ruleList" id="' +
            item +
            '">';
        }

        trHTML += item;
        trHTML += '</td>';



        trHTML +=
          '<td><button type="button" class="btn btn-outline-secondary editButton" data-bs-toggle="modal" data-bs-target="#editModal" id="edit' +
          item +
          '">Edit</button></td><td><button type="button" class="btn btn-outline-secondary deleteButton" id="delete' +
          item +
          '">Delete</button></td>';

        trHTML += '</tr>';
      }

      if (json.length != 0) {
        $('#rulesLists').empty();
        var trHead = '<tr><th>Status</th><th>RulesList</th></tr>';
        $('#rulesLists').append(trHead);
        $('#rulesLists').append(trHTML);
      }
    },
  });
}

//when clicked on the specific rule, this is used to retrieve the regex to view
$(document).on('click', 'td.ruleList', function () {
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
  var ruleName = (this.id).substr(4);
  $('#editRuleText').text(ruleName);

  $.ajax({
    type: 'POST',
    data: { ruleName: ruleName },
    url: 'getRegexFromRule',
    success: function (result) {
      console.log(result);
      document.getElementById('updatedRegex').value = String(result);
    },
  });
  // updateRule
});

//deletes a specific rule
$(document).on('click', '.deleteButton', function () {
  var ruleName = this.id;
  ruleName = ruleName.substr(6);
  console.log('deleting ' + ruleName);

  $.ajax({
    type: 'POST',
    data: { ruleName: ruleName },
    url: 'deleteRule',
    success: function (result) {
      console.log('rule deleted');
      getRules();
    },
  });
});


// function changeNoOfLogs() {
//   console.log("tak tak");
//   var logCount = $('#logsPerPage-customGrouping :selected').text();
//   console.log(logCount);
// }


$(function () {
  $('.crossBtn').on('click', function () {
    console.log('this should work');
  });
});




export default class ScientistsComponent extends Component {
  @action
  previewLog() { }


  @action
  nextPageCustomGrouping() {

    pageNum += 1;
    var endNum, startNum, trHTML = '';

    


    // size = $('#logsPerPage-customGrouping option:selected').text();
    var logCount = parseInt($('#logsPerPage-customGrouping :selected').text(), 10);

    console.log("im the size: " + logCount);
    console.log("im the page: " + pageNum);


    startNum = logCount * pageNum;
    endNum = startNum + logCount;

    // $('#nextBtn').show();

    // if(startNum >json.length){
    //   $('#nextBtn').hide();
    // }

    console.log(startNum + " " + endNum);
    $('#logsCountTable').text(startNum+"/"+jsonLogs.length);



    // if(endNum > totalNoOfHitsCustomGrouping){
    //     endNum = totalNoOfHitsCustomGrouping;
    //     customGroupNextButton.style.visibility = "hidden";
    // }

    // $('#customGroupingPageNum').text(startNum + "-" + endNum  + " of " + totalNoOfHitsCustomGrouping);

    if (jsonLogs.length != 0) {
      console.log(jsonLogs.length);
      console.log(jsonLogs);


      trHTML += '<thead><tr><th>Uploded logs:</th></tr></thead>';

      trHTML += '<tbody>';

      for (var i = startNum; i < endNum; i++) {
        trHTML += '<tr>';
        for (var stuff in jsonLogs[i]) {
          trHTML +=
            '<td>' +
            jsonLogs[i][stuff] +
            '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
            jsonLogs[i][stuff] +
            '\'"><i class="fa fa-clone"></i></button></td>';
        }

        trHTML += '</tr>';
      }
      trHTML += '</tbody>';
      console.log(trHTML);
      $('#matchedLogs').empty();
      $('#matchedLogs').append(trHTML);
    }
  }


  @action
  prevPageCustomGrouping() {

    // $('#prevBtn').show();
    pageNum-=1;
    // if(pageNum-1 ==0){
      
    //   $('#prevBtn').hide();
    // }

    
    var endNum, startNum, trHTML = '';


    // size = $('#logsPerPage-customGrouping option:selected').text();
    var logCount = parseInt($('#logsPerPage-customGrouping :selected').text(), 10);

    console.log("im the size: " + logCount);
    console.log("im the page: " + pageNum);


    startNum = logCount * pageNum;
    endNum = startNum + logCount;

    console.log(startNum + " " + endNum);
    $('#logsCountTable').text(startNum+"/"+jsonLogs.length);



    // if(endNum > totalNoOfHitsCustomGrouping){
    //     endNum = totalNoOfHitsCustomGrouping;
    //     customGroupNextButton.style.visibility = "hidden";
    // }

    // $('#customGroupingPageNum').text(startNum + "-" + endNum  + " of " + totalNoOfHitsCustomGrouping);

    if (jsonLogs.length != 0) {
      console.log(jsonLogs.length);
      console.log(jsonLogs);


      trHTML += '<thead><tr><th>Uploded logs:</th></tr></thead>';

      trHTML += '<tbody>';

      for (var i = startNum; i < endNum; i++) {
        trHTML += '<tr>';
        for (var stuff in jsonLogs[i]) {
          trHTML +=
            '<td>' +
            jsonLogs[i][stuff] +
            '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
            jsonLogs[i][stuff] +
            '\'"><i class="fa fa-clone"></i></button></td>';
        }

        trHTML += '</tr>';
      }
      trHTML += '</tbody>';
      console.log(trHTML);
      $('#matchedLogs').empty();
      $('#matchedLogs').append(trHTML);
    }
  }

  @action
  changeNoOfLogs() {

    var logCount = $('#logsPerPage-customGrouping :selected').text();
    console.log(logCount);
    console.log("tak tak " + logCount);

    var trHTML = '';
    if (jsonLogs.length != 0) {
      console.log(jsonLogs.length);
      console.log(jsonLogs);


      trHTML += '<thead><tr><th>Uploded logs:</th></tr></thead>';

      trHTML += '<tbody>';

      for (var i = 0; i < logCount; i++) {
        trHTML += '<tr>';
        for (var stuff in jsonLogs[i]) {
          trHTML +=
            '<td>' +
            jsonLogs[i][stuff] +
            '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
            jsonLogs[i][stuff] +
            '\'"><i class="fa fa-clone"></i></button></td>';
        }

        trHTML += '</tr>';
      }
      trHTML += '</tbody>';
      console.log(trHTML);
      $('#matchedLogs').empty();
      $('#matchedLogs').append(trHTML);
    }
  }

  @action
  changeToSearch() {
    //used to toggle to the constraint screen
    $('#search').show();
    $('#rules').hide();
    $('#logsPerPage-customGrouping').hide();
    var element = document.getElementById('searchNavID');
    element.classList.add('active');
    element = document.getElementById('ruleNavID');
    element.classList.remove('active');
  }

  @action
  changeToRules() {
    //used to toggle to report screen
    $('#search').hide();
    $('#rules').show();

    var element = document.getElementById('ruleNavID');
    element.classList.add('active');
    element = document.getElementById('searchNavID');
    element.classList.remove('active');

    getRules();
  }

  @action
  updateStatus() {
    //updates the status of the rules in the database
    console.log('it should show all the checked stuff');
    var rules = [];

    $('input:checkbox[name=ruleStatus]:checked').each(function () {
      rules.push(this.id.substring(8));
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
  showSuggestion() {
    //find the separato and shows it in the dropdown
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
  addField() {
    //used when the user wants to add another field in the rule
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
    //to traverse logs
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
          console.log(json.length);
          console.log(json);

          console.log('this should print icky');

          trHTML += '<thead><tr><th>Traversed logs:</th></tr></thead>';

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
            }

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
    //to upload logs

    var fileName, separator;

    fileName = document.getElementById('fileName').files[0].name;
    separator = $('#separator').val();

    console.log('fileName is :' + fileName);
    console.log('separator is : ' + separator);

    fileName = 'D:\\' + fileName;

    $.ajax({
      type: 'POST',
      data: { fileName: fileName, separator: separator },
      url: 'upload',
      success: function (result) {
        console.log(result);

        $('#logsPerPage-customGrouping').show();

        

        jsonLogs = JSON.parse(result);
        console.log(jsonLogs);
        var trHTML = '';
        if (jsonLogs.length != 0) {
          console.log(jsonLogs.length);
          console.log(jsonLogs);

          var logCount = parseInt($('#logsPerPage-customGrouping :selected').text(), 10);
          $('#logsCountTable').text(logCount+"/"+jsonLogs.length);

          console.log('this should print icky');

          trHTML += '<thead><tr><th>Uploded logs:</th></tr></thead>';

          trHTML += '<tbody>';

          for (var i = 0; i < logCount; i++) {
            trHTML += '<tr>';
            for (var stuff in jsonLogs[i]) {
              trHTML +=
                '<td>' +
                jsonLogs[i][stuff] +
                '<button type="button" class="btn hoverButton" data-bs-toggle="modal" data-bs-target="#exampleModal0" onclick="document.getElementById(\'modalLog\').innerHTML = \'' +
                jsonLogs[i][stuff] +
                '\'"><i class="fa fa-clone"></i></button></td>';
            }

            trHTML += '</tr>';
          }
          trHTML += '</tbody>';
          console.log(trHTML);
          $('#matchedLogs').empty();
          $('#matchedLogs').append(trHTML);
        }
      },
    });
  }
}
