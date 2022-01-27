import Component from '@glimmer/component';
import Ember from 'ember';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { doc } from 'prettier';
import { todo } from 'qunit';

// var name = 'manick';
var jsonLogs = [];
var pageNum = 0;

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


$(document).on('click', '.editButton', function () {
  var ruleName = this.id.substr(4);
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

  $.ajax({
    type: 'POST',
    data: { ruleName: ruleName },
    url: 'deleteRule',
    success: function (result) {
      getRules();
    },
  });
});

export default class ScientistsComponent extends Component {

  @tracked searchResults;
  @tracked searchNoOfHits;

  @tracked rulesList;

  @tracked logs;
  @tracked traversed;

  @tracked tabs = ['upload', 'rule', 'search'];

  @action
  changeTabs(currentTab) {

    for (var tab of this.tabs) {
      var element = document.getElementById(`${tab}NavID`);
      if (tab == currentTab) {
        $(`#${tab}`).show();
        element.classList.add('active');

        if (currentTab == "rule") {
          $.post('/logSep/getRules', {}).then(response => {
            var json = JSON.parse(response);
            this.rulesList = json;
          });
        } else {
          $('#logsPerPage-customGrouping').hide();

          $('#prevBtn').hide();
          $('#nextBtn').hide();
          $('#logsCountTable').hide();
        }
      } else {
        $(`#${tab}`).hide();
        element.classList.remove('active');
      }
    }

  }

  @action
  changePageCustomGrouping(destination) {
    pageNum += (destination == "next") ? 1 : -1;

    var endNum,startNum;
    var logCount = parseInt($('#logsPerPage-customGrouping :selected').text(),10);

    startNum = logCount * pageNum;
    endNum = startNum + logCount;

    $('#logsCountTable').text(startNum + '-' + endNum + '/' + jsonLogs.length);

    if (jsonLogs.length != 0) this.logs = jsonLogs.slice(startNum, endNum);
  }

  @action
  changeNoOfLogs() {
    var logCount = $('#logsPerPage-customGrouping :selected').text();
    $('#logsCountTable').text('0-' + logCount + '/' + jsonLogs.length);
    pageNum = 0;

    if (jsonLogs.length != 0) this.logs = jsonLogs.slice(0,logCount);
  }

  @action
  updateStatus() {
    //updates the status of the rules in the database
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
        $.post('/logSep/getRules', {}).then(response => {
          this.rulesList = JSON.parse(response);
        });
      },
    });
  }



  @action
  showSuggestion() {
    //find the separato and shows it in the dropdown
    var fileName = null;
    fileName = document.getElementById('fileName').files[0].name;
    // fileName = document.getElementById('fileName').files[0].webkitRelativePath;

    fileName = 'D:\\' + fileName;

    $.ajax({
      type: 'POST',
      data: { fileName: fileName },
      url: 'find',
      success: function (result) {
        var json = JSON.parse(result);

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
    // this.showAlert();
  }

  @action
  search() {
    //  console.log($('#searchInput').val());
    var searchQuery = $('#searchInput').val();

    $.post('/logSep/search', { query: searchQuery }).then(response => {
      var json = JSON.parse(response);
      this.searchResults = json;
      this.searchNoOfHits = json.length;
    });

  }

  @action
  showTraverse() {
    //to traverse logs
    var fileName, separator;

    // fileName = document.getElementById('fileName').files[0].name;
    separator = $('#separator').val();

    fileName = document.getElementById('fileName').files[0].name;
    // fileName = document.getElementById('fileName').files[0].webkitRelativePath;

    fileName = 'D:\\' + fileName;

    $.post('/logSep/traverser', { fileName: fileName, separator: separator }).then(response => {
      var json = JSON.parse(response);
      console.log(json);
      this.traversed = true;
      this.logs = json;

    });
  }

  @action
  uploadLogs() {
    //to upload logs

    var fileName, separator;

    fileName = document.getElementById('fileName').files[0].name;
    separator = $('#separator').val();

    fileName = 'D:\\' + fileName;

    $.post('/logSep/upload', { fileName: fileName, separator: separator }).then(response => {

      var logCount = $('#logsPerPage-customGrouping :selected').text();

      var json = JSON.parse(response);
      this.logs = json.slice(0,logCount);
      this.traversed = false;
      jsonLogs = json;

      $('#logsPerPage-customGrouping').show();
      $('#prevBtn').show();
      $('#nextBtn').show();
      $('#logsCountTable').show();
      $('#logsCountTable').text('0-' + logCount + '/' + jsonLogs.length);
    });
  }
}