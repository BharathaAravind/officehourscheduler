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
                    str+='<td><a href="#" onclick="replyconfirmation(\''+data[i]['requestedby']+"','"+ data[i]['querytitle'] +"','"+ data[i]['querydescription']+"','"+ data[i]['bookingdate']+"','"+ data[i]['timeslot']+"')\"> Reply</a></td>";
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
var globalQueryData2 = "";
function replyconfirmation(requestedBy, queryTitle, queryDescription, bookingdate, timeslot){
    $("#createEventModal").modal('show');
    $('#queryTitle').val(queryTitle);
    $('#queryDescription').val(queryDescription);

    var body = $('#answerQueryDescription').val();
    var querydata = {
        "requestedBy": requestedBy,
        "queryDescription": body,
    };
    console.log(querydata);
    globalQueryData2 = querydata;
    console.log(globalQueryData2);
}

$('#sendemailBtn').on('click', function(e){
        // EMail
    e.preventDefault();
    $("#createEventModal").modal('hide');
    alert("h");
    var body = $('#answerQueryDescription').val();
    
    globalQueryData2["queryDescription"] = body;
    console.log(globalQueryData2);
    if(body.trim().length>0){
        $.post("php/sendemail.php", globalQueryData2,function(data) {
               console.log(data);
                if(data.trim()=="success"){
                    alert("Email sent successfully!");
                }else{
                    alert("Error occured. Try again later!");
                }
            });
    }else{
        alert("Reply cant be empty");
    }
});


$('#confirmslots').on('click', function(e){
    window.location = "/officehourscheduler/myconfirmationsta.html";
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