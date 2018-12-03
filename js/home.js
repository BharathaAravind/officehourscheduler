var selectDate = new Date();
$(function() {
    $(document).ready(function() { 
        $.getJSON("php/checksession.php", function(data){
            if(!data){
                window.location = "/officehourscheduler/index.html";
            }
        });

        $.getJSON( "php/getcalendardata.php", function( data ) {
            var scheduledevents = data[0]["bookings"];
            var filled = data[0]["filled"];
            var vacant = data[0]["vacant"];
            var courselist = data[0]["courselist"];
            var selectedcourse = data[0]["selectedcourse"];
            console.log(scheduledevents);
            console.log(filled);
            console.log(vacant);
            renderCalendar(scheduledevents, filled, vacant, courselist, selectedcourse);
        });
      });
  });
  
 $(document).on('change','#selectcoursedrop',function(){
    var newCourse = $("#selectcoursedrop option:selected" ).text();
    var queryData = {
        'selectedcourse': newCourse,
     };
    $.getJSON( "php/getcalendardata.php", queryData, function( data ) {
            var scheduledevents = data[0]["bookings"];
            var filled = data[0]["filled"];
            var vacant = data[0]["vacant"];
            var courselist = data[0]["courselist"];
            var selectedcourse = data[0]["selectedcourse"];
            console.log(scheduledevents);
            console.log(filled);
            console.log(vacant);
            $('#calendar').fullCalendar('destroy');
            renderCalendar(scheduledevents, filled, vacant, courselist, selectedcourse);
        });
});

$('#submitButton').on('click', function(e){
    
    var queryTitle = $("#queryTitle").val();
    var queryDesc = $("#queryDescription").val();
    var timeSlot = $("#selectedtimeslot option:selected" ).text();
    if(queryDesc.trim() =="" || queryTitle.trim() =="" || timeSlot.trim()=="Select Timeslot"){
        alert("Query Title or Description or timeslot can't be empty");
    }else{
      var strDate = moment(selectDate).format('YYYY-MM-DD');
      var newCourse = $("#selectcoursedrop option:selected" ).text();
      var querydata = {
        "title": queryTitle,
        "desc": queryDesc, 
        "timslot": timeSlot,
        "selectedate": strDate,
        "course": newCourse
      }
      $.post( "php/addbooking.php", querydata,function(data) {
        if(data.trim()=="success"){
            $("#createEventModal").modal('hide');
            $("#calendar").fullCalendar('renderEvent',
            {
              title: queryTitle,
              start: selectDate,
            },true);
          }else{
            alert("Some error occured. Try Again later");
          }
        });
      }

});
  
function renderCalendar(scheduledevents, filled, vacant, courselist, selectedcourse){
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
        height: 550,
        customButtons: {
          myCustomButton: {
            text: 'Check My Reservations',
            click: function() {
              window.location = "/officehourscheduler/myconfirmations.html";
            }
          }
        },       
        header: {
          left: 'prev,next',
          center: 'title',
          right: 'myCustomButton'
        },
        dayRender: function (date, cell) {
          if(filled.includes(moment(date).format('YYYY-MM-DD'))){
            cell.css("background-color", " #ff6666");
          }else if(vacant.includes(moment(date).format('YYYY-MM-DD'))){
            cell.css("background-color", " #85e085");
          }else{
            $(cell).addClass('disabled');
          }
      },
      dayClick: function(date, jsEvent, view) {
        var d1 = new Date(moment(date).format('YYYY-MM-DD'));
        var d1 = new Date(d1.setDate(d1.getDate() + 1));
        d1.setHours(0,0,0,0)
        var todayDate = new Date();
        todayDate.setHours(0,0,0,0)
        selectDate = date;
        if(d1.getTime()>todayDate.getTime()){
          if(filled.includes(moment(date).format('YYYY-MM-DD'))){
            alert("Office Hours are filled for this date");
          }else if(vacant.includes(moment(date).format('YYYY-MM-DD'))){
              var tempDate = moment(date).format('YYYY-MM-DD');
              var course = $("#selectcoursedrop option:selected" ).text();
              var queryData = {
                  'selecteddate': tempDate,
                  'course': course,
              };
              console.log(queryData);
              $.getJSON( "php/getvacanttimeslots.php", queryData, function( data ) {
                  console.log(data);
                  var timeslots = '<select id="selectedtimeslot" class="select_month form-control"><option value="select">Select Timeslot</option>';
                  for(var i=0;i<data.length;i++){
                    timeslots+='<option value='+data[i]+'>'+data[i]+'</option>';
                  }
                  timeslots+='</select>';
                  // var temp = '<select class="select_month form-control"><option value="1">Jan</option><option value="2">Feb</option><option value="3">Mrch</option><option value="4">Aprl</option><option value="5">May</option><option value="6">June</option><option value="7">July</option><option value="8">Aug</option><option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option></select>';
                  $("#emptytimeslots").html(timeslots);
                  $("#createEventModal").modal('show');
              });
              
          }else{
              alert("No office Hours on this date. Please select the dates highlighted in green");
          }
        }else{
          alert("Invalid Date selected");
        }
      }, 
        defaultDate: new Date(),
        navLinks: false,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: scheduledevents,
      });
    

     if($("#selectcoursedrop").length == 0) {
      var courseDropDown = '<select id="selectcoursedrop" class="select_month">';
      for(var i=0; i<courselist.length;i++){
        courseDropDown += "<option value="+courselist[i]+">"+courselist[i]+"</option>"
      }
      courseDropDown+="</select>";
      $(".fc-left").append(courseDropDown); 
      $('#selectcoursedrop option[value='+selectedcourse+']').attr('selected','selected');
    }
}