import Component from '@glimmer/component';

$('#report').hide();

// function changeTab(toTab) {
//     console.log("change tab to " + toTab + "now");
//     if(toTab == "report"){
//         $('#constraint').hide();
//         $('#report').show();

//         var element = document.getElementById("reportNavID");
//         element.classList.add("active");
//         element = document.getElementById("constraintNavID");
//         element.classList.remove("active");
//     } else {
//         $('#constraint').show();
//         $('#report').hide();
//         var element = document.getElementById("constraintNavID");
//         element.classList.add("active");
//         element = document.getElementById("reportNavID");
//         element.classList.remove("active");
//     }
// }

export default class TabsComponent extends Component {
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
