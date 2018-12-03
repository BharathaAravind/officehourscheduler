$(function() {
    $(document).ready(function() { 
        $.getJSON("php/checksession.php", function(data){
            if(!data){
                window.location = "/officehourscheduler/duo.php";
            }
        });

        $.getJSON( "php/getcourses.php", function( data ) {
           var str = "";
           for(var i=0;i<data.length;i++){
                str += "<option value='"+data[i]+"'>"+data[i]+"</option>";
           }
           $("#selectedcourse").html(str);
            var querydata = {
                course: data[0],
            };
            $.getJSON( "php/getscheduledslotsta.php", querydata, function( data ) {
                $(".confirmations-table").html("");    
                console.log(data);
                var str = `<tr>
                        <th>S.no</th>
                        <th>Query Title</th>
                        <th>Query Description</th>
                        <th>Asked By</th>
                        <th>Date and Timeslot</th>
                        <th>Reply</th>
                        <th>Confirm</th>
                    </tr>`;
                for(var i=0;i<data.length;i++){
                    console.log(i);
                    str += "<tr><td>"
                    str+=(i+1)+"</td>"
                    str+="<td>" + data[i]['querytitle'] + "</td>";
                    str+="<td>" + data[i]['querydescription'] + "</td>";
                    str+="<td>" + data[i]['requestedby'] + "</td>";
                    str+="<td>" + data[i]['bookingdate'] + " and "+ data[i]['timeslot'] +"</td>";
                    str+='<td><a href="#" onclick="replyconfirmation(\''+data[i]['course']+"','"+ data[i]['querytitle'] +"','"+ data[i]['querydescription']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Reply</a></td>";
                    str+='<td><a href="#" onclick="confirmconfirmation(\''+data[i]['course']+"','"+ data[i]['requestedby']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Confirm</a></td>";
                    str+="</tr>";
                }
                console.log(str);
                $(".confirmations-table").html(str); 
            }); 
        }); 
      });
    
});
var globalQueryData = "";
function replyconfirmation(course, queryTitle, queryDescription, bookingdate, timeslot){
    $("#createEventModal").modal('show');
    $('#queryTitle').val(queryTitle);
    $('#queryDescription').val(queryDescription);

    // EMail
    $('#answerQueryDescription').val();
    
    var querydata = {
        "course": course,
        "bookingdate": bookingdate,
        "timeslot": timeslot,
        "querytitle": queryTitle,
        "queryDescription": queryDescription,
    };
    globalQueryData = querydata;
}

$('#confirmslots').on('click', function(e){
    window.location = "/officehourscheduler/myconfirmationsta.html";
});

$('#addclasssubmitbtn').on('click', function(e){
    e.preventDefault();
    var coursename  = $('#coursename').val();
    var talist = $('#multipletaselector').val();
    var daylist = $('#multipledaysselector').val();
    var starttime = $('#starttimeselector').val();
    var endtime = $('#endtimeselector').val();
    // alert(coursename+coursename1+coursename2+coursename3+coursename4);
    // alert(talist.trim().length);
    if(coursename.trim().length==0||talist.length==0||daylist.length==0||starttime.trim().length==0||endtime.trim().length==0){
        alert("Fields can't be empty");
    }else{
        //Ajax call to delete make a php file
        var querydata = {
            "course": coursename,
            "talist": talist,
            "daylist": daylist,
            "starttime": starttime,
            "endtime": endtime,
        };
        $.post( "php/addcourse.php", querydata,function(data) {
            if(data.trim()==="success"){
                alert("Course added");
                $("#createClassModal").modal('hide');
            }else{
                alert("Error occured. Try again later!");
            }
        });
    }
});

$('#addclassbtn').on('click', function(e){
    // window.location = "/officehourscheduler/myconfirmationsta.html";
    $("#createClassModal").modal('show');

});


$(document).on('change','#selectedcourse',function(){
    $(".confirmations-table").html("");
    var newCourse = $("#selectedcourse option:selected" ).text();
    var queryData = {
        'course': newCourse,
     };
    $.getJSON( "php/getscheduledslotsta.php", queryData, function(data) {
            var str = `<tr>
                    <th>S.no</th>
                    <th>Query Title</th>
                    <th>Query Description</th>
                    <th>Asked By</th>
                    <th>Date and Timeslot</th>
                    <th>Reply</th>
                    <th>Confirm</th>
                </tr>`;
            for(var i=0;i<data.length;i++){
                console.log(i);
                str += "<tr><td>"
                str+=(i+1)+"</td>"
                str+="<td>" + data[i]['querytitle'] + "</td>";
                str+="<td>" + data[i]['querydescription'] + "</td>";
                str+="<td>" + data[i]['requestedby'] + "</td>";
                str+="<td>" + data[i]['bookingdate'] + " and "+ data[i]['timeslot'] +"</td>";
                str+='<td><a href="#" onclick="replyconfirmation(\''+data[i]['course']+"','"+ data[i]['querytitle'] +"','"+ data[i]['querydescription']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Reply</a></td>";
                str+='<td><a href="#" onclick="confirmconfirmation(\''+data[i]['course']+"','"+ data[i]['requestedby']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Confirm</a></td>";
                str+="</tr>";
            }
            $(".confirmations-table").html(str); 

    });
});

function confirmconfirmation(course, requestedby, bookingdate, timeslot){
    //Ajax call to delete make a php file
    var querydata = {
        "course": course,
        "requestedby": requestedby,
        "bookingdate": bookingdate,
        "timeslot": timeslot
    };
    $.post( "php/confirmbooking.php", querydata,function(data) {
        if(data.trim()=="success"){
            $("#createEventModal").modal('hide');
            window.location = "/officehourscheduler/hometa.html";
          }else{
            alert("Some error occured. Try Again later");
          }
    }); 
    
}

$('#submitButton').on('click', function(e){
    e.preventDefault();
    $("#createEventModal").modal('hide');
    var newQueryTitle = $('#queryTitle').val();
    var newQueryDesc = $('#queryDescription').val();
    if(newQueryDesc.trim()=="" || newQueryTitle.trim()==""){
        alert("Query Title or Description can't be empty");
    }else{
        console.log(globalQueryData);
        globalQueryData["querytitle"] = newQueryTitle;
        globalQueryData["queryDescription"] = newQueryDesc;
        $.post( "php/editbooking.php", globalQueryData,function(data) {
            if(data.trim()=="success"){
                $("#createEventModal").modal('hide');
                window.location = "/officehourscheduler/myconfirmations.html";
            }else{
                alert("Some error occured. Try Again later");
            }
        });
    }

});