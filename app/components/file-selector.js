import Component from '@glimmer/component';
import Ember from 'ember';
import { action } from '@ember/object';
import { doc } from 'prettier';


var name = "manick";
var elements = document.getElementsByClassName('hoverButton');

$(document).on('ready', function () {
    // for (var i = 0; i < elements.length; i++) {
    //     elements[i].onclick = function () {
    //         console.log("at&t");
    //     }
    // }
    $('#dummy').on('click', deleteFieldRow);
   
})


$(document).on('click', '.crossBtn', function() {
    console.log("new way!");
    console.log(this.id);
    // $("#"+ this.id).remove();
    $("#tempFieldId"+ this.id).remove();
})

$(function() {
    $('.crossBtn').on('click', function() {
        console.log("this should work");
    });
});

var tempFieldId = 0;


function deleteFieldRow() {
    console.log("this is from the function in javascript");
}

document.addEventListener('mouseup', event => {
    if (window.getSelection().toString().length) {
        console.log(window.getSelection().toString());
        document.getElementById("selectedText").value = window.getSelection().toString();

        console.log(elements.length);
        for (var i = 0; i < elements.length; i++) {
            console.log("modal");
            console.log(elements[i].id);
        }


        var trHTML = "<tr id='tempFieldId" + tempFieldId + "'><td><input type='text' id='fieldName" + tempFieldId + "'></input></td><td><p id=\"fieldValue" + tempFieldId + "\">" + window.getSelection().toString() + "<p></td>";
        if ($('#modalPrefix').is(":checked"))
            trHTML += "<td><input type='text' id='modalPrefix" + tempFieldId + "'></input></td>";
        else
            trHTML += "<td class='d-none'><input type='text' id='modalPrefix" + tempFieldId + "'></input></td>";
        if ($('#modalSuffix').is(":checked"))
            trHTML += "<td><input type='text' id='modalSuffix" + tempFieldId + "'></input></td>";
        else
            trHTML += "<td class='d-none'><input type='text' id='modalSuffix" + tempFieldId + "'></input></td>";

        trHTML += "<td><button class='btn crossBtn' id='" + tempFieldId + "'><i class='fa fa-times' aria-hidden='true'></i></button></td></tr>";
        $('#modalFieldTable tbody').append(trHTML);

        tempFieldId += 1;
    }
})




var myFunction = function () {
    console.log("put modal screen");
}

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', myFunction);
}


// modalApplyButton



export default class ScientistsComponent extends Component {


    @action
    clearField() {
        document.getElementById("selectedText").value = "";
    }

    @action
    deleteFieldRow() {
        console.log("should delete a row");
    }

    @action
    applyChangesToModalTable() {

        var table = document.getElementById("modalFieldTable");

        // console.log("prefix : " + $('#modalPrefix').is(":checked"));
        // console.log("suffix : " + $('#modalSuffix').is(":checked"));

        if ($('#modalPrefix').is(":checked")) {
            $('#modalPrefixColumn').removeClass("d-none");
            
            for(var i=0, row; row = table.rows[i]; i++){
                for(var j=0, col; col = row.cells[j]; j++){
                    if(j==2){
                        col.classList.remove("d-none");
                    }
                }
            }

        } else {
            $('#modalPrefixColumn').addClass("d-none");

            for(var i=0, row; row = table.rows[i]; i++){
                for(var j=0, col; col = row.cells[j]; j++){
                    if(j==2){
                        col.classList.add("d-none");
                    }
                }
            }
        }

        if ($('#modalSuffix').is(":checked")) {
            $('#modalSuffixColumn').removeClass("d-none");

            for(var i=0, row; row = table.rows[i]; i++){
                for(var j=0, col; col = row.cells[j]; j++){
                    if(j==3){
                        col.classList.remove("d-none");
                    }
                }
            }
        } else {
            $('#modalSuffixColumn').addClass("d-none");

            for(var i=0, row; row = table.rows[i]; i++){
                for(var j=0, col; col = row.cells[j]; j++){
                    if(j==3){
                        col.classList.add("d-none");
                    }
                }
            }
        }


    }


    @action
    addPattern() {
        var ruleName, fields;
        ruleName = document.getElementById("ruleName").value;

        var table = document.getElementById("modalFieldTable");

        // for(var i=0, row; row = table.rows[i]; i++){
        //     for(var j=0, col; col = row.cells[j]; j++){    
        //         // console.log($.parseHTML(col));
        //         console.log(col);
        //     }
        // }

        $('#modalFieldTable tr').each(function() {
            $(this).find('td').each(function() {
                console.log($(this).html());
            });
        });


        var ruleJSON = "{", fieldJSONstring = "[";
        ruleJSON += '"ruleName": "' + ruleName +'", "fields":  ';



        for(var i=0;i<tempFieldId;i++){
            if(i!=0)  fieldJSONstring += ", ";
            // tempFieldId
            var element = document.getElementById("tempFieldId" + i);

            if(typeof(element) != "undefined" && element != null) {
                fieldJSONstring += '{';
                fieldJSONstring += '"fieldName": "' + document.getElementById("fieldName" + i).value + '",';
                fieldJSONstring += '"value": "' + $("#fieldValue" + i).html() + '",';
                fieldJSONstring += '"prefix": "' + document.getElementById("modalPrefix" + i).value + '",';
                fieldJSONstring += '"suffix": "' + document.getElementById("modalSuffix" + i).value + '"';
                fieldJSONstring += '}';
            }
        }

        fieldJSONstring += "]";

        ruleJSON += fieldJSONstring +  '}';

        console.log(ruleJSON);
        console.log(fieldJSONstring);

        // var ruleJSON = "{", fieldJSONstring = "[";
        // ruleJSON += '"ruleName": "' + ruleName +'", "fields": [ ';



        // for(var i=0;i<tempFieldId;i++){
        //     if(i!=0)  ruleJSON += ", ";
        //     // tempFieldId
        //     var element = document.getElementById("tempFieldId" + i);

        //     if(typeof(element) != "undefined" && element != null) {
        //         ruleJSON += '{';
        //         ruleJSON += '"fieldName": "' + document.getElementById("fieldName" + i).value + '",';
        //         ruleJSON += '"value": "' + $("#fieldValue" + i).html() + '",';
        //         ruleJSON += '"prefix": "' + document.getElementById("modalPrefix" + i).value + '",';
        //         ruleJSON += '"suffix": "' + document.getElementById("modalSuffix" + i).value + '"';
        //         ruleJSON += '}';
        //     }
        // }

        // ruleJSON += ']}';

        // console.log(ruleJSON);


        // for(int i=0;i<)


        $.ajax({
            type: 'POST',
            data: { ruleJSON: ruleJSON , fieldJSONstring: fieldJSONstring},
            url: 'addPattern',
            success: function (result) {
                
            }
        });
    }

    @action
    showSuggestion() {

        var fileName = null;
        fileName = document.getElementById("fileName").files[0].name;
        fileName = "D:\\" + fileName;

        console.log(fileName);
        // $('#separator').val = "|";

        // if(document.getElementById("fileName").value != "")
        //     document.getElementById("separator").value = "pipeline";
        // console.log("this should change the value before ajax call");

        $.ajax({
            type: 'POST',
            data: { fileName: fileName },
            url: 'find',
            success: function (result) {
                console.log("suggested separator is " + result);
                // console.log(result);

                console.log(result);
                var json = JSON.parse(result);
                console.log("================");
                console.log(json["separator"]);
                console.log("================");

                // if(document.getElementById("fileName").value != "")
                // document.getElementById("separator").value = "comma";
                // document.getElementById("separator").value = result;
                document.getElementById("separator").value = String(json["separator"]);

            }
        });

    }

    @action
    addField() {
        var trHTML = "", before, after, current;
        before = document.getElementById("before").value;
        after = document.getElementById("after").value;
        current = document.getElementById("current").value;

        console.log(before + ":" + current + ":" + after);

        console.log(name);

        trHTML += "<tr><td>" + before + "</td><td>" + current + "</td><td>" + after + "</td></tr>";
        $('#fieldTable').append(trHTML);
        $('#matchedLogs').empty();
        this.showAlert();
    }


    @action
    showTraverse() {
        var fileName, separator;

        fileName = document.getElementById("fileName").files[0].name;
        separator = $('#separator').val();

        console.log("fileName is :" + fileName);
        console.log("separator is : " + separator);

        fileName = "D:\\" + fileName;

        $.ajax({
            type: 'POST',
            data: { fileName: fileName, separator: separator },
            url: 'traverser',
            success: function (result) {
                console.log("file uploaded successfully");

                // console.log(result);
                var json = JSON.parse(result);
                console.log(json);
                var trHTML = "";
                if (json.length != 0) {
                    // trHTML += "<tr>";
                    // for (var i = 0; i < attributes.length; i++) {
                    //     trHTML += "<th>" + attributes[i] + "</th>";
                    // }
                    // trHTML += "</tr>";

                    console.log(json.length);
                    console.log(json);

                    console.log("this should print icky");


                    trHTML += "<thead><tr><th>Complete log</th></tr></thead>";



                    trHTML += "<tbody>";

                    for (var i = 0; i < json.length; i++) {


                        trHTML += "<tr>";
                        for (var stuff in json[i]) {
                            trHTML += "<td>" + json[i][stuff] + "<button type=\"button\" class=\"btn hoverButton\" data-bs-toggle=\"modal\" data-bs-target=\"#exampleModal0\" onclick=\"document.getElementById('modalLog').innerHTML = '" + json[i][stuff] + "'\"><i class=\"fa fa-clone\"></i></button></td>";
                            // trHTML += "<i class=\"fa fa-clone\"></i>";
                        }
                        // for (var j = 0; j < json[i].length; j++) {
                        //     trHTML += "<td>" + json[i][j] + "</td>";

                        // }


                        trHTML += "</tr>";
                    }
                    trHTML += "</tbody>";
                    console.log(trHTML);
                    $('#matchedLogs').append(trHTML);



                }

            }
        });

    }

    @action
    showAlert() {
        var fileName, separator;

        fileName = document.getElementById("fileName").files[0].name;
        separator = $('#separator').val();

        console.log("fileName is :" + fileName);
        console.log("separator is : " + separator);

        fileName = "D:\\" + fileName;

        $.ajax({
            type: 'POST',
            data: { fileName: fileName, separator: separator },
            url: 'upload',
            success: function (result) {
                console.log("file uploaded successfully");

                // console.log(result);
                var json = JSON.parse(result);
                console.log(json);
                var trHTML = "";
                if (json.length != 0) {
                    // trHTML += "<tr>";
                    // for (var i = 0; i < attributes.length; i++) {
                    //     trHTML += "<th>" + attributes[i] + "</th>";
                    // }
                    // trHTML += "</tr>";

                    console.log(json.length);
                    console.log(json);

                    console.log("this should print icky");
                    // console.log(json[2][0]);

                    // for(var stuff in json[2]){
                    //     console.log(stuff + " :: " + json[2][stuff]);
                    // }


                    trHTML += "<tr>";
                    for (var stuff in json[0]) {
                        trHTML += "<th>" + stuff + "</th>";
                    }
                    trHTML += "</tr>";


                    for (var i = 0; i < json.length; i++) {



                        trHTML += "<tr>";
                        for (var stuff in json[i]) {
                            trHTML += "<td>" + json[i][stuff] + "</td>";
                        }
                        // for (var j = 0; j < json[i].length; j++) {
                        //     trHTML += "<td>" + json[i][j] + "</td>";

                        // }
                        trHTML += "</tr>";
                    }
                    console.log(trHTML);
                    $('#matchedLogs').append(trHTML);


                }

            }
        });

    }
}


// export default file-selector(deleteFieldRow);